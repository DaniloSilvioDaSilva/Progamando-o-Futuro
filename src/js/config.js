const ACCOUNT = {
  student: 'estudante',
  company: 'empresa',
};

const CALENDAR_URL = 'https://calendar.google.com/calendar/render';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1';

const CFG = {
  links: {
    siepe: 'https://siepe.educacao.pe.gov.br',
    google: 'https://accounts.google.com',
    maps: (query) => `${MAPS_URL}&query=${encodeURIComponent(query)}`,
    calendar: (course) => {
      const text = encodeURIComponent(
        `${course.title} - ${course.organization}`,
      );
      const place = encodeURIComponent(course.location);
      return `${CALENDAR_URL}?action=TEMPLATE&text=${text}&location=${place}`;
    },
  },

  glowColors: ['#e53935', '#ef7a72', '#f5c518', '#8fd96b', '#2e9e4f'],
  emojiFaces: ['😠', '🙁', '😐', '🙂', '😄'],

  areas: [
    'Cuidado e saúde',
    'Design gráfico',
    'Tecnologia',
    'Gestão e liderança',
  ],

  quiz: [
    {
      question: 'Qual atividade mais desperta o seu interesse?',
      options: [
        'Cuidar de pessoas e ajudá-las.',
        'Criar, desenhar e desenvolver ideias.',
        'Trabalhar com tecnologia e inovação.',
        'Organizar projetos, liderar e tomar decisões.',
      ],
    },
    {
      question: 'Qual habilidade melhor representa você?',
      options: [
        'Sei ouvir, compreender e acolher pessoas.',
        'Sou criativo(a) e gosto de imaginar coisas novas.',
        'Gosto de raciocinar e resolver problemas.',
        'Tenho facilidade em me comunicar, argumentar e liderar.',
      ],
    },
    {
      question: 'O que você mais valoriza em uma futura profissão?',
      options: [
        'Ajudar pessoas a melhorar suas vidas.',
        'Ter liberdade para criar e expressar minhas ideias.',
        'Inovar, aprender e enfrentar desafios.',
        'Ter oportunidades de crescimento e estabilidade financeira.',
      ],
    },
  ],

  scaleQuestions: [
    'Você gostaria de trabalhar ajudando e cuidando de outras pessoas?',
    'Você gosta de criar coisas novas, desenvolver ideias e usar sua criatividade?',
    'Você gosta de resolver problemas, descobrir como as coisas funcionam e utilizar a tecnologia?',
  ],

  skills: [
    {
      name: 'Lógica de programação',
      level: 38,
      text: 'Estou começando. Entendo sequências e condições, e quero praticar mais com HTML e Python.',
    },
    {
      name: 'Matemática',
      level: 52,
      text: 'Operações, proporção e problemas do dia a dia. Preciso treinar mais geometria e gráficos.',
    },
    {
      name: 'Artes',
      level: 89,
      text: 'Desenho, cor e composição. Já criei cartazes e ilustrações para eventos da escola e do bairro.',
    },
  ],

  grades: [
    { subject: 'Língua Portuguesa', value: 7.7 },
    { subject: 'Matemática', value: 5.2 },
    { subject: 'História', value: 6.7 },
    { subject: 'Geografia', value: 7.0 },
    { subject: 'Biologia', value: 6.2 },
    { subject: 'Artes', value: 8.9 },
    { subject: 'Educação Física', value: 9.0 },
    { subject: 'Língua Inglesa', value: 7.0 },
  ],

  courses: [
    {
      id: 1,
      title: 'Curso de design gráfico',
      organization: 'ETEPD',
      image: 'design.png',
      tag: '@design is my passion',
      areaIndex: 1,
      schedule: 'Terças e quintas, 14:30-16:30',
      mode: 'Presencial',
      duration: '8 semanas',
      frequency: '2x por semana',
      price: 'Grátis',
      minAge: '14+',
      seats: 11,
      startDate: 'terça, 3 de novembro de 2026',
      time: '14:30-16:30',
      location: 'ETEPD, Sala 4 - Rua Exemplo, 100',
      about: 'Um curso de design para todas as idades! Aprenda a criar artes, desenvolver identidades visuais e dar vida às suas ideias com Canva, Figma e Photoshop, mesmo começando do zero.',
      audience: 'Para quem quer aprender design, mesmo começando do zero.',
      learning: [
        'Prototipagem de interfaces',
        'Edição de imagens',
        'Pôsteres das suas bandas favoritas',
      ],
      tools: ['Figma', 'Canva', 'Photoshop'],
    },
    {
      id: 2,
      title: 'Curso de Programação',
      organization: 'ETEPD',
      image: 'programacao.png',
      tag: 'HTML, CSS e Python',
      areaIndex: 2,
      schedule: 'Segundas e quartas, 17:00-19:00',
      mode: 'Presencial',
      duration: '10 semanas',
      frequency: '2x por semana',
      price: 'Grátis',
      minAge: '14+',
      seats: 8,
      startDate: 'segunda, 9 de novembro de 2026',
      time: '17:00-19:00',
      location: 'ETEPD, Lab. 2 - Rua Exemplo, 100',
      about: 'Aprenda HTML, CSS, JavaScript e Python criando pequenos projetos que você pode mostrar para o mundo.',
      audience: 'Para quem gosta de tecnologia e quer criar o primeiro projeto.',
      learning: [
        'Páginas web do zero',
        'Lógica de programação',
        'Seu primeiro portfólio',
      ],
      tools: ['VS Code', 'GitHub', 'Python'],
    },
    {
      id: 3,
      title: 'Programando o futuro',
      organization: 'CESAR',
      image: 'futuro.png',
      tag: 'ENEM e carreira',
      areaIndex: 3,
      schedule: 'Sábados, 09:00-12:00',
      mode: 'Presencial',
      duration: '12 semanas',
      frequency: '1x por semana',
      price: 'Grátis',
      minAge: '15+',
      seats: 20,
      startDate: 'sábado, 7 de novembro de 2026',
      time: '09:00-12:00',
      location: 'CESAR School, Recife Antigo',
      about: 'Preparação com projetos em grupo, orientação de carreira e mentoria com profissionais da área.',
      audience: 'Para jovens que querem se preparar para o ENEM e para a carreira.',
      learning: [
        'Projetos em equipe',
        'Comunicação e liderança',
        'Planejamento de carreira',
      ],
      tools: ['Trello', 'Miro'],
    },
    {
      id: 4,
      title: 'Design de interfaces',
      organization: 'CESAR',
      image: 'vias.png',
      tag: 'UX para iniciantes',
      areaIndex: 1,
      schedule: 'Sextas, 14:00-17:00',
      mode: 'Híbrido',
      duration: '6 semanas',
      frequency: '1x por semana',
      price: 'Grátis',
      minAge: '14+',
      seats: 15,
      startDate: 'sexta, 13 de novembro de 2026',
      time: '14:00-17:00',
      location: 'CESAR School, Recife Antigo',
      about: 'Aprenda a desenhar telas simples e fáceis de usar, do rabisco ao protótipo clicável.',
      audience: 'Para quem tem curiosidade sobre como as telas são pensadas.',
      learning: ['Wireframes', 'Protótipos no Figma', 'Testes com usuários'],
      tools: ['Figma'],
    },
  ],
};

const PASSWORD_RULES = [
  { label: '1 letra', test: (value) => /[A-Za-zÀ-ú]/.test(value) },
  {
    label: '1 número ou caractere especial (ex.: #?!&)',
    test: (value) => /[\d\W_]/.test(value),
  },
  { label: '10 caracteres', test: (value) => value.length >= 10 },
];
