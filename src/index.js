import { getImages, templateImages } from './auxiliary';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

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
refs.loadMore.addEventListener('click', throttle(onLoadMore, 1000));

async function onSearchSubmit(e) {
  e.preventDefault();

  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    e.target.reset();
    return;
  }
  refs.loadMore.classList.add('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Loading.standard('Loading...');
  try {
    const response = await getImages(query, page);

    refs.gallery.innerHTML = '';
    maxPage = Math.ceil(response.totalHits / maxHits);

    if (response.totalHits > 0) {
      // setTimeout(() => {
      renderImages(response.hits);
      // }, 500);
      Notify.success(`Hooray! We found ${response.totalHits} images.`, {
        clickToClose: true,
        timeout: 2500,
      });
    }
    /* observer.observe(refs.gallery);
    updateStatusObserver(); */
    if (response.totalHits > 40) {
      refs.loadMore.classList.remove('is-hidden');
    }
  } catch (err) {
    Notify.failure('Oops, something went wrong!', {
      clickToClose: true,
    });
    console.log(err);
  } finally {
    // Loading.remove(500);
    e.target.reset();
  }
}

async function onLoadMore(e) {
  page += 1;
  if (page === maxPage) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.", {
      clickToClose: true,
      position: 'center-bottom',
    });
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
    Notify.failure('Oops, something went wrong!', {
      clickToClose: true,
    });
    console.log(err);
  }
}

function renderImages(arr) {
  const markup = arr.map(hit => templateImages(hit)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

//* ==================================================================================================

/* const observer = new IntersectionObserver(intersectionCallback);

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      LoadMore();
    }
  });
}

async function LoadMore() {
  page += 1;
  if (page === maxPage) {
    Notify.info("We're sorry, but you've reached the end of search results.", {
      clickToClose: true,
      position: 'center-bottom',
    });
  }

  try {
    const response = await getImages(query, page);
    renderImages(response.hits);

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    Notify.failure('Oops, something went wrong!', {
      clickToClose: true,
    });
    console.log(err);
  } finally {
    updateStatusObserver();
  }
}

function updateStatusObserver() {
  if (page === maxPage) {
    observer.unobserve(refs.gallery);
  }
} */
