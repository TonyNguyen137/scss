import { $ } from '../utils';

export class TopScroller {
  #btnEl;
  constructor(btnEl) {
    this.#btnEl = typeof btnEl === 'string' ? $(btnEl) : btnEl;
    this.#btnEl.addEventListener('click', this.#scrollToTop);
  }

  #scrollToTop() {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth',
    });
  }
}
