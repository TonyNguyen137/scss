import { $, breakPoints, setAttributes, removeAttributes } from '../utils';
import { BodyLocker, Backdrop, FocusTrapper } from '../modules';
export class Navbar {
  constructor(selector, { transDur = 300 } = {}) {
    this._navbarEl = typeof selector === 'string' ? $(selector) : selector;
    this._offcanvasEl = this._navbarEl.querySelector('.navbar__offcanvas');
    this._btnOpenEl = this._navbarEl.querySelector('.navbar__btn--open');
    this._btnCloseEl = this._navbarEl.querySelector('.navbar__btn--close');
    this._firstTabbableEl = this._btnCloseEl;
    this._lastTabbableEl = Array.from(
      this._navbarEl.querySelectorAll('.navbar__link')
    ).at(-1);
    this._translateDuration = transDur;
    this._navbarEl.style.setProperty(
      '--transDur',
      `${this._translateDuration}ms`
    );

    this._isExpanded = false;
    this._media = window.matchMedia(
      `(min-width: ${
        breakPoints[this._navbarEl.getAttribute('data-extended')]
      })`
    );

    this._setupMedia(this._media);
    this._init();
  }

  _init() {
    this._btnOpenEl.addEventListener('click', this._openMenu.bind(this));
    this._btnCloseEl.addEventListener('click', this._closeMenu.bind(this));
    this._media.addEventListener('change', this._setupMedia.bind(this));

    ['keydown', 'click'].forEach((eventListener) => {
      document.addEventListener(eventListener, (e) => {
        let condition =
          eventListener === 'click'
            ? this._isExpanded && e.target.classList.contains('backdrop')
            : this._isExpanded && e.key === 'Escape';
        if (condition) {
          this._closeMenu();
        }
      });
    });
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
      this._btnOpenEl.setAttribute('aria-expanded', 'false');
      BodyLocker.release();
      Backdrop.kill();
      this._focusTrapper && this._focusTrapper._kill();
      this._focusTrapper = null;
    } else {
      // off canvas
      setAttributes(this._offcanvasEl, {
        inert: '',
        tabindex: -1,
        role: 'dialog',
        'aria-modal': true,
      });
      this._focusTrapper = new FocusTrapper({
        first: this._firstTabbableEl,
        last: this._lastTabbableEl,
      });
      this._offcanvasEl.style.transition = 'none';
    }
  }

  _openMenu() {
    this._btnOpenEl.setAttribute('aria-expanded', 'true');
    this._isExpanded = true;
    removeAttributes(this._offcanvasEl, 'inert', 'style');
    BodyLocker.lock();
    Backdrop.insertTo(this._navbarEl, { transDur: this._translateDuration });
    this._offcanvasEl.focus();
  }

  _closeMenu() {
    this._btnOpenEl.setAttribute('aria-expanded', 'false');
    this._isExpanded = false;
    this._offcanvasEl.setAttribute('inert', '');
    this._btnOpenEl.focus();
    Backdrop.remove();
    setTimeout(() => {
      this._offcanvasEl.style.transition = 'none';
      BodyLocker.release();
    }, this._translateDuration);
  }
}
