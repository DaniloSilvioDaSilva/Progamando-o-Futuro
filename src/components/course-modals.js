const LEARNING_ICONS = ['🖥️', '🖼️', '🎨'];
const ENROLLMENT_STEPS = ['Seus Dados', 'Seu Responsável', 'Confirmação'];
const REMINDERS = ['1 dia antes', '2 horas antes', 'WhatsApp', 'E-mail'];

const learningItems = (course) => {
  if (!course.learning.length) return [{ icon: '', title: 'A definir' }];
  return course.learning.map((title, index) => ({
    icon: LEARNING_ICONS[index % LEARNING_ICONS.length],
    title,
  }));
};

const detailData = (course) => ({
  ...courseCardData(course),
  meta: `${course.mode} - ${course.schedule}`,
  about: course.about || 'Sem descrição.',
  audience: course.audience || 'Aberto a todos',
  learning: learningItems(course),
  tools: (course.tools.length ? course.tools : ['A definir'])
    .map((text) => ({ text })),
  stats: [
    { value: course.duration, label: 'Duração' },
    { value: course.frequency, label: 'Frequência' },
    { value: course.price, label: 'Valor' },
    { value: course.minAge, label: 'Idade' },
  ],
  canEnroll: !(isCompany() && course.owner === state.user.email),
  saveLabel: state.savedIds.includes(course.id) ? 'Salvo' : 'Salvar',
  seatsLabel: `${course.seats} vagas restantes`,
});

const openCourseDetail = (course) => {
  if (!course) return;
  openModal('detail', detailData(course), 'wide');
};

const enrollmentData = (course, step) => ({
  isPersonalStep: step === 0,
  isGuardianStep: step === 1,
  isConfirmStep: step === 2,
  courseTitle: `${course.title} ${course.organization}`,
  steps: ENROLLMENT_STEPS.map((label, index) => ({
    label: `${index + 1}. ${label}`,
    current: index === step,
    muted: index !== step,
  })),
  name: state.profile.name,
  email: state.user?.email || '',
  startDate: course.startDate,
  time: course.time,
  location: course.location,
  reminders: REMINDERS.map((label) => ({ label })),
  calendarUrl: CFG.links.calendar(course),
});

const openEnrollment = () => {
  const { courseId, step } = ui.enrollment;
  const course = findCourse(courseId);
  openModal('enroll', enrollmentData(course, step));
};
