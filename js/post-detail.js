import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightBox, setTextContent } from './utils';

//** Post Detail */

function renderPostDetail(post) {
  if (!post) return;

  //render Title
  //render description
  //render author
  //render updateAt
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  );

  //render hero image (imgURl)
  const heroImg = document.getElementById('postHeroImage');
  if (heroImg) {
    heroImg.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImg.addEventListener('error', () => {
      heroImg.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  //render edit page links
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> EditPost';
  }
}

(async () => {
  // get post Id from URL
  // fetch post detail API
  // render post detail

  try {
    registerLightBox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });

    const searchParamsPost = new URLSearchParams(window.location.search);
    const postId = searchParamsPost.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }
    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to get post detail', error);
  }
})();
