import { $ } from '../utils';

export class Accordion {
  constructor(selector, transitionDuration = 300) {
    this._accordionEl = typeof selector === 'string' ? $(selector) : selector;
    this._accordionType = this._accordionEl.dataset.open ?? 'one'; // one (default) or always
    this._height;
    this._accordionEl.style.setProperty(
      '--transitionDuration',
      `${transitionDuration}ms`
    );

    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._accordionEl.addEventListener('click', this._toggler.bind(this));
    this._accordionEl.addEventListener(
      'transitionend',
      this._onMenuTransitionEnd.bind(this)
    );
  }

  _toggleExpandedState() {
    this._toggler.setAttribute('aria-expanded', !this._isExpanded);
  }

  _open() {
    this._togglerEl.setAttribute('aria-expanded', !this._isExpanded);
    this._collapseEl.removeAttribute('data-state');
    this._height = this._collapseEl.offsetHeight / 16;
    this._collapseEl.setAttribute('data-state', 'collapsing');

    setTimeout(() => {
      this._collapseEl.style.setProperty('height', `${this._height}rem`);
    });
  }

  _close() {
    this._togglerEl.setAttribute('aria-expanded', !this._isExpanded);
    this._collapseEl.style.removeProperty('height');
    this._collapseEl.setAttribute('data-state', 'collapsing');
  }

  _closeActiveItem() {
    let activeItem = this._accordionEl
      .querySelector('[aria-expanded=true]')
      ?.closest('.accordion__item');

    if (!activeItem) return;

    console.log('active: ', activeItem);

    activeItem
      .querySelector('.accordion__toggler')
      .setAttribute('aria-expanded', false);
    activeItem
      .querySelector('.accordion__collapse')
      .style.removeProperty('height');
    activeItem
      .querySelector('.accordion__collapse')
      .setAttribute('data-state', 'collapsing');
  }

  // Event handlers
  _toggler(e) {
    this._header = e.target.closest('.accordion__header');
    if (!this._header) return;

    this._togglerEl = this._header
      .closest('.accordion__item')
      .querySelector('.accordion__toggler');

    this._collapseEl = this._header
      .closest('.accordion__item')
      .querySelector('.accordion__collapse');

    this._isExpanded =
      this._togglerEl.getAttribute('aria-expanded') === 'false' ? false : true;
    if (this._isExpanded) {
      this._close();
    } else {
      console.log(this._accordionType);

      if (this._accordionType === 'one') {
        this._closeActiveItem();
      }
      this._open();
    }
  }

  _onMenuTransitionEnd() {
    if (this._isExpanded) {
      console.log('display: none');
    } else {
      this._collapseEl.removeAttribute('data-state');
    }
  }
}
