import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';

export async function getImages(query, page) {
  const params = new URLSearchParams({
    key: '39009655-5531f53105d0117785bd13541',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });
  params.set('q', query);
  return await axios.get(`${BASE_URL}?${params}`).then(res => {
    if (res.status !== 200) {
      throw new Error(res.message);
    }
    if (res.data.total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 2000,
        }
      );
    }
    return res.data;
  });
}

export function templateImages({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
<div class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"  width="400" height="300" />
  </a>
  <ul class="info">
    <li class="info-item">
      <b>Likes</b>
      <p>${likes}</p>
    </li>
    <li class="info-item">
      <b>Views</b>
      <p>${views}</p>
    </li>
    <li class="info-item">
      <b>Comments</b>
      <p>${comments}</p>
    </li>
    <li class="info-item">
      <b>Downloads</b>
      <p>${downloads}</p>
    </li>
  </ul>
</div>`;
}
