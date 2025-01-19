import { $, breakPoints } from '../utils';
import { Backdrop } from '../modules/nav-offcanvas/Backdrop';
import { Tabber } from '../modules/nav-offcanvas/Tabber';
import { Bodylocker } from '../modules/nav-offcanvas/Bodylocker';

export class Navbar {
  constructor(navbarEl = '.navbar', options = {}) {
    this._rootEl = typeof navbarEl === 'string' ? $(navbarEl) : navbarEl;
    this._openBtnEl = this._rootEl.querySelector('.navbar__openBtn');
    this._closeBtnEl = this._rootEl.querySelector('.navbar__closeBtn');
    this._isExpanded = null;
    this._offcanvasEl = this._rootEl.querySelector('.navbar__offcanvas');
    this._isTransitioning = false;
    this._tabbableEls = this._rootEl.querySelectorAll(
      '.navbar__closeBtn, .navbar__link'
    );
    this._modules = [Backdrop, Tabber, Bodylocker, ...(options?.modules || [])];

    this._initEventListener();
    this._initModules();
  }

  _initEventListener() {
    this._openBtnEl.addEventListener('click', this._openOffcanvas.bind(this));
    this._closeBtnEl.addEventListener('click', this._closeOffcanvas.bind(this));
    this._offcanvasEl.addEventListener(
      'transitionend',
      this._onTransitionEnd.bind(this)
    );
    document.addEventListener('click', this._handleDocumentClick.bind(this));
  }

  _initModules() {
    this._modules.forEach((Module) => {
      new Module({
        rootEl: this._rootEl,
        openBtnEl: this._openBtnEl,
        offcanvasEl: this._offcanvasEl,
        tabbableEls: this._tabbableEls,
      });
    });
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

  _dispatchEvent(data) {
    const options = { isExpanded: this._isExpanded, ...(data || {}) };
    const event = new CustomEvent('custom:change', { detail: options });
    this._rootEl.dispatchEvent(event);
  }

  // Event Handler
  _openOffcanvas() {
    this._setAriaExpanded(true);
    this._setTransitionClass();
    this._isTransitioning = true;
    this._offcanvasEl.setAttribute('aria-modal', 'true');
    this._offcanvasEl.setAttribute('role', 'dialog');
    this._offcanvasEl.focus();

    this._dispatchEvent();
  }

  _closeOffcanvas() {
    this._setTransitionClass();
    this._setAriaExpanded(false);
    this._offcanvasEl.removeAttribute('aria-modal');
    this._offcanvasEl.removeAttribute('role');
    this._dispatchEvent();
  }

  _handleDocumentClick(e) {
    if (!this._isExpanded || this._isTransitioning) return;

    if (e.target.closest('.navbar__offcanvas') != this._offcanvasEl) {
      this._closeOffcanvas();
    }
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
