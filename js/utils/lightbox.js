import { showModal } from './common'; 

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // check if this modal is registered or
  if (Boolean(modalElement.dataset.registered)) return;

  //selector
  const imageElement = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  // lightbox variable
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  //handle click for all imgs --> Even Delegation
  //img click --> find all imgs with the sam album / gallery
  //show more with selected img
  // handle prev / next click

  document.addEventListener('click', (event) => {
    const { target } = event; // Destructuring
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log('album img click', { target, currentIndex, imgList });

    //show image at index
    showImageAtIndex(currentIndex);
    //show modal
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    //show previous image of current album

    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
    console.log(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    //show next image of current album

    currentIndex = (currentIndex + 1) % imgList.length;
    console.log(currentIndex);
    showImageAtIndex(currentIndex);
  });

  // make this modal is already registered
  modalElement.dataset.registered = 'true';
}
