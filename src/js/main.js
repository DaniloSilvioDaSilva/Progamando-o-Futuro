const handleClick = (event) => {
  const element = event.target.closest('[data-action]');
  const action = element && actions[element.dataset.action];
  if (!action) return;
  event.preventDefault();
  action(element);
};

const handlePasswordInput = (event) => {
  if (event.target.name !== 'password') return;
  const results = PASSWORD_RULES.map((rule) => rule.test(event.target.value));
  const items = [...document.querySelectorAll('.password-rule')];
  items.forEach((item, index) => {
    item.classList.toggle('valid', results[index]);
    item.textContent = `${results[index] ? '●' : '○'} ${
      PASSWORD_RULES[index].label}`;
  });
  $('[data-action="goToProfileStep"]').disabled = !results.every(Boolean);
};

const handleImageChange = async (event) => {
  const { image: target } = event.target.dataset;
  const [file] = event.target.files || [];
  if (!target || !file) return;

  try {
    const dataUrl = await resizeImageFile(file);
    if (target === 'profile') {
      state.profile.photo = dataUrl;
      saveState();
      render();
    } else {
      ui.courseImage = dataUrl;
      $('#course-preview').style.background = `url(${dataUrl}) center/cover`;
    }
  } catch (error) {

  }
};

document.addEventListener('click', handleClick);
document.addEventListener('input', handlePasswordInput);
document.addEventListener('change', handleImageChange);
window.addEventListener('hashchange', render);
render();
