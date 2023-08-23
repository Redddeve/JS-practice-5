import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export class PixAPI {
  query = '';
  #pageSize = 40;
  page = 1;

  getArticles() {
    const params = new URLSearchParams({
      apiKey: KEY,
      q: this.query,
      pageSize: this.#pageSize,
      page: this.page,
    });

    const url = `${BASE_URL}${END_POINT}?${params}`;
    return fetch(url).then(res => res.json());
  }

  getImages() {
    const params = new URLSearchParams({
      key: '39009655-5531f53105d0117785bd13541',
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.#pageSize,
    });
    params.set('q', 'cat');
    return axios.get(`${BASE_URL}?${params}`);
  }

  get pageSize() {
    return this.#pageSize;
  }
}
