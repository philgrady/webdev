const form = document.querySelector('#contact-form');
if (form) {
  const output = document.querySelector('#contact-output');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    output.className = '';
    output.textContent = 'Sending...';

    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || (payload.errors || []).join(' '));
      }
      output.className = 'success';
      output.textContent = payload.message;
      form.reset();
    } catch (error) {
      output.className = 'error';
      output.textContent = error.message || 'Could not send your message.';
    }
  });
}
