const wizard = document.querySelector('#conciliation-wizard');
const steps = [...document.querySelectorAll('.wizard-step')];
const progressItems = [...document.querySelectorAll('[data-progress-step]')];
const previewElements = [...document.querySelectorAll('[data-preview]')];
const summaryElements = [...document.querySelectorAll('[data-summary]')];
const participantesTableBody = document.querySelector('[data-participantes-lista]');
const participantesResumoBody = document.querySelector('[data-summary-participantes]');
const attachmentsContainer = document.querySelector('[data-summary-attachments]');
const extraDocumentsContainer = document.querySelector('[data-extra-documentos]');
const assuntoSelect = document.querySelector('#acordo-assunto');
const baseDocumentInput = document.querySelector('#acordo-documento-base');
const advogadoDocumentoInput = document.querySelector('#advogado-documento');

const views = {
  landing: document.querySelector('[data-view="landing"]'),
  auth: document.querySelector('[data-view="auth"]'),
  wizard: document.querySelector('[data-view="wizard"]'),
};

const authForm = document.querySelector('#auth-form');
const openAuthButton = document.querySelector('[data-action="abrir-autenticacao"]');
const cancelAuthButton = document.querySelector('[data-action="voltar-inicio"]');

const previewDefaults = new Map(previewElements.map((node) => [node.dataset.preview, node.textContent]));
const summaryDefaults = new Map(summaryElements.map((node) => [node.dataset.summary, node.textContent]));

const autenticacaoMetodos = {
  govbr: 'Gov.br',
  pje: 'PJe',
};

const assuntoComplementos = {
  divorcio: ['Certidão de casamento atualizada', 'Esboço de partilha consensual'],
  dissolucao: ['Contrato de união estável', 'Manifestação de vontade assinada'],
  'reconhecimento-dissolucao': ['Declaração de convivência', 'Plano consensual de partilha e guarda'],
  guarda: ['Plano de convivência proposto', 'Certidão de nascimento dos filhos'],
  'revisao-convivencia': ['Termo vigente de convivência', 'Relato justificativo da revisão'],
  'fixacao-alimentos': ['Planilha de despesas do alimentando', 'Comprovantes atualizados de renda'],
  'revisao-alimentos': ['Decisão anterior de alimentos', 'Documentos que comprovam a alteração financeira'],
  'exoneracao-alimentos': ['Sentença ou acordo vigente de alimentos', 'Prova de autonomia do alimentado'],
  'execucao-alimentos': ['Planilha detalhada do débito', 'Comprovantes de tentativa prévia de cobrança'],
  'partilha-bens': ['Relação detalhada de bens', 'Documentos de propriedade atualizados'],
  'tutoria-animal': ['Declaração de guarda responsável', 'Registros veterinários recentes'],
  'levantamento-valor': ['Decisão autorizando o levantamento', 'Dados bancários do beneficiário'],
  inventario: ['Certidão de óbito', 'Relação de herdeiros e bens'],
};

const assuntosLabels = {
  divorcio: 'Divórcio',
  dissolucao: 'Dissolução de União Estável',
  'reconhecimento-dissolucao': 'Reconhecimento e dissolução de união estável',
  guarda: 'Guarda e convivência',
  'revisao-convivencia': 'Revisão de convivência',
  'fixacao-alimentos': 'Fixação de alimentos',
  'revisao-alimentos': 'Revisão de alimentos',
  'exoneracao-alimentos': 'Exoneração de alimentos',
  'execucao-alimentos': 'Execução de alimentos',
  'partilha-bens': 'Partilha de bens',
  'tutoria-animal': 'Tutoria (animal)',
  'levantamento-valor': 'Levantamento de valor',
  inventario: 'Inventário',
};

let currentStepIndex = 0;
let participanteEditIndex = null;

const state = {
  autenticacao: {
    metodo: '',
    descricao: 'Não autenticado',
    status: 'Aguardando acesso',
  },
  orientacoes: {
    ciente: false,
  },
  advogado: {
    nome: '',
    oab: '',
    whatsapp: '',
    email: '',
    documento: '',
  },
  participantes: [],
  acordo: {
    assunto: '',
    documentoBase: '',
    documentosExtras: {},
  },
  confirmacao: {
    ciente: false,
  },
  protocolo: '',
  dataEnvio: '',
};

function setPreview(key, value) {
  const nodes = previewElements.filter((node) => node.dataset.preview === key);
  if (!nodes.length) {
    return;
  }

  const defaultValue = previewDefaults.get(key) ?? '—';
  const text = value && typeof value === 'string' ? value.trim() : value;
  const finalValue = text ? text : defaultValue;

  nodes.forEach((node) => {
    node.textContent = finalValue;
  });
}

