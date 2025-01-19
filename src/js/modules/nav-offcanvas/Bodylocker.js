export class Bodylocker {
  constructor({ rootEl }) {
    this._navbarEl = rootEl;
    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._navbarEl.addEventListener(
      'custom:change',
      this._handleMenuToggle.bind(this)
    );
  }

  _lockScreen() {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.setAttribute(
      'style',
      `position:fixed; width:100%; overflow: hidden; padding-right: ${scrollbarWidth}px` // prevent the page from jumping when locking.
    );
  }
  _unlockScreen() {
    document.body.removeAttribute('style');
  }
  // Event handler

  _handleMenuToggle(event) {
    const { isExpanded } = event.detail;

    isExpanded ? this._lockScreen() : this._unlockScreen();
  }
}
