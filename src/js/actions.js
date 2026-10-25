const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const formatLongDate = (isoDate) => (
  new Date(`${isoDate}T12:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
);

const splitList = (text) => (
  text.split(',').map((item) => item.trim()).filter(Boolean)
);

const rankInterests = () => {
  const scores = CFG.areas.map(() => 0);
  state.quizAnswers.forEach((option) => {
    if (Number.isInteger(option)) scores[option] += 2;
  });
  state.scaleAnswers.forEach((value, index) => {
    if (Number.isInteger(value)) scores[index] += value - 1;
  });
  return scores
    .map((score, index) => ({ score, area: CFG.areas[index] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ area }) => area);
};

const allCoursesMatching = (term, mode) => allCourses().filter((course) => {
  const text = [course.title, course.organization, course.tag, course.about]
    .join(' ')
    .toLowerCase();
  return text.includes(term) && (!mode || course.mode === mode);
});

const removeId = (ids, courseId) => (
  ids.filter((id) => String(id) !== String(courseId))
);

const courseTitle = (course) => `${course.title} ${course.organization}`;

const SETTINGS_MODALS = [
  {
    template: 'setting-account',
    data: () => ({
      email: state.user?.email || '—',
      name: state.profile.name,
    }),
  },
  {
    template: 'setting-notifications',
    data: () => ({
      options: ['Lembretes de aula', 'Novas vias para mim', 'Avisos da escola']
        .map((label) => ({ label })),
    }),
  },
  { template: 'setting-privacy', data: () => ({}) },
];

const CANCEL_REASONS = [
  'Prefiro não dizer',
  'Mudou o horário',
  'Mudei de interesse',
  'Outro motivo',
];

const actions = {

  close() {
    if (window.location.hash.startsWith('#/curso')) navigate('#/inicio');
    else closeModal();
  },

  toggleMenu() {
    $('#site-nav').classList.toggle('open');
  },

  goToAbout() {
    ui.scrollTarget = 'sobre';
    if (window.location.hash === '#/inicio') render();
    else navigate('#/inicio');
  },

  goToCourses() {
    $('#vias').scrollIntoView();
  },

  toggleFontSize() {
    const root = document.documentElement;
    root.style.fontSize = root.style.fontSize === '120%' ? '' : '120%';
  },

  logout() {
    state.user = null;
    saveState();
    navigate('#/');
  },

  chooseAccountType(element) {
    const emailInput = field('email');
    if (emailInput?.value) state.signup.email = emailInput.value;
    state.signup.type = element.dataset.type;
    saveState();
    render();
  },

  submitEmail() {
    const email = fieldValue('email');
    if (!EMAIL_PATTERN.test(email)) {
      showError('Digite um e-mail válido.');
      return;
    }
    state.signup.email = email;
    saveState();
    navigate('#/cadastro/1');
  },

  login() {
    if (state.user) {
      navigate('#/inicio');
      return;
    }
    showError(
      'Nenhuma conta neste navegador. '
      + 'Digite seu e-mail e clique em Avançar para criar.',
    );
  },

  togglePassword() {
    const input = field('password');
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  goToProfileStep() {
    navigate('#/cadastro/2');
  },

  submitProfile() {
    const name = fieldValue('name');
    const isCompanyAccount = state.signup.type === ACCOUNT.company;
    const birthYear = isCompanyAccount ? 2000 : Number(fieldValue('birthYear'));
    if (!name || !(birthYear > 1900)) {
      showError('Informe seu nome e o ano de nascimento.');
      return;
    }
    state.signup.name = name;
    state.profile.name = name;
    state.profile.age = String(new Date().getFullYear() - birthYear);
    ui.acceptedTerms = [false, false, false];
    saveState();
    navigate('#/cadastro/3');
  },

  toggleTerm(element) {
    const index = Number(element.dataset.term);
    ui.acceptedTerms[index] = !ui.acceptedTerms[index];
    element.classList.toggle('active', ui.acceptedTerms[index]);
    $('[data-action="finishSignup"]').disabled = !ui.acceptedTerms[2];
  },

  finishSignup() {
    state.user = {
      email: state.signup.email || '',
      type: state.signup.type || ACCOUNT.student,
    };
    ui.quizStep = 0;
    saveState();
    navigate(isCompany() ? '#/meus-cursos' : '#/onboarding');
  },

  startQuiz() {
    ui.quizStep = 0;
    navigate('#/onboarding');
  },

  answerQuiz(element) {
    const { question, option } = element.dataset;
    state.quizAnswers[Number(question)] = Number(option);
    markSelected(`[data-question="${question}"]`, element);
    saveState();
  },

  answerScale(element) {
    const { question, value } = element.dataset;
    state.scaleAnswers[Number(question)] = Number(value);
    markSelected(`[data-question="${question}"]`, element);
    saveState();
  },

  nextQuizStep() {
    if (ui.quizStep === 0) {
      ui.quizStep = 1;
      render();
      return;
    }
    state.interests = rankInterests();
    saveState();
    navigate('#/inicio');
  },

  search() {
    const term = fieldValue('search').toLowerCase();
    const mode = fieldValue('filter');
    const results = allCoursesMatching(term, mode);
    const carousel = $('#carousel');
    fillList(carousel, 'tpl-course-card', results.map(courseCardData));
    if (!results.length) carousel.textContent = 'Nenhuma via encontrada.';
  },

  scrollCarousel(element) {
    $('#carousel').scrollBy({
      left: 260 * Number(element.dataset.direction),
      behavior: 'smooth',
    });
  },

  toggleSaved(element) {
    const course = findCourse(element.dataset.courseId);
    const alreadySaved = state.savedIds.includes(course.id);
    state.savedIds = alreadySaved
      ? removeId(state.savedIds, course.id)
      : [...state.savedIds, course.id];
    saveState();
    $('[data-action="toggleSaved"]').textContent = alreadySaved
      ? 'Salvar'
      : 'Salvo';
  },

  startEnrollment(element) {
    if (!state.user) {
      navigate('#/');
      return;
    }
    ui.enrollment = { courseId: Number(element.dataset.courseId), step: 0 };
    openEnrollment();
  },

  nextEnrollmentStep() {
    const { step } = ui.enrollment;
    if (step === 0 && (!fieldValue('fullName') || !fieldValue('email'))) {
      showError('Preencha nome e e-mail.');
      return;
    }
    if (step === 1 && !field('guardianConsent').checked) {
      showError('É preciso a autorização do responsável.');
      return;
    }
    const isAdult = Number(state.profile.age) >= 18;
    ui.enrollment.step = step === 0 && isAdult ? 2 : step + 1;
    openEnrollment();
  },

  finishEnrollment() {
    const { courseId } = ui.enrollment;
    if (!state.enrolledIds.includes(courseId)) {
      state.enrolledIds.push(courseId);
    }
    saveState();
    ui.coursesTab = 'enrolled';
    navigate('#/meus-cursos');
  },

  switchTab(element) {
    ui.coursesTab = element.dataset.tab;
    render();
  },

  unsaveCourse(element) {
    state.savedIds = removeId(state.savedIds, element.dataset.courseId);
    saveState();
    render();
  },

  showLocation(element) {
    const course = findCourse(element.dataset.courseId);
    openModal('location', {
      courseTitle: courseTitle(course),
      schedule: course.schedule,
      startDate: course.startDate,
      time: course.time,
      location: course.location,
      mapsUrl: CFG.links.maps(course.location),
      calendarUrl: CFG.links.calendar(course),
    });
  },

  confirmCancel(element) {
    const course = findCourse(element.dataset.courseId);
    openModal('cancel', {
      id: course.id,
      courseTitle: courseTitle(course),
      reasons: CANCEL_REASONS.map((name) => ({ name })),
    });
  },

  cancelEnrollment(element) {
    state.enrolledIds = removeId(state.enrolledIds, element.dataset.courseId);
    saveState();
    render();
  },

  chooseCourseMode(element) {
    ui.courseMode = element.dataset.mode;
    $$('#course-modes button').forEach((button) => {
      const selected = button === element;
      button.classList.toggle('btn', selected);
      button.classList.toggle('btn-outline', !selected);
    });
  },

  clearForm() {
    render();
  },

  publishCourse() {
    const date = fieldValue('date');
    if (!fieldValue('title') || !fieldValue('location') || !date) {
      showError('Preencha título, data e local ou link.');
      return;
    }
    const course = {
      title: fieldValue('title'),
      organization: state.profile.name,
      image: ui.courseImage,
      tag: fieldValue('tag') || ui.courseMode,
      areaIndex: 0,
      mode: ui.courseMode,
      schedule: fieldValue('time') || 'Horário a combinar',
      time: fieldValue('time'),
      duration: fieldValue('duration') || 'A definir',
      frequency: fieldValue('frequency') || 'A definir',
      price: fieldValue('price') || 'Grátis',
      minAge: fieldValue('minAge') || 'Livre',
      seats: Number(fieldValue('seats')) || 1,
      startDateIso: date,
      startDate: formatLongDate(date),
      location: fieldValue('location'),
      about: fieldValue('about'),
      audience: fieldValue('audience'),
      learning: splitList(fieldValue('learning')),
      tools: splitList(fieldValue('tools')),
    };

    if (ui.editingCourseId) {
      const index = state.customCourses.findIndex(
        (item) => item.id === ui.editingCourseId,
      );
      state.customCourses[index] = { ...state.customCourses[index], ...course };
    } else {
      state.customCourses.push({
        id: Date.now(),
        owner: state.user.email,
        ...course,
      });
    }
    saveState();
    navigate('#/meus-cursos');
  },

  confirmRemoveCourse(element) {
    openModal('remove-course', findCourse(element.dataset.courseId));
  },

  removeCourse(element) {
    const { courseId } = element.dataset;
    state.customCourses = state.customCourses.filter(
      (course) => String(course.id) !== courseId,
    );
    state.enrolledIds = removeId(state.enrolledIds, courseId);
    state.savedIds = removeId(state.savedIds, courseId);
    saveState();
    render();
  },

  editProfile() {
    openModal('edit-profile', state.profile);
  },

  saveProfile() {
    state.profile = {
      ...state.profile,
      name: fieldValue('profileName') || state.profile.name,
      age: fieldValue('profileAge'),
      neighborhood: fieldValue('profileNeighborhood'),
      goal: fieldValue('profileGoal'),
    };
    saveState();
    render();
  },

  addInterest() {
    const interest = field('interest').value;
    if (!state.interests.includes(interest)) state.interests.push(interest);
    saveState();
    render();
  },

  removeInterest(element) {
    state.interests.splice(Number(element.dataset.index), 1);
    saveState();
    render();
  },

  addPastCourse() {
    const name = fieldValue('pastName');
    if (!name) return;
    state.pastCourses.push({
      name,
      place: field('pastPlace').value,
      year: field('pastYear').value,
    });
    saveState();
    render();
  },

  removePastCourse(element) {
    state.pastCourses.splice(Number(element.dataset.index), 1);
    saveState();
    render();
  },

  showSetting(element) {
    const index = Number(element.dataset.index);
    openModal(SETTINGS_MODALS[index].template, SETTINGS_MODALS[index].data());
  },
};
