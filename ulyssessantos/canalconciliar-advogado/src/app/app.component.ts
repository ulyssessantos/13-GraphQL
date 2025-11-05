import { Component } from '@angular/core';

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
}

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  linkLabel: string;
}

interface AgendaItem {
  date: string;
  label: string;
  time: string;
  location: string;
}

interface NewsItem {
  tag: string;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly heroSlides: HeroSlide[] = [
    {
      title: 'Audiências de Conciliação',
      subtitle: 'Canais oficiais do TJDFT',
      description:
        'Acompanhe transmissões ao vivo, orientações de conciliação e conteúdos exclusivos preparados para aproximar o cidadão da Justiça.',
      ctaLabel: 'Assistir agora',
    },
    {
      title: 'Semana Nacional da Conciliação',
      subtitle: 'Programação especial',
      description:
        'Confira os destaques da semana, participe das ações itinerantes e conheça histórias de quem já resolveu conflitos com diálogo.',
      ctaLabel: 'Ver programação',
    },
    {
      title: 'Mediação On-line',
      subtitle: 'Agende o seu atendimento',
      description:
        'Serviços 100% digitais para quem precisa resolver demandas de forma simples, gratuita e com apoio de especialistas do TJDFT.',
      ctaLabel: 'Solicitar serviço',
    },
  ];

  readonly serviceCards: ServiceCard[] = [
    {
      icon: 'pi pi-play-circle',
      title: 'Transmissão ao vivo',
      description:
        'Assista às sessões de conciliação em tempo real diretamente do estúdio do Canal Conciliar.',
      linkLabel: 'Acessar player',
    },
    {
      icon: 'pi pi-calendar-plus',
      title: 'Agenda de audiências',
      description:
        'Consulte horários, unidades participantes e organize-se para acompanhar os próximos encontros.',
      linkLabel: 'Ver agenda completa',
    },
    {
      icon: 'pi pi-comments',
      title: 'Orientação ao cidadão',
      description:
        'Conte com tutoriais, materiais explicativos e suporte para iniciar um processo de conciliação.',
      linkLabel: 'Saiba como participar',
    },
  ];

  readonly agenda: AgendaItem[] = [
    {
      date: '18 MAR',
      label: 'Mutirão de Conciliação',
      time: '09h às 17h',
      location: 'Fórum de Brasília - Salão Nobre',
    },
    {
      date: '21 MAR',
      label: 'Webinário Mediação Digital',
      time: '10h',
      location: 'YouTube Canal Conciliar',
    },
    {
      date: '26 MAR',
      label: 'Oficina de Boas Práticas',
      time: '14h às 16h',
      location: 'Centro Judiciário de Solução de Conflitos',
    },
  ];

  readonly news: NewsItem[] = [
    {
      tag: 'Destaque',
      title: 'TJDFT amplia rede de conciliação com novos polos regionais',
      description:
        'Unidades em Ceilândia e Taguatinga passam a oferecer serviços de mediação e conciliação com atendimento híbrido.',
      date: 'Publicado em 6 de março de 2025',
    },
    {
      tag: 'Histórias',
      title: 'Acordo entre consumidores e empresa de tecnologia evita ação judicial',
      description:
        'Cidadãos firmaram acordo durante sessão transmitida ao vivo no Canal Conciliar e resolveram o conflito em 30 minutos.',
      date: 'Publicado em 28 de fevereiro de 2025',
    },
    {
      tag: 'Serviço',
      title: 'Mutirões itinerantes levam conciliação a comunidades do DF',
      description:
        'Equipe multidisciplinar estará em três regiões administrativas oferecendo atendimentos e orientações gratuitas.',
      date: 'Publicado em 20 de fevereiro de 2025',
    },
  ];

  readonly featuredVideo = {
    title: 'Conheça o Canal Conciliar',
    description:
      'Uma série especial mostrando bastidores, servidores e cidadãos que acreditam no poder do diálogo.',
    duration: '4min45s',
  };

  readonly supportChannels = [
    {
      title: 'WhatsApp do cidadão',
      description: 'Esclareça dúvidas rápidas sobre conciliação via atendimento humanizado.',
      icon: 'pi pi-whatsapp',
    },
    {
      title: 'Central telefônica',
      description: 'Equipe especializada disponível de segunda a sexta, das 8h às 18h.',
      icon: 'pi pi-phone',
    },
    {
      title: 'Atendimento presencial',
      description: 'Visite o Centro Judiciário de Solução de Conflitos mais próximo de você.',
      icon: 'pi pi-map-marker',
    },
  ];

  readonly partners = [
    'Núcleo Permanente de Métodos Consensuais de Solução de Conflitos (NUPECON)',
    'Conselho Nacional de Justiça',
    'Escola de Administração Judiciária',
    'Universidades parceiras do DF',
  ];
}
