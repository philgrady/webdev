function handleQuote(event) {
  event.preventDefault();
  const feedback = document.getElementById("form-feedback");
  feedback.textContent =
    "Thanks! Your request has been received. A local energy advisor will contact you within 1 business day.";
  event.target.reset();
  return false;
}
