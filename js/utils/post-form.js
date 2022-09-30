import { setBackgroundImage, setFieldValue, setTextContent, randomNumber } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};
  //todo  S1 : query each input and add to value object
  //* ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  // *  const field = form.querySelector(`[name="${name}"]`);
  //*   if (field) formValues[name] = field.value;
  //* });

  //*todo s2: using WebAPI: FORM DATA
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  // console.log(formValues);
  return formValues;
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    //set content for invalid-feedback
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}
// yub schema validation form
function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('maxImageUpload', 'The Image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 3 * 1024 * 1024; //3mb
          return fileSize <= MAX_SIZE;
        }),
    }),
  });
}

async function validatePostForm(form, formValues) {
  // todo : get errors => add was-validated class to form element
  //* get errors
  try {
    //reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));
    //start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    // console.log(error.path);
    // console.log(error.inner);
    const errorLog = {};
    if ((error.name = 'ValidationError' && Array.isArray(error.inner))) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }
  //* add was-validated class to form element
  const isValid = form.checkValidity();

  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

async function validateFormField(form, formValues, name) {
  try {
    //clear previous errors
    setFieldError(form, name, '');
    //start validating
    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  //show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    // * random ID
    //* build URl
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    //* Set imageUrl input and background
    setFieldValue(form, "[name='imageUrl']", imageUrl); // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll("[data-id='imageSource']");
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll("[name='imageSource']");
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector("[name = 'image']");

  if (!uploadImage) return;

  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, '#postHeroImage', imageUrl);

      //trigger validation of upload input
      validateFormField(
        form,
        {
          imageUrl: ImageSource.UPLOAD,
          image: file,
        },
        'image'
      );
    }
  });
}

function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValue, onchange }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;

  //render data to form
  setFormValues(form, defaultValue);

  //init events
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);
  initValidationOnChange(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Prevent order submission
    if (submitting) return;

    submitting = true;
    showLoading(form);
    //todo: get form value
    const formValues = getFormValues(form);
    //* set id form for edit post form
    formValues.id = defaultValue.id;
    // console.log('formValues', formValues);

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onchange?.(formValues);

    //always hideLoading no matter form valid or not
    hideLoading(form);
    submitting = false;
  });
}
