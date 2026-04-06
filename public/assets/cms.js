function deepMerge(base = {}, override = {}) {
  const out = { ...base };
  Object.entries(override).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = deepMerge(base[key] || {}, value);
    } else {
      out[key] = value;
    }
  });
  return out;
}

function getByPath(target, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), target);
}

(async function loadCmsContent() {
  const defaultContent = await fetch('/data/content.json').then((r) => r.json()).catch(() => ({}));
  const localOverride = JSON.parse(localStorage.getItem('deltatec-cms') || '{}');
  const content = deepMerge(defaultContent, localOverride);

  document.querySelectorAll('[data-cms-key]').forEach((node) => {
    const value = getByPath(content, node.getAttribute('data-cms-key'));
    if (typeof value === 'string' && value.trim()) node.textContent = value;
  });
})();
