import { Utils } from '../utils';
import { FocusTrapper } from '../modules';

export class Navbar {
  constructor(navbarEl, config = {}) {
    this._navbarEl =
      typeof navbarEl === 'string' ? Utils.select(navbarEl) : navbarEl;
    this._toggleEl = this._navbarEl.querySelector('.navbar__toggle');
    this._collapseEl = this._navbarEl.querySelector('.navbar__collapse');
    this._collapseElHeight = null;
    this._isTransitioning = false;
    this._coreModules = [FocusTrapper];
    this._coreModulesInstances = [];
    this._initEventListeners();
  }

  _isExpanded() {
    return this._toggleEl.getAttribute('aria-expanded') === 'true';
  }

  _setExpanded(bool) {
    this._toggleEl.setAttribute('aria-expanded', bool);
  }

  _initEventListeners() {
    this._toggleEl.addEventListener('click', this._toggleMenu.bind(this));
  }

  _closeMenu() {
    this._setExpanded(false);
  }

  _openMenu() {
    this._setExpanded(true);
    this._collapseEl.dataset.state = '';
    // cache height
    if (!this._collapseElHeight) {
      this._collapseElHeight = this._collapseEl.offsetHeight;
    }
    this._collapseEl.dataset.state = 'collapsing';

    setTimeout(() => {
      this._collapseEl.style.setProperty(
        'height',
        `${this._collapseElHeight}px`
      );
    });
  }

  // Event Listeners

  _toggleMenu() {
    if (this._isExpanded()) {
      // close the menu
      this._closeMenu();
    } else {
      // open the menu
      this._openMenu();
    }
  }
}
