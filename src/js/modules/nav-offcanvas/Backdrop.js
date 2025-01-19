export class Backdrop {
  constructor({ rootEl, offcanvasEl }) {
    this._navbarEl = rootEl;
    this._containerEl = this._navbarEl.querySelector('.navbar__container');
    this._offcanvasEl = offcanvasEl;
    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._navbarEl.addEventListener(
      'custom:change',
      this._handleMenuToggled.bind(this)
    );
    this._offcanvasEl.addEventListener(
      'transitionend',
      this._remove.bind(this)
    );
  }

  _handleMenuToggled(event) {
    const { isExpanded, removeBackdropImmidiately } = event.detail;
    isExpanded
      ? this._insertBackdrop()
      : this._fadeOut(removeBackdropImmidiately);
  }

  _insertBackdrop() {
    this._backdropEl = document.createElement('div');
    this._backdropEl.classList.add('backdrop', 'fade');
    this._containerEl.appendChild(this._backdropEl);
    this._backdropEl.offsetHeight; // force reflow
    this._backdropEl.classList.add('show');
  }

  _fadeOut(immidiately = false) {
    immidiately
      ? this._backdropEl.remove()
      : this._backdropEl.classList.remove('show');
  }

  _remove(e) {
    if (e.target.matches('.show')) return;
    this._backdropEl.remove();
  }
}
