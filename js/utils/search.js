import debounce from 'lodash.debounce';

export function initSearch({ elementId, defaultParams, onchange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  //set default value from query params
  //title_like

  if (defaultParams || defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  }

  const debounceSearch = debounce((event) => onchange(event.target.value), 500);

  searchInput.addEventListener('input', debounceSearch);
}
