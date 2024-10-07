import { $, validatePropertiesOf } from '../utils';

/*
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
    this._accordionEl.addEventListener('Toggle', this._toggler.bind(this));
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

*/

// accordion-grid
export class Accordion {
  constructor(selector, config = {}) {
    this._accordionEl = typeof selector === 'string' ? $(selector) : selector;
    this._config = {
      transition: {
        transitionDuration: config.transitionDuration,
        transitionOpen: config.transitionOpen,
        transitionClose: config.transitionClose,
      },
      type: config.type || 'open-one', // 'open-one' or 'open-all'
    };
    this._isTransitioning = false;

    for (let key in this._config.transition) {
      // if value exist - set css variable for transition duration
      this._config.transition[key] !== undefined &&
        this._accordionEl.style.setProperty(
          `--${key}`,
          `${Math.abs(this._config.transition[key])}ms`
        );
    }
    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._accordionEl.addEventListener('click', this._toggle.bind(this));
    this._accordionEl.addEventListener(
      'transitionend',
      this._onTransitionend.bind(this)
    );
  }

  _open() {
    console.log('open');

    this._currentToggleEl.setAttribute('aria-expanded', !this._isExpanded);
    this._currentGridEl.setAttribute('aria-hidden', this._isExpanded);

    if (this._config.transition.transitionOpen == 0) {
      console.log('open Fired');

      this._isTransitioning = false;
    }
  }

  _close(accordionItem) {
    console.log('close');

    if (accordionItem) {
      accordionItem
        .querySelector('.accordion__toggle')
        .setAttribute('aria-expanded', this._isExpanded);
      accordionItem
        .querySelector('.accordion__grid')
        .setAttribute('aria-hidden', !this._isExpanded);
    } else {
      this._currentToggleEl.setAttribute('aria-expanded', !this._isExpanded);
      this._currentGridEl.setAttribute('aria-hidden', this._isExpanded);
    }

    if (this._config.transition.transitionClose == 0) {
      console.log('close Fired');

      // this._isTransitioning = false;
    }
  }

  // Event handlers
  _toggle(e) {
    const clickedToggleEl = e.target.closest('.accordion__toggle');
    console.log('before clickedToggleEl: ', !clickedToggleEl);
    console.log('before isTransitioning: ', this._isTransitioning);

    console.log(!clickedToggleEl || this._isTransitioning);

    if (!clickedToggleEl || this._isTransitioning) return;

    if (this._currentToggleEl !== clickedToggleEl) {
      this._currentToggleEl = clickedToggleEl;
      this._currentGridEl = this._currentToggleEl
        .closest('.accordion__item')
        .querySelector('.accordion__grid');
    }

    this._isExpanded =
      this._currentToggleEl.getAttribute('aria-expanded') !== 'false';

    this._isTransitioning = true;
    console.log('after: ', this._isTransitioning);
    console.log('--------------------');

    if (this._isExpanded) {
      this._close();
    } else {
      if (this._config.type === 'open-one') {
        // Close the currently open accordion item before opening a new one.
        let activeItem = this._accordionEl
          .querySelector('[aria-expanded=true]')
          ?.closest('.accordion__item');
        this._close(activeItem);
      }

      this._open();
    }
  }

  _onTransitionend(e) {
    if (e.propertyName === 'grid-template-rows') {
      this._isTransitioning = false;
    }
  }
}