function setSummary(key, value) {
  const nodes = summaryElements.filter((node) => node.dataset.summary === key);
  if (!nodes.length) {
    return;
  }

  const defaultValue = summaryDefaults.get(key) ?? '—';
  const text = value && typeof value === 'string' ? value.trim() : value;
  const finalValue = text ? text : defaultValue;

  nodes.forEach((node) => {
    node.textContent = finalValue;
  });
}

function showView(view) {
  Object.entries(views).forEach(([name, element]) => {
    if (!element) {
      return;
    }

    if (name === view) {
      element.removeAttribute('hidden');
    } else {
      element.setAttribute('hidden', '');
    }
  });
}

function updateAuthPreview() {
  const metodo = state.autenticacao.descricao || 'Não autenticado';
  const status = state.autenticacao.status || 'Aguardando acesso';
  setPreview('autenticacaoMetodo', metodo);
  setPreview('autenticacaoStatus', status);
  setSummary('autenticacaoMetodo', metodo);
  setSummary('autenticacaoStatus', status);
}

function focusFirstField(step) {
  const focusable = step.querySelector(
    'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );

  if (focusable) {
    try {
      focusable.focus({ preventScroll: true });
    } catch (error) {
      focusable.focus();
    }
  }
}

function updateProgress() {
  progressItems.forEach((item, index) => {
    item.classList.toggle('is-active', index === currentStepIndex);
    item.classList.toggle('is-complete', index < currentStepIndex);
  });
}

function showStep(index) {
  const nextIndex = Math.min(Math.max(index, 0), steps.length - 1);
  const newStep = steps[nextIndex];

  if (!newStep) {
    return;
  }

  currentStepIndex = nextIndex;

  steps.forEach((step, stepIndex) => {
    const isActive = stepIndex === currentStepIndex;

    if (isActive) {
      step.classList.add('is-active');
      step.removeAttribute('hidden');
    } else {
      step.classList.remove('is-active');
      step.setAttribute('hidden', '');
    }
  });

  updateProgress();
  focusFirstField(newStep);

  if (newStep.dataset.step === 'confirmacao') {
    renderResumo();
  }
}

function validateCurrentStep() {
  const step = steps[currentStepIndex];
  const stepId = step.dataset.step;

  if (stepId === 'orientacoes') {
    const checkbox = step.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) {
      checkbox.reportValidity();
      return false;
    }
    return true;
  }

  if (stepId === 'advogado') {
    const fields = step.querySelectorAll('input, select, textarea');
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  if (stepId === 'participantes') {
    if (!state.participantes.length) {
      alert('Inclua pelo menos um participante para continuar.');
      return false;
    }
    return true;
  }

  if (stepId === 'acordo') {
    if (!assuntoSelect.value) {
      assuntoSelect.reportValidity();
      return false;
    }

    if (!state.acordo.documentoBase) {
      alert('Anexe o documento do acordo assinado.');
      return false;
    }

    const extras = assuntoComplementos[assuntoSelect.value] ?? [];
    for (const label of extras) {
      if (!state.acordo.documentosExtras[label]) {
        alert(`Anexe o arquivo solicitado: ${label}.`);
        return false;
      }
    }

    return true;
  }

  if (stepId === 'confirmacao') {
    const checkbox = step.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) {
      checkbox.reportValidity();
      return false;
    }
    return true;
  }

  return true;
}

function handleNext() {
  if (!validateCurrentStep()) {
    return;
  }

  showStep(currentStepIndex + 1);
}

function handlePrevious() {
  showStep(currentStepIndex - 1);
}

