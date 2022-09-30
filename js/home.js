import postApi from './api/postApi';
import { initSearch, initPagination, renderPostList, renderPagination, toast } from './utils';
import { setTextContent } from './utils/common';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query Params
    const url = new URL(window.location);

    // set query params for search and pagination
    if (filterName) url.searchParams.set(filterName, filterValue);

    //reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    // re-render post list
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function registerPostDeleteEvent({ content, removeBtn }) {
  //selector
  const contentElement = document.querySelector(content);
  console.log(contentElement);

  const removeButton = document.querySelector(removeBtn);
  if (!contentElement || !removeButton) return;

  document.addEventListener('post-delete', (event) => {
    try {
      const post = event.detail;
      const message = `Are you sure to remove post "${post.title}"?`;
      contentElement.textContent = message;

      removeButton.addEventListener('click', async () => {
        //call API to remove the post by id
        await postApi.remove(post.id);
        // refetch data after remove post
        await handleFilterChange();

        toast.success('Remove post successfully');
      });
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}

//* Main
(async () => {
  try {
    //set default pagination (_page , _limit) on url
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent({
      content: "p[data-id='removePostContent']",
      removeBtn: "button[data-id='removePostDelete']",
    });

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onchange: (page) => handleFilterChange('_page', page),
    });
    initSearch({
      elementId: 'search-input',
      defaultParams: queryParams,
      onchange: (value) => handleFilterChange('title_like', value),
    });

    //** render post list base URL params
    // const { data, pagination } = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('pagination', pagination);
    handleFilterChange();
  } catch (error) {
    console.log('get all failed error: ', error);
    // show modal, toast error
  }
})();
