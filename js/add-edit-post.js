//** Main */
import postApi from './api/postApi';
import { initPostForm } from './utils';
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValue = postId
      ? await postApi.getById(postId) // fetch api
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onchange: (formValues) => console.log('formValues', formValues),
    });
  } catch (error) {
    console.log('failed to fetch post details', error);
  }
})();
