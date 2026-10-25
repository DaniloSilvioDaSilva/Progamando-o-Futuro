const imageUrl = (name) => (
  name.startsWith('data:') ? name : `public/images/${name}`
);

const openModal = (name, data = {}, extraClass = '') => {
  const overlay = $('#modal');
  $$('.dialog', overlay).forEach((dialog) => {
    dialog.hidden = dialog.dataset.dialog !== name;
  });
  $('.modal-box', overlay).classList.toggle('wide', extraClass === 'wide');
  const dialog = $(`.dialog[data-dialog="${name}"]`, overlay);
  resetFields(dialog);
  bind(dialog, data);
  overlay.hidden = false;
};

const closeModal = () => {
  $('#modal').hidden = true;
};

const showError = (message) => {
  const target = $$('[data-error]', activeRoot())
    .find((node) => !node.closest('[hidden]'));
  target.textContent = message;
};

const markSelected = (selector, selected) => {
  $$(selector).forEach((button) => {
    button.classList.toggle('active', button === selected);
  });
};

const courseCardData = (course) => ({
  id: course.id,
  hasImage: Boolean(course.image),
  imageUrl: course.image ? imageUrl(course.image) : '',
  tag: course.tag,
  title: course.title,
  organization: course.organization,
  schedule: course.schedule,
  summary: `${course.mode} · ${course.schedule}`,
  detailHref: `#/curso/${course.id}`,
  editHref: `#/novo-curso/${course.id}`,
});

const signupHeaderData = (step) => ({
  progress: `${step * 33.3}%`,
  backHref: step > 1 ? `#/cadastro/${step - 1}` : '#/',
  stepLabel: `← Etapa ${step} de 3`,
});

const skillLevel = (value) => {
  if (value < 40) return 'Iniciante';
  if (value < 70) return 'Em evolução';
  return 'Maestria';
};

const formatGrade = (grade) => grade.toFixed(1).replace('.', ',');
