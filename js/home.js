import postApi from './api/postApi';
import { initSearch, initPagination, renderPostList, renderPagination } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query Params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    
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

(async () => {
  try {
    //set default pagination (_page , _limit) on url
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

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
    // const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed error: ', error);
    // show modal, toast error
  }
})();
