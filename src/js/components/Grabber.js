import { Utils } from '../utils';

export class Grabber {
  constructor(selector) {
    this._grabberEl =
      typeof selector === 'string' ? Utils.select(selector) : selector;
    this._grabberInnerEl = this._grabberEl.querySelector('.grabber__inner');
    this._grabbed = false;
    this._isInit = false;

    const resizeObserver = new ResizeObserver(() => {
      console.log('inside');
      if (this._isOverflowing()) {
        this._init();
      } else {
        this._kill();
      }
    });
    resizeObserver.observe(this._grabberEl);
  }

  _init() {
    this._grabberEl.addEventListener('mousedown', (e) => {
      console.log('mouse down', e.target);

      if (e.target === this._grabberEl || this._grabberEl.contains(e.target)) {
        this._grabbed = true;
        this._grabberEl.style.cursor = 'grabbing';
        console.log('inside');
        console.log('cursor: ', this._grabberEl.style.cursor);
      }
    });

    this._grabberEl.addEventListener('mouseup', (e) => {
      if (e.target === this._grabberEl || this._grabberEl.contains(e.target)) {
        this._grabbed = false;
        this._grabberEl.style.cursor = 'grab';
      }
    });

    this._grabberEl.addEventListener('mouseleave', (e) => {
      this._grabbed = false;
      this._grabberEl.style.cursor = 'grab';
    });

    this._grabberEl.addEventListener('mousemove', (e) => {
      if (this._grabbed) {
        this._grabberInnerEl.parentElement.scrollLeft -= e.movementX;
      }
    });
    this._isInit = true;
  }

  _kill() {
    this._isInit = false;
  }

  _getScrollPercentage() {
    return (
      (this._grabberInnerEl.parentElement.scrollLeft /
        (this._grabberInnerEl.parentElement.scrollWidth -
          this._grabberInnerEl.parentElement.clientWidth)) *
      100
    );
  }

  _isOverflowing() {
    return this._grabberInnerEl.scrollWidth > this._grabberInnerEl.clientWidth;
  }
}
