const welcomeData = () => {
  const isCompanyAccount = state.signup.type === ACCOUNT.company;
  return {
    studentSelected: !isCompanyAccount,
    companySelected: isCompanyAccount,
    email: state.signup.email || '',
    siepeUrl: CFG.links.siepe,
    googleUrl: CFG.links.google,
  };
};

const GENDERS = [
  'Homem',
  'Mulher',
  'Não Binário',
  'Outro',
  'Prefiro não dizer',
];
const MONTHS = [
  'Mês', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
const TERMS = [
  'Não quero receber e-mails de marketing do LudoVia.',
  'Compartilhar meus dados cadastrais com os provedores de conteúdo do LudoVia para fins de marketing.',
  'O LudoVia é um serviço personalizado. Eu concordo com os Termos e Condições de Uso do LudoVia. (obrigatório)',
];

const signupStep = (step) => (['2', '3'].includes(step) ? Number(step) : 1);

const signupData = (step) => {
  const number = signupStep(step);
  const isCompanyAccount = state.signup.type === ACCOUNT.company;
  return {
    ...signupHeaderData(number),
    isPasswordStep: number === 1,
    isStudentStep: number === 2 && !isCompanyAccount,
    isCompanyStep: number === 2 && isCompanyAccount,
    isTermsStep: number === 3,
    passwordNextDisabled: true,
    finishDisabled: true,
    name: state.signup.name || '',
    rules: PASSWORD_RULES.map(({ label }) => ({ text: `○ ${label}` })),
    genders: GENDERS.map((value) => ({ value })),
    months: MONTHS.map((label, value) => ({ label, value })),
    terms: TERMS.map((text, index) => ({ text, index })),
  };
};

const quizQuestions = () => CFG.quiz.map(
  ({ question, options }, questionIndex) => ({
    question,
    options: options.map((text, optionIndex) => ({
      text,
      questionIndex,
      optionIndex,
      active: state.quizAnswers[questionIndex] === optionIndex,
    })),
  }),
);

const scaleQuestions = () => CFG.scaleQuestions.map(
  (question, questionIndex) => ({
    question,
    faces: CFG.emojiFaces.map((face, value) => ({
      face,
      value,
      questionIndex,
      label: `Opção ${value + 1}`,
      glow: CFG.glowColors[value],
      active: state.scaleAnswers[questionIndex] === value,
    })),
  }),
);

const onboardingData = () => {
  const isQuizStep = ui.quizStep === 0;
  return {
    isQuizStep,
    isScaleStep: !isQuizStep,
    quizQuestions: isQuizStep ? quizQuestions() : [],
    scaleQuestions: isQuizStep ? [] : scaleQuestions(),
  };
};

const interestScore = (course) => (
  state.interests.includes(CFG.areas[course.areaIndex]) ? 1 : 0
);

const homeData = () => ({
  courses: [...allCourses()]
    .sort((a, b) => interestScore(b) - interestScore(a))
    .map(courseCardData),
});

const myCoursesData = () => {
  const company = isCompany();
  const tab = ui.coursesTab || (company ? 'owned' : 'enrolled');
  const courses = {
    owned: state.customCourses.filter(
      (course) => course.owner === state.user.email,
    ),
    enrolled: state.enrolledIds.map(findCourse),
    saved: state.savedIds.map(findCourse),
  };
  const labels = [
    ...(company ? [['owned', 'Publicados']] : []),
    ['enrolled', 'Inscritos'],
    ['saved', 'Salvos'],
  ];
  const cards = (name) => (tab === name ? courses[name].map(courseCardData) : []);

  return {
    greeting: `Olá, ${firstName()}! ${
      company ? 'Seus cursos e inscrições' : 'Suas vias até aqui'}`,
    topHref: company ? '#/novo-curso' : '#/inicio',
    topLabel: company ? 'Adicionar curso' : 'Encontrar mais vias',
    tabs: labels.map(([name, label]) => ({
      tab: name,
      label: `${label} (${courses[name].length})`,
      active: name === tab,
      inactive: name !== tab,
    })),
    ownedCourses: cards('owned'),
    enrolledCourses: cards('enrolled'),
    savedCourses: cards('saved'),
    isEmpty: courses[tab].length === 0,
  };
};

const COURSE_MODES = ['Online', 'Presencial', 'Híbrido'];

const courseFormData = (courseId) => {
  const course = state.customCourses.find((item) => (
    String(item.id) === courseId && item.owner === state.user.email
  )) || {};
  startCourseForm(course);

  return {
    heading: ui.editingCourseId ? 'Editar curso' : 'Adicionar curso',
    submitLabel: ui.editingCourseId ? 'Salvar alterações' : 'Publicar curso',
    previewBackground: course.image
      ? `url(${course.image}) center/cover`
      : '',
    modes: COURSE_MODES.map((mode) => ({
      mode,
      selected: mode === ui.courseMode,
      unselected: mode !== ui.courseMode,
    })),
    title: course.title,
    tag: course.tag,
    date: course.startDateIso,
    time: course.time,
    duration: course.duration,
    frequency: course.frequency,
    price: course.price,
    minAge: course.minAge,
    location: course.location,
    seats: String(course.seats || 20),
    about: course.about,
    audience: course.audience,
    learning: (course.learning || []).join(', '),
    tools: (course.tools || []).join(', '),
  };
};

const profileData = () => ({
  hasPhoto: Boolean(state.profile.photo),
  photoUrl: state.profile.photo,
  name: state.profile.name,
  ageLabel: `${state.profile.age} anos`,
  neighborhoodLabel: `Bairro: ${state.profile.neighborhood}`,
  goal: state.profile.goal,
  interests: state.interests.map((name, index) => ({ name, index })),
  areas: CFG.areas.map((name) => ({ name })),
  pastCourses: state.pastCourses.map((course, index) => ({
    name: course.name,
    detail: `${course.place} · ${course.year}`,
    index,
  })),
});

const skillsData = () => ({
  heading: `${firstName()}, ${state.profile.age}`,
  skills: CFG.skills.map((skill) => ({
    title: `${skill.name} · ${skill.level}`,
    text: skill.text,
    levelLabel: skillLevel(skill.level),
    width: `${skill.level}%`,
  })),
});

const reportCardData = () => {
  const total = CFG.grades.reduce((sum, grade) => sum + grade.value, 0);
  return {
    subtitle: `${state.profile.name} · 1º ano do Ensino Médio · 2026`,
    average: formatGrade(total / CFG.grades.length),
    siepeUrl: CFG.links.siepe,
    grades: CFG.grades.map((grade) => ({
      subject: grade.subject,
      value: formatGrade(grade.value),
      width: `${grade.value * 10}%`,
    })),
  };
};

const ACCOUNT_SETTINGS = [
  ['Dados da conta', 'Nome, e-mail e senha'],
  ['Notificações', 'O que avisar e por onde'],
  ['Privacidade', 'Quem vê meu perfil e uso de dados'],
];

const settingsData = () => ({
  accountItems: ACCOUNT_SETTINGS.map(([title, description], index) => ({
    title,
    description,
    index,
  })),
});

const views = {
  '': { screen: 'welcome', data: welcomeData },
  cadastro: { screen: 'signup', data: signupData },
  onboarding: { screen: 'onboarding', data: onboardingData },
  inicio: { screen: 'home', data: homeData },

  curso: { screen: 'home', data: homeData },
  'meus-cursos': { screen: 'my-courses', data: myCoursesData },
  'novo-curso': { screen: 'course-form', data: courseFormData },
  perfil: { screen: 'profile', data: profileData },
  habilidades: { screen: 'skills', data: skillsData },
  boletim: { screen: 'report-card', data: reportCardData },
  config: { screen: 'settings', data: settingsData },
};
