(async function loadCmsContent() {
  const defaultContent = await fetch('/data/content.json').then((r) => r.json()).catch(() => ({}));
  const localOverride = JSON.parse(localStorage.getItem('deltatec-cms') || '{}');

  const content = {
    ...defaultContent,
    ...localOverride,
    home: { ...(defaultContent.home || {}), ...(localOverride.home || {}) },
    contact: { ...(defaultContent.contact || {}), ...(localOverride.contact || {}) }
  };

  document.querySelectorAll('[data-cms-key]').forEach((node) => {
    const [section, key] = node.getAttribute('data-cms-key').split('.');
    const value = content?.[section]?.[key];
    if (typeof value === 'string' && value.trim()) {
      node.textContent = value;
    }
  });
})();
