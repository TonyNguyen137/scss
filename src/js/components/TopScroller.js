import { Utils } from '../utils';

export class TopScroller {
  #btnEl;
  constructor(btnEl) {
    this.#btnEl = typeof btnEl === 'string' ? Utils.select(btnEl) : btnEl;
    this.#btnEl.addEventListener('click', this.#scrollToTop);
  }

  #scrollToTop() {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth',
    });
  }
}