function renderParticipantes() {
  if (!participantesTableBody) {
    return;
  }

  participantesTableBody.innerHTML = '';

  if (!state.participantes.length) {
    participantesTableBody.innerHTML =
      '<tr class="placeholder"><td colspan="5">Inclua pelo menos um participante para continuar.</td></tr>';
  } else {
    state.participantes.forEach((participante, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${participante.nome}</td>
        <td>${participante.documento}</td>
        <td>${participante.email}<br /><small>${participante.whatsapp}</small></td>
        <td>${participante.cidade}/${participante.uf}</td>
        <td>
          <button type="button" class="link" data-action="editar-participante" data-index="${index}">Editar</button>
          <button type="button" class="link link--danger" data-action="remover-participante" data-index="${index}">Excluir</button>
        </td>
      `;
      participantesTableBody.appendChild(row);
    });
  }

  const resumo = state.participantes.length
    ? `${state.participantes.length} participante(s) incluído(s)`
    : 'Nenhum participante cadastrado até o momento.';

  setPreview('participantesQuantidade', resumo);
  renderResumoParticipantes();
}

function renderResumoParticipantes() {
  if (!participantesResumoBody) {
    return;
  }

  participantesResumoBody.innerHTML = '';

  if (!state.participantes.length) {
    participantesResumoBody.innerHTML = '<tr><td colspan="5">Nenhum participante incluído.</td></tr>';
    return;
  }

  state.participantes.forEach((participante) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${participante.nome}</td>
      <td>${participante.documento}</td>
      <td>${participante.sexo}</td>
      <td>${participante.email}<br /><small>${participante.whatsapp}</small></td>
      <td>${participante.endereco}, ${participante.numero} - ${participante.complemento}<br />${participante.bairro} - ${participante.cidade}/${participante.uf}</td>
    `;
    participantesResumoBody.appendChild(row);
  });
}

function renderAttachments() {
  if (!attachmentsContainer) {
    return;
  }

  attachmentsContainer.innerHTML = '';

  const extras = assuntoComplementos[state.acordo.assunto] ?? [];
  if (!extras.length) {
    return;
  }

  const list = document.createElement('ul');
  list.classList.add('attachments__list');

  extras.forEach((label) => {
    const item = document.createElement('li');
    const arquivo = state.acordo.documentosExtras[label] || 'Documento não anexado';
    item.textContent = `${label}: ${arquivo}`;
    list.appendChild(item);
  });

  attachmentsContainer.appendChild(list);
}

function renderResumo() {
  updateAuthPreview();
  setSummary('advogadoNome', state.advogado.nome);
  setSummary('advogadoOab', state.advogado.oab);
  setSummary('advogadoWhatsapp', state.advogado.whatsapp);
  setSummary('advogadoEmail', state.advogado.email);
  setSummary('advogadoDocumento', state.advogado.documento || 'Documento não anexado');

  setSummary('acordoAssunto', assuntosLabels[state.acordo.assunto] || '—');
  setSummary('acordoDocumentoBase', state.acordo.documentoBase || 'Documento não anexado');

  renderResumoParticipantes();
  renderAttachments();
}

function resetParticipanteForm() {
  const selectors = [
    '#participante-nome',
    '#participante-documento',
    '#participante-email',
    '#participante-whatsapp',
    '#participante-cep',
    '#participante-endereco',
    '#participante-numero',
    '#participante-complemento',
    '#participante-bairro',
    '#participante-cidade',
  ];

  selectors.forEach((selector) => {
    const field = wizard.querySelector(selector);
    if (field) {
      field.value = '';
    }
  });

  const sexoField = wizard.querySelector('#participante-sexo');
  if (sexoField) {
    sexoField.selectedIndex = 0;
  }

  const ufField = wizard.querySelector('#participante-uf');
  if (ufField) {
    ufField.selectedIndex = 0;
  }

  participanteEditIndex = null;
  const actionButton = wizard.querySelector('[data-action="adicionar-participante"]');
  if (actionButton) {
    actionButton.textContent = 'Incluir participante';
  }
}

function getParticipanteFromForm() {
  const getField = (selector) => {
    const field = wizard.querySelector(selector);
    return field ? field.value.trim() : '';
  };

  const participante = {
    nome: getField('#participante-nome'),
    documento: getField('#participante-documento'),
    sexo: getField('#participante-sexo'),
    email: getField('#participante-email'),
    whatsapp: getField('#participante-whatsapp'),
    cep: getField('#participante-cep'),
    endereco: getField('#participante-endereco'),
    numero: getField('#participante-numero'),
    complemento: getField('#participante-complemento'),
    bairro: getField('#participante-bairro'),
    cidade: getField('#participante-cidade'),
    uf: getField('#participante-uf'),
  };

  for (const value of Object.values(participante)) {
    if (!value) {
      alert('Preencha todos os campos do participante antes de incluir.');
      return null;
    }
  }

  return participante;
}

function handleAddParticipante() {
  const participante = getParticipanteFromForm();
  if (!participante) {
    return;
  }

  if (participanteEditIndex !== null && state.participantes[participanteEditIndex]) {
    state.participantes[participanteEditIndex] = participante;
  } else {
    state.participantes.push(participante);
  }

  resetParticipanteForm();
  renderParticipantes();
}

function handleParticipantesTableClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const index = Number.parseInt(button.dataset.index, 10);
  if (Number.isNaN(index)) {
    return;
  }

  if (button.dataset.action === 'remover-participante') {
    state.participantes.splice(index, 1);
    renderParticipantes();
    return;
  }

  if (button.dataset.action === 'editar-participante') {
    const participante = state.participantes[index];
    if (!participante) {
      return;
    }

    participanteEditIndex = index;
    wizard.querySelector('#participante-nome').value = participante.nome;
    wizard.querySelector('#participante-documento').value = participante.documento;
    wizard.querySelector('#participante-sexo').value = participante.sexo;
    wizard.querySelector('#participante-email').value = participante.email;
    wizard.querySelector('#participante-whatsapp').value = participante.whatsapp;
    wizard.querySelector('#participante-cep').value = participante.cep;
    wizard.querySelector('#participante-endereco').value = participante.endereco;
    wizard.querySelector('#participante-numero').value = participante.numero;
    wizard.querySelector('#participante-complemento').value = participante.complemento;
    wizard.querySelector('#participante-bairro').value = participante.bairro;
    wizard.querySelector('#participante-cidade').value = participante.cidade;
    wizard.querySelector('#participante-uf').value = participante.uf;

    const actionButton = wizard.querySelector('[data-action="adicionar-participante"]');
    actionButton.textContent = 'Atualizar participante';
  }
}

