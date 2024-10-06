export class FocusTrapper {
  constructor({ firstTabbableEl, lastTabbableEl, condition = true }) {
    this._firstTabbableEl = firstTabbableEl;
    this._lastTabbableEl = lastTabbableEl;
    this._callback = this._trap.bind(this);
    this._condition = condition;
    document.addEventListener('keydown', this._callback);
  }
  kill() {
    this._firstTabbableEl = null;
    this._lastTabbableEl = null;
    document.removeEventListener('keydown', this._callback);
    this._callback = null;
  }
  _trap(e) {
    if (typeof this._condition === 'function' ? this._condition() : condition) {
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
}
