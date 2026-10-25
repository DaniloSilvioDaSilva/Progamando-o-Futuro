const getPath = (data, path) => (
  path.split('.').reduce((value, key) => value?.[key], data)
);

const parsePairs = (text) => (
  text
    .split(';')
    .map((pair) => pair.trim().split('='))
    .filter(([name, key]) => name && key)
);

const ownNodes = (root, selector) => (
  $$(selector, root).filter((node) => !node.parentElement?.closest('[data-list]'))
);

const bindConditions = (root, data) => {
  ownNodes(root, '[data-if]').forEach((node) => {
    node.hidden = !getPath(data, node.dataset.if);
  });
  ownNodes(root, '[data-unless]').forEach((node) => {
    node.hidden = Boolean(getPath(data, node.dataset.unless));
  });
  ownNodes(root, '[data-disabled]').forEach((node) => {
    node.disabled = Boolean(getPath(data, node.dataset.disabled));
  });
};

const bindValues = (root, data) => {
  ownNodes(root, '[data-text]').forEach((node) => {
    node.textContent = getPath(data, node.dataset.text) ?? '';
  });
  ownNodes(root, '[data-value]').forEach((node) => {
    node.value = getPath(data, node.dataset.value) ?? '';
  });
  ownNodes(root, '[data-attrs]').forEach((node) => {
    parsePairs(node.dataset.attrs).forEach(([name, key]) => {
      node.setAttribute(name, getPath(data, key) ?? '');
    });
  });
  ownNodes(root, '[data-class]').forEach((node) => {
    parsePairs(node.dataset.class).forEach(([name, key]) => {
      node.classList.toggle(name, Boolean(getPath(data, key)));
    });
  });
  ownNodes(root, '[data-style]').forEach((node) => {
    parsePairs(node.dataset.style).forEach(([name, key]) => {
      node.style.setProperty(name, getPath(data, key) ?? '');
    });
  });
};

const createItem = (templateId, data) => {
  const item = document.getElementById(templateId).content.cloneNode(true);

  return bind(item, data);
};

const fillList = (container, templateId, items) => {
  container.replaceChildren(
    ...items.map((item) => createItem(templateId, item)),
  );
};

const bind = (root, data) => {
  bindConditions(root, data);
  bindValues(root, data);
  $$('[data-list]', root)
    .filter((node) => !node.parentElement?.closest('[data-list]'))
    .forEach((container) => {
      const items = getPath(data, container.dataset.list) || [];
      fillList(container, container.dataset.template, items);
    });
  return root;
};

const resetFields = (root) => {
  $$('input, textarea', root)
    .filter((node) => !node.hasAttribute('data-value'))
    .forEach((node) => {
      if (['checkbox', 'radio'].includes(node.type)) {
        node.checked = node.defaultChecked;
      } else {
        node.value = '';
      }
    });
  $$('select:not([data-list])', root).forEach((node) => {
    node.selectedIndex = 0;
  });
  $$('[data-error]', root).forEach((node) => {
    node.textContent = '';
  });
};
