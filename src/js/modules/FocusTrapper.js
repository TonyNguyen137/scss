export class FocusTrapper {
  constructor({ first, last, condition = true }) {
    this._firstTabbableEl = first;
    this._lastTabbableEl = last;
    this._callback = this._trap.bind(this);
    document.addEventListener('keydown', this._callback);
  }
  _kill() {
    this._firstTabbableEl = null;
    this._lastTabbableEl = null;
    document.removeEventListener('keydown', this._callback);
    this._callback = null;
  }
  _trap(e) {
    switch (e.key) {
      case 'Tab':
        const target = e.target;
        const shiftPressed = e.shiftKey;
        let borderElem = shiftPressed
          ? this._firstTabbableEl
          : this._lastTabbableEl;

        if (target === borderElem) {
          e.preventDefault();
          borderElem === this._firstTabbableEl
            ? this._lastTabbableEl.focus()
            : this._firstTabbableEl.focus();
        }
        break;
      default:
        break;
    }
  }
}
