const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];

const store = {
  get(key, fallback) {
    try {
      const raw = window.localStorage.getItem(`lv_${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(`lv_${key}`, JSON.stringify(value));
    } catch (error) {

    }
  },
};

const activeRoot = () => (
  $('#modal:not([hidden]) .dialog:not([hidden])')
  || $('.screen:not([hidden])')
);

const field = (name) => (
  $$(`[name="${name}"]`, activeRoot())
    .find((element) => !element.closest('[hidden]'))
);

const fieldValue = (name) => field(name).value.trim();
