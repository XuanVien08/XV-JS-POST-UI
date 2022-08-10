import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };

    // const response = await axiosClient.get('/posts');
    const response = await postApi.getAll(queryParams);
    console.log(response);
  } catch (error) {
    console.log('get all failed error: ', error);
    // show modal, toast error
  }
}
main();
