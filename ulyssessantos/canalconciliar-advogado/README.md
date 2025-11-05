# Canal Conciliar (Angular + PrimeNG)

Projeto front-end em Angular criado para reproduzir o fluxo simplificado de solicitação de conciliação do portal [Canal Conciliar do TJDFT](https://canalconciliar.tjdft.jus.br/).

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Instalação

```bash
npm install
```

## Servidor de desenvolvimento

```bash
npm start
```

A aplicação ficará disponível em `http://localhost:4200/`.

## Visualização rápida sem dependências

Caso o ambiente não permita instalar os pacotes do Angular/PrimeNG, use a pré-visualização estática que acompanha o projeto:

```bash
python -m http.server 4200 --directory preview
```

Depois é só abrir `http://localhost:4200/` no navegador. A pré-visualização simula o fluxo "Sou advogado" com:

- Tela inicial inspirada na página pública, destacando o botão "Sou advogado" e um passo de autenticação Gov.br ou PJe antes do formulário.
- Jornada obrigatória em seis etapas (orientações, dados do advogado, participantes, acordo, confirmação e finalização) com travas por etapa.
- Inclusão de participantes com busca de CEP simulada, tabela com edição/remoção e espelho automático nas seções de resumo.
- Seleção do assunto do acordo com uploads em PDF vinculados a cada domínio e painel de confirmação antes da geração do protocolo simulado.

## Build de produção

```bash
npm run build
```

Os artefatos otimizados serão gerados em `dist/canalconciliar`.

## Testes unitários

```bash
npm test
```

Os testes são executados com Karma e Jasmine.
