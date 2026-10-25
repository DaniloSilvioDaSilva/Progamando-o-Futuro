const STORAGE_KEY = 'state_v2';

const createInitialState = () => ({
  user: null,
  signup: {},
  enrolledIds: [],
  savedIds: [],
  customCourses: [],
  quizAnswers: [],
  scaleAnswers: [],
  interests: ['Design gráfico', 'Tecnologia'],
  profile: {
    name: 'Maria Eduarda Souza',
    age: '15',
    neighborhood: 'Recife',
    goal: 'Quero aprender design e programação para criar projetos que ajudem o meu bairro.',
    photo: '',
  },
  pastCourses: [
    { name: 'Introdução ao Canva', place: 'Escola Municipal', year: '2025' },
  ],
});

const state = { ...createInitialState(), ...store.get(STORAGE_KEY, {}) };

const ui = {
  scrollTarget: '',
  quizStep: 0,
  coursesTab: '',
  acceptedTerms: [false, false, false],
  enrollment: { courseId: 0, step: 0 },
  editingCourseId: 0,
  courseMode: 'Presencial',
  courseImage: '',
};

const saveState = () => store.set(STORAGE_KEY, state);

const allCourses = () => [...CFG.courses, ...state.customCourses];

const findCourse = (id) => (
  allCourses().find((course) => String(course.id) === String(id))
);

const isCompany = () => state.user?.type === ACCOUNT.company;

const firstName = () => state.profile.name.split(' ')[0];

const navigate = (hash) => {
  window.location.hash = hash;
};

const startCourseForm = (course = {}) => {
  ui.editingCourseId = course.id || 0;
  ui.courseMode = course.mode || 'Presencial';
  ui.courseImage = course.image || '';
};
