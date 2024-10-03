import { $, validatePropertiesOf } from '../utils';
import { FocusTrapper, Backdrop } from '../modules';

export class Navbar {
  constructor(navbarEl, config = {}) {
    validatePropertiesOf(
      config,
      'transitionDuration',
      'backdropColor',
      'backdropOpacity',
      'backdropZindex',
      'lastTabbleEl',
      'firstTabbleEl'
    );

    this._config = {
      transitionDuration: config.transitionDuration || 300,
      backdropColor: config.backdropColor || null,
      backdropOpacity: config.backdropOpacity || null,
      backdropZindex: config.backdropZindex || null,
      firstTabbableEl: config.firstTabbleEl || null,
      lastTabbleEl: config.lastTabbleEl || null,
    };

    this._navbarEl = typeof navbarEl === 'string' ? $(navbarEl) : navbarEl;
    this._toggleEl = this._navbarEl.querySelector('.navbar__toggle');
    this._collapseEl = this._navbarEl.querySelector('.navbar__collapse');
    this._listEl = this._navbarEl.querySelector('.navbar__list');
    this._firstTabbableEl = this._config.firstTabbableEl || this._toggleEl;
    this._lastTabbableEl =
      this._config.lastTabbableEl ||
      Array.from(document.querySelectorAll('.navbar .navbar__link')).at(-1);

    this._navbarEl.style.setProperty(
      '--transition-duration',
      `${this._config.transitionDuration}ms`
    );

    // Make the element focusable when the navigation menu is expanded
    this._listEl.setAttribute('tabindex', '-1');

    this._initEventHandlers();
  }

  _initEventHandlers() {
    this._toggleEl.addEventListener('click', this._toggleMenu.bind(this));
    this._collapseEl.addEventListener(
      'transitionend',
      this._onMenuTransitionEnd.bind(this)
    );

    document.addEventListener('keypress', (e) => {
      if (!this.expanded) return;
      if (e.key === 'Escape') this._closeMenu();
    });
  }

  get expanded() {
    return this._toggleEl.getAttribute('aria-expanded') === 'true'
      ? true
      : false;
  }

  set expanded(state) {
    this._toggleEl.setAttribute('aria-expanded', state);
  }

  // Event handlers
  _toggleMenu(e) {
    if (!this.expanded) {
      this._openMenu();
    } else {
      this._closeMenu();
    }
  }

  _openMenu(e) {
    this._toggleEl.setAttribute('aria-expanded', !this.expanded);
    this._collapseEl.removeAttribute('data-state');
    let height = this._collapseEl.offsetHeight / 16;
    this._collapseEl.setAttribute('data-state', 'collapsing');
    Backdrop.insertTo(document.body, {
      transitionDuration: this._config.transitionDuration,
      opacity: this._backdropOpacity,
      z: this._backdropZindex,
      backgroundColor: this._backdropColor,
    });
    this._listEl.focus();

    setTimeout(() => {
      this._collapseEl.style.setProperty('height', `${height}rem`);
    });
  }

  _closeMenu(e) {
    this._toggleEl.setAttribute('aria-expanded', !this.expanded);
    this._collapseEl.style.removeProperty('height');
    this._collapseEl.setAttribute('data-state', 'collapsing');
    this._toggleEl.focus();
    Backdrop.remove();
  }

  _onMenuTransitionEnd() {
    if (this.expanded) {
      this._collapseEl.removeAttribute('data-state');
    } else {
      this._collapseEl.setAttribute('data-state', 'collapsed');
    }
  }
}
