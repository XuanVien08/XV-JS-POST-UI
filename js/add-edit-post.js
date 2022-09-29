import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  //imageSource = "upload" --> remove imageUrl
  //imageSource = "picsum" --> remove image
  payload.imageSource === 'upload' ? delete payload.imageUrl : delete payload.image;

  // finally remove imageSource
  delete payload.imageSource;

  // remove id if it's add mode
  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handleFromSubmit(formValues) {
  // console.log('submit from parent', { formValues, payload });

  try {
    const payload = removeUnusedFields(formValues);
    const formData = jsonToFormData(payload);
    //* check add/edit post
    //* S1: based on search params (check id)
    //* S2: Check id in formValues
    //* Call API

    const savedPost = formValues.id
      ? await postApi.updateFromData(formData)
      : await postApi.addFromData(formData);

    //* show success message
    toast.success('Save post successfully!');

    // console.log('submit from parent', formValues);
    // console.log('redirect to', savedPost.id);
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}

//** Main */
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValue = postId
      ? await postApi.getById(postId) // fetch api =>> return data
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onchange: handleFromSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details', error);
  }
})();