function handleBuscarCep() {
  const cepField = wizard.querySelector('#participante-cep');
  const cep = (cepField.value || '').replace(/\D/g, '');

  if (cep.length !== 8) {
    alert('Informe um CEP válido com 8 dígitos.');
    return;
  }

  wizard.querySelector('#participante-endereco').value = 'Rua Exemplo';
  wizard.querySelector('#participante-bairro').value = 'Centro';
  wizard.querySelector('#participante-cidade').value = 'Brasília';
  wizard.querySelector('#participante-uf').value = 'DF';
  setTimeout(() => {
    const numeroField = wizard.querySelector('#participante-numero');
    numeroField?.focus();
  }, 50);
}

function renderExtraDocumentos() {
  if (!extraDocumentsContainer) {
    return;
  }

  extraDocumentsContainer.innerHTML = '';
  state.acordo.documentosExtras = {};

  const assunto = assuntoSelect?.value ?? '';
  const extras = assuntoComplementos[assunto] ?? [];

  extras.forEach((label, index) => {
    const field = document.createElement('div');
    field.classList.add('field');
    const inputId = `acordo-extra-${index}`;
    field.innerHTML = `
      <label for="${inputId}">${label} (PDF)</label>
      <input type="file" id="${inputId}" accept="application/pdf" data-extra-label="${label}" required />
    `;
    extraDocumentsContainer.appendChild(field);
  });

  renderAttachments();
}

function handleAssuntoChange() {
  state.acordo.assunto = assuntoSelect.value;
  renderExtraDocumentos();
  setPreview('acordoAssunto', assuntosLabels[state.acordo.assunto] || 'Assunto não selecionado');
}

function handleFileUpdate(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'file') {
    return;
  }

  const [file] = input.files || [];
  const fileName = file ? file.name : '';

  if (input.dataset.field === 'advogadoDocumento') {
    state.advogado.documento = fileName;
    setSummary('advogadoDocumento', fileName || 'Documento não anexado');
    return;
  }

  if (input.dataset.field === 'acordoDocumentoBase') {
    state.acordo.documentoBase = fileName;
    setSummary('acordoDocumentoBase', fileName || 'Documento não anexado');
    renderAttachments();
    return;
  }

  if (input.dataset.extraLabel) {
    state.acordo.documentosExtras[input.dataset.extraLabel] = fileName;
    renderAttachments();
  }
}

function updateAdvogadoPreview() {
  setPreview('advogadoNome', state.advogado.nome);
  setPreview('advogadoOab', state.advogado.oab);
  setPreview('advogadoWhatsapp', state.advogado.whatsapp);
  setPreview('advogadoEmail', state.advogado.email);
}

function handleAdvogadoInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.name === 'advogadoNome') {
    state.advogado.nome = target.value;
  }
  if (target.name === 'advogadoOab') {
    state.advogado.oab = target.value;
  }
  if (target.name === 'advogadoWhatsapp') {
    state.advogado.whatsapp = target.value;
  }
  if (target.name === 'advogadoEmail') {
    state.advogado.email = target.value;
  }

  updateAdvogadoPreview();
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== 'checkbox') {
    return;
  }

  if (checkbox.name === 'orientacoesCiente') {
    state.orientacoes.ciente = checkbox.checked;
    setPreview('orientacoesCiente', checkbox.checked ? 'Leitura confirmada' : 'Pendente de leitura');
  }

  if (checkbox.name === 'confirmacaoCiente') {
    state.confirmacao.ciente = checkbox.checked;
    setPreview('confirmacaoCiente', checkbox.checked ? 'Confirmação registrada' : 'Aguardando confirmação');
  }
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  gerarProtocolo();
  showStep(currentStepIndex + 1);
}

function gerarProtocolo() {
  const now = new Date();
  const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  state.protocolo = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${randomSuffix}`;
  state.dataEnvio = now.toLocaleString('pt-BR');

  setSummary('protocolo', state.protocolo);
  setSummary('dataEnvio', state.dataEnvio);
}

function resetWizard(options = {}) {
  const { keepAuth = false } = options;

  wizard.reset();
  resetParticipanteForm();
  participanteEditIndex = null;
  state.orientacoes.ciente = false;
  state.advogado = {
    nome: '',
    oab: '',
    whatsapp: '',
    email: '',
    documento: '',
  };
  state.participantes = [];
  state.acordo = {
    assunto: '',
    documentoBase: '',
    documentosExtras: {},
  };
  state.confirmacao.ciente = false;
  state.protocolo = '';
  state.dataEnvio = '';

  if (!keepAuth) {
    state.autenticacao = {
      metodo: '',
      descricao: 'Não autenticado',
      status: 'Aguardando acesso',
    };
  }

  previewElements.forEach((node) => {
    const key = node.dataset.preview;
    if (keepAuth && (key === 'autenticacaoMetodo' || key === 'autenticacaoStatus')) {
      return;
    }
    node.textContent = previewDefaults.get(key) ?? '—';
  });

  summaryElements.forEach((node) => {
    const key = node.dataset.summary;
    if (keepAuth && (key === 'autenticacaoMetodo' || key === 'autenticacaoStatus')) {
      return;
    }
    node.textContent = summaryDefaults.get(key) ?? '—';
  });

  renderParticipantes();
  renderAttachments();
  renderExtraDocumentos();
  updateAuthPreview();

  showStep(0);
}

function handleRestart() {
  resetWizard({ keepAuth: true });
  showStep(0);
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const formData = new FormData(authForm);
  const metodo = formData.get('metodoAutenticacao');

  if (!metodo || typeof metodo !== 'string') {
    alert('Selecione o método de autenticação para continuar.');
    return;
  }

  const descricao = autenticacaoMetodos[metodo] || 'Método não identificado';
  state.autenticacao = {
    metodo,
    descricao,
    status: `Sessão autenticada via ${descricao}`,
  };

  updateAuthPreview();
  authForm.reset();
  resetWizard({ keepAuth: true });
  showView('wizard');
}

function handleOpenAuth() {
  showView('auth');
}

function handleCancelAuth() {
  authForm?.reset();
  showView('landing');
}

function init() {
  if (!wizard) {
    return;
  }

  resetWizard();
  showView('landing');

  wizard.addEventListener('click', (event) => {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton) {
      return;
    }

    const { action } = actionButton.dataset;

    if (action === 'next') {
      handleNext();
    }

    if (action === 'previous') {
      handlePrevious();
    }

    if (action === 'adicionar-participante') {
      handleAddParticipante();
    }

    if (action === 'limpar-participante') {
      resetParticipanteForm();
    }

    if (action === 'buscar-cep') {
      handleBuscarCep();
    }

    if (action === 'restart') {
      handleRestart();
    }
  });

  wizard.addEventListener('change', (event) => {
    handleCheckboxChange(event);
    handleFileUpdate(event);
  });

  wizard.addEventListener('input', (event) => {
    handleAdvogadoInput(event);
  });

  participantesTableBody?.addEventListener('click', handleParticipantesTableClick);
  assuntoSelect?.addEventListener('change', handleAssuntoChange);
  baseDocumentInput?.addEventListener('change', handleFileUpdate);
  advogadoDocumentoInput?.addEventListener('change', handleFileUpdate);
  extraDocumentsContainer?.addEventListener('change', handleFileUpdate);
  wizard.addEventListener('submit', handleSubmit);

  openAuthButton?.addEventListener('click', handleOpenAuth);
  cancelAuthButton?.addEventListener('click', handleCancelAuth);
  authForm?.addEventListener('submit', handleAuthSubmit);
}

init();
