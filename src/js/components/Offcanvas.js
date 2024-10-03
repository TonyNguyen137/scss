import {
  $,
  breakPoints,
  setAttributesTo,
  removeAttributesFrom,
  validatePropertiesOf,
} from '../utils';
import { BodyScrollLocker, Backdrop, FocusTrapper } from '../modules';

export class Navbar {
  constructor(selector, config = {}) {
    validatePropertiesOf(config, 'transitionDuration');

    const { transitionDuration = 300 } = config;

    this._navbarEl = typeof selector === 'string' ? $(selector) : selector;
    this._offcanvasEl = this._navbarEl.querySelector('.navbar__offcanvas');
    this._btnOpenEl = this._navbarEl.querySelector('.navbar__btn--open');
    this._btnCloseEl = this._navbarEl.querySelector('.navbar__btn--close');
    this._firstTabbableEl = this._btnCloseEl;
    this._lastTabbableEl = Array.from(
      this._navbarEl.querySelectorAll('.navbar__link')
    ).at(-1);
    this._transitionDuration = transitionDuration;
    this._isTransitioning = false;
    this._navbarEl.style.setProperty(
      '--transDur',
      `${this._transitionDuration}ms`
    );
    this._media = window.matchMedia(
      `(min-width: ${
        breakPoints[this._navbarEl.getAttribute('data-extended')]
      })`
    );

    this._setupMedia(this._media);
    this._setEventListeners();
  }

  _setEventListeners() {
    this._btnOpenEl.addEventListener('click', this._openMenu.bind(this));
    this._btnCloseEl.addEventListener('click', this._closeMenu.bind(this));
    this._media.addEventListener('change', this._setupMedia.bind(this));

    ['keydown', 'click'].forEach((eventListener) => {
      document.addEventListener(eventListener, (e) => {
        let condition =
          eventListener === 'click'
            ? this._getExtendedState() &&
              !this._isTransitioning &&
              !e.target.closest('.navbar__offcanvas')
            : this._getExtendedState() &&
              !this._isTransitioning &&
              e.key === 'Escape';

        if (!condition) return;

        this._closeMenu();
      });
    });
  }
  _setupMedia(e) {
    this._offcanvasEl.style.transition = 'none';
    this._isTransitioning = false;

    if (e.matches) {
      // extended menu
      removeAttributesFrom(
        this._offcanvasEl,
        'inert',
        'role',
        'tabindex',
        'aria-modal'
      );
      this._btnOpenEl.setAttribute('aria-expanded', 'false');
      BodyScrollLocker.release();
      Backdrop.kill();
      this._focusTrapper && this._focusTrapper._kill();
      this._focusTrapper = null;
    } else {
      // off canvas
      setAttributesTo(this._offcanvasEl, {
        inert: '',
        tabindex: -1,
        role: 'dialog',
        'aria-modal': true,
      });
      this._focusTrapper = new FocusTrapper({
        first: this._firstTabbableEl,
        last: this._lastTabbableEl,
      });
    }
  }

  _getExtendedState() {
    return this._btnOpenEl.getAttribute('aria-expanded') === 'true';
  }

  // block mouse click and keydown handlers of document while transitioning
  _blockInteraction(onTransitionEndCallBack) {
    this._isTransitioning = true;

    setTimeout(() => {
      this._isTransitioning = false;

      if (typeof onTransitionEndCallBack === 'function') {
        onTransitionEndCallBack();
      }
    }, this._transitionDuration);
  }

  // event handlers
  _openMenu() {
    // changing aria-expanded value from btnOpenEl triggers the offcanvas menu
    this._btnOpenEl.setAttribute('aria-expanded', 'true');
    this._blockInteraction();
    removeAttributesFrom(this._offcanvasEl, 'inert', 'style');
    BodyScrollLocker.lock();
    Backdrop.insertTo(this._navbarEl, { transDur: this._transitionDuration });
    this._offcanvasEl.focus();
  }

  _closeMenu() {
    this._btnOpenEl.setAttribute('aria-expanded', 'false');
    this._blockInteraction(() => {
      BodyScrollLocker.release();
      this._btnOpenEl.focus();
    });
    this._offcanvasEl.setAttribute('inert', '');
    Backdrop.remove();
  }
}
