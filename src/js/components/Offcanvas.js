import { $, breakPoints, setAttributes, removeAttributes } from '../utils';

export class Navbar {
  constructor(selector) {
    this._navbarEl = typeof selector === 'string' ? $(selector) : selector;
    this._offcanvasEl = this._navbarEl.querySelector('.navbar__offcanvas');
    this._btnOpenEl = this._navbarEl.querySelector('.navbar__btn--open');
    this._btnCloseEl = this._navbarEl.querySelector('.navbar__btn--close');
    this._media = window.matchMedia(
      `(min-width: ${
        breakPoints[this._navbarEl.getAttribute('data-extended')]
      }px )`
    );
    console.log(this._btnCloseEl);

    this._setupMedia(this._media);
    this._init();
  }

  _init() {
    this._btnOpenEl.addEventListener('click', this._openMenu.bind(this));
    this._btnCloseEl.addEventListener('click', this._closeMenu.bind(this));
    this._media.addEventListener('change', this._setupMedia.bind(this));
  }

  _setupMedia(e) {
    if (e.matches) {
      // extended menu
      removeAttributes(
        this._offcanvasEl,
        'inert',
        'dialog',
        'tabindex',
        'aria-modal'
      );
    } else {
      // off canvas
      setAttributes(this._offcanvasEl, {
        inert: '',
        tabindex: -1,
        role: 'dialog',
        'aria-modal': true,
      });
      this._offcanvasEl.style.transition = 'none';
    }
  }

  _openMenu() {
    this._btnOpenEl.setAttribute('aria-expanded', 'true');
    removeAttributes(this._offcanvasEl, 'inert', 'style');
    this._offcanvasEl.focus();
  }

  _closeMenu() {
    this._btnOpenEl.setAttribute('aria-expanded', 'false');
    this._offcanvasEl.setAttribute('inert', '');
    this._btnOpenEl.focus();
    setTimeout(() => {
      this._offcanvasEl.style.transition = 'none';
    }, 500);
  }
}
