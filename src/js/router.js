const PUBLIC_ROUTES = ['', 'cadastro'];
const COMPANY_BLOCKED_ROUTES = ['perfil', 'habilidades', 'boletim'];
const DARK_ROUTES = [
  'meus-cursos', 'perfil', 'habilidades', 'boletim', 'config',
];

const hasView = (route) => (
  Object.prototype.hasOwnProperty.call(views, route)
);

const redirectFor = (route) => {
  if (!hasView(route)) return '#/';

  if (!state.user && !PUBLIC_ROUTES.includes(route)) return '#/';
  if (state.user && PUBLIC_ROUTES.includes(route)) {
    return isCompany() ? '#/meus-cursos' : '#/inicio';
  }
  if (isCompany() && COMPANY_BLOCKED_ROUTES.includes(route)) {
    return '#/meus-cursos';
  }
  if (route === 'novo-curso' && !isCompany()) return '#/inicio';
  return null;
};

const scrollToTarget = () => {
  const target = ui.scrollTarget && $(`#${ui.scrollTarget}`);
  ui.scrollTarget = '';
  if (target) target.scrollIntoView();
};

const updateChrome = (route) => {
  const scope = isCompany() ? 'company' : 'student';
  $('#site-nav').classList.remove('open');
  $('#site-header').classList.toggle('off', !state.user);
  $$('#site-header [data-account]').forEach((link) => {
    link.classList.toggle('hide', link.dataset.account !== scope);
  });
  $$('#site-nav a').forEach((link) => {
    link.classList.toggle('active', link.hash === `#/${route}`);
  });
  document.body.classList.toggle('theme-dark', DARK_ROUTES.includes(route));
};

const showScreen = ({ screen, data }, param) => {
  $$('.screen').forEach((node) => {
    node.hidden = node.dataset.screen !== screen;
  });
  const element = $(`.screen[data-screen="${screen}"]`);
  resetFields(element);
  bind(element, data(param));
};

const render = () => {
  const [route, param] = window.location.hash.replace('#/', '').split('/');
  closeModal();

  const redirect = redirectFor(route);
  if (redirect) {
    window.location.replace(redirect);
    return;
  }

  updateChrome(route);
  showScreen(views[route], param);

  if (route === 'curso') openCourseDetail(findCourse(param));
  else window.scrollTo(0, 0);
  scrollToTarget();
};
