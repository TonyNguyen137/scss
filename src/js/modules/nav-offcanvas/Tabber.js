export class Tabber {
  constructor({ rootEl, tabbableEls, openBtnEl }) {
    this._navbarEl = rootEl;
    this._boundKeydownHandler = this._keydownHandler.bind(this);
    this._openBtnEl = openBtnEl;

    this._firstTabbableEl = tabbableEls[0];
    this._lastTabbableEl = tabbableEls[tabbableEls.length - 1];

    this._navbarEl.addEventListener(
      'custom:change',
      this._handleMenuToggled.bind(this)
    );
  }

  _handleMenuToggled(event) {
    const { isExpanded } = event.detail;
    isExpanded ? this._addKeydownListener() : this._removeKeydownListener();
  }

  _addKeydownListener() {
    document.addEventListener('keydown', this._boundKeydownHandler);
  }

  _removeKeydownListener() {
    document.removeEventListener('keydown', this._boundKeydownHandler);
    this._openBtnEl.focus();
  }

  _keydownHandler(event) {
    if (event.key === 'Tab') {
      // console.log('target: ', event.target);

      const target = event.target;
      const shiftPressed = event.shiftKey;

      let borderElem = shiftPressed
        ? this._firstTabbableEl
        : this._lastTabbableEl;

      if (target === borderElem) {
        event.preventDefault();

        borderElem === this._firstTabbableEl
          ? this._lastTabbableEl.focus()
          : this._firstTabbableEl.focus();
      }
    }
  }
}
