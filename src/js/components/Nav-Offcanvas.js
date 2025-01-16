import { $, breakPoints } from '../utils';

export class Navbar {
  constructor(navbarEl = '.navbar', config = {}) {
    this._rootEl = typeof navbarEl === 'string' ? $(navbarEl) : navbarEl;
    this._openBtnEl = this._rootEl.querySelector('.navbar__openBtn');
    this._closeBtnEl = this._rootEl.querySelector('.navbar__closeBtn');
    this._isExpanded = null;
    this._offcanvasEl = this._rootEl.querySelector('.navbar__offcanvas');
    this._isTransitioning = false;
    this._modules = [];
    this._initEventListener();
  }

  _initEventListener() {
    this._openBtnEl.addEventListener('click', this._openOffcanvas.bind(this));
    this._closeBtnEl.addEventListener('click', this._closeOffcanvas.bind(this));
    this._offcanvasEl.addEventListener(
      'transitionend',
      this._onTransitionEnd.bind(this)
    );
  }

  _setAriaExpanded(bool) {
    this._openBtnEl.ariaExpanded = bool;
    this._isExpanded = bool;
  }
  _setTransitionClass() {
    this._offcanvasEl.classList.add('showing');
  }

  _updateClassOnOffcanvasShow() {
    this._offcanvasEl.classList.remove('showing');
    this._offcanvasEl.classList.add('show');
  }

  _updateClassOnOffcanvasHide() {
    this._offcanvasEl.classList.remove('showing');
    this._offcanvasEl.classList.remove('show');
  }

  // Event Handler
  _openOffcanvas() {
    this._setAriaExpanded(true);
    this._setTransitionClass();
    this._isTransitioning = true;
  }

  _closeOffcanvas() {
    this._setTransitionClass();
    this._setAriaExpanded(false);
  }

  _onTransitionEnd(e) {
    if (this._isExpanded) {
      this._updateClassOnOffcanvasShow();
    } else {
      this._updateClassOnOffcanvasHide();
    }

    this._isTransitioning = false;
  }
}
