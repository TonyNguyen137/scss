import { $ } from '../utils';

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

export class Accordion {
  constructor(selector, config = {}) {
    // Define a set of valid configuration properties
    const validProperties = new Set(['transitionDuration', 'type']);

    // Check for any invalid properties in the config object
    for (const key in config) {
      if (!validProperties.has(key)) {
        throw new Error(`Invalid configuration property: '${key}'.`);
      }
    }

    // Destructure config object with defaults after validation
    const { transitionDuration = 300, type = 'open-one' } = config;

    if (type !== 'open-all' && type !== 'open-one') {
      throw new Error('Invalid type. Must be either "open-all" or "open-one".');
    }

    this._accordionEl = typeof selector === 'string' ? $(selector) : selector;
    this._accordionType = type; // 'open-one' or 'open-all'
    this._transitionDuration = transitionDuration;
    this._accordionEl.style.setProperty(
      '--transition-duration',
      `${transitionDuration}ms`
    );
    this._isTransitioning = false;
    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._accordionEl.addEventListener('click', this._toggler.bind(this));
  }

  _blockToggle() {
    // block toggle during transition
    this._isTransitioning = true;

    setTimeout(() => {
      this._isTransitioning = false;
    }, this._transitionDuration);
  }

  _open() {
    this._currentToggleEl.setAttribute('aria-expanded', !this._isExpanded);
    this._currentGridEl.setAttribute('aria-hidden', this._isExpanded);
    this._blockToggle();
  }

  _close(accordionItem) {
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
    this._blockToggle();
  }

  // Event handlers
  _toggler(e) {
    const clickedToggleEl = e.target.closest('.accordion__toggle');

    if (!clickedToggleEl || this._isTransitioning) return;

    if (this._currentToggleEl !== clickedToggleEl) {
      this._currentToggleEl = clickedToggleEl;
      this._currentGridEl = this._currentToggleEl
        .closest('.accordion__item')
        .querySelector('.accordion__grid');
    }

    this._isExpanded =
      this._currentToggleEl.getAttribute('aria-expanded') !== 'false';

    if (this._isExpanded) {
      this._close();
    } else {
      let activeItem = this._accordionEl
        .querySelector('[aria-expanded=true]')
        ?.closest('.accordion__item');

      if (this._accordionType === 'open-one' && activeItem) {
        this._close(activeItem);
      }

      this._open();
    }
  }
}
