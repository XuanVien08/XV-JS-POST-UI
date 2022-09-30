export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url("${imageUrl}")`;
}

export function randomNumber(n) {
  if (typeof n !== 'number' && n < 0) return -1;
  const random = Math.random() * n;
  return Math.round(random);
}
export function showModal(modalElement) {
  //make sure bootstrap script is loaded
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}
