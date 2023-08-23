import { getImages, templateImages } from './auxiliary';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const maxHits = 40;
let page = 1;
let maxPage = 1;
let query = '';
let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 300,
  captionPosition: 'bottom',
});

refs.form.addEventListener('submit', onSearchSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearchSubmit(e) {
  e.preventDefault();

  page = 1;
  query = e.currentTarget.elements.searchQuery.value;
  if (query === '') return;
  refs.loadMore.classList.add('is-hidden');
  try {
    const response = await getImages(query, page);

    refs.gallery.innerHTML = '';
    maxPage = Math.ceil(response.totalHits / maxHits);

    if (response.totalHits > 0) {
      renderImages(response.hits);
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
    }

    if (response.totalHits > 40) {
      refs.loadMore.classList.remove('is-hidden');
    }
  } catch (err) {
    Notify.failure('Oops, something went wrong!');
    console.log(err);
  }
  e.target.reset();
}

async function onLoadMore(e) {
  page += 1;
  if (page === maxPage) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    const response = await getImages(query, page);
    renderImages(response.hits);

    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    Notify.failure('Oops, something went wrong!');
    console.log(err);
  }
}

function renderImages(arr) {
  const markup = arr.map(hit => templateImages(hit)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
