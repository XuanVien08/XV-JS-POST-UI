import { setBackgroundImage, setFieldValue } from './common';

function setFormValue(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};
  //S1 : query each input and add to value object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  //s2: using WebAPI: FORM DATA
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}

export function initPostForm({ formId, defaultValue, onchange }) {
  const form = document.getElementById(formId);

  setFormValue(form, defaultValue);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    //get form value
    const formValues = getFormValues(form);
    console.log(formValues);
    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
  });

  if (!form) return;
}
