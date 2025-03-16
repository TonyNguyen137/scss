import { Utils, breakPoints } from '../utils';
import { FocusTrapper } from '../modules';

export class Navbar {
  constructor(navbarEl, config = {}) {
    this._navbarEl =
      typeof navbarEl === 'string' ? Utils.select(navbarEl) : navbarEl;
    this._navbarElHeight = this._navbarEl.offsetHeight;
    this._toggleEl = this._navbarEl.querySelector('.navbar__toggle');
    this._collapseEl = this._navbarEl.querySelector('.navbar__collapse');
    this._isTransitioning = false;
    this._coreModules = [FocusTrapper];
    this._coreModulesInstances = [];

    this._config = {
      transitionDuration: config.transitionDuration ?? 300,
      insertBackdropTo: config.insertBackdropTo || document.body,
      firstTabbableEl: config.firstTabbleEl || this._toggleEl,
      lastTabbableEl:
        config.lastTabbleEl ||
        Array.from(document.querySelectorAll('.navbar .navbar__link')).at(-1),
      fadeinTransition: config.fadeinTransition,
      fadeoutTransition: config.fadeoutTransition,
      isFullHeight: config.isFullHeight === true,
      modules: [...(Array.isArray(config.modules) ? config.modules : [])],
      condition: () => this._expanded,
    };

    console.log(document.clientHeight);
    console.log('anfang: ', window.innerHeight);

    this._navbarEl.style.setProperty(
      '--transition-duration',
      `${Math.abs(this._config.transitionDuration)}ms`
    );

    this._mediaExpand = window.matchMedia(
      `screen and (min-width: ${
        breakPoints[this._navbarEl.getAttribute('data-expanded')]
      }) and (hover:hover)`
    );

    this._browserSupport = {
      dvh: CSS.supports('height', '100dvh') ? '100dvh' : '100vh',
    };

    this._defaultBrowserFontsize = parseInt(
      window.getComputedStyle(document.documentElement).fontSize
    );

    this._setupMedia(this._mediaExpand);
    this._mediaExpand.addEventListener('change', this._setupMedia.bind(this));

    document.addEventListener('click', (e) => {
      console.log('e.target: ', e.target);
    });
  }

  get _expanded() {
    return this._toggleEl.getAttribute('aria-expanded') === 'true'
      ? true
      : false;
  }

  set _expanded(state) {
    this._toggleEl.setAttribute('aria-expanded', state);
  }

  _initEventHandlers() {
    // Ensure the action is executed only once, preventing reinitialization on window resize (most likely not happening in production)
    if (!this._hasInitEventHandlers) {
      this._toggleEl.addEventListener('click', this._toggleMenu.bind(this));

      this._collapseEl.addEventListener(
        'transitionend',
        this._onMenuTransitionEnd.bind(this)
      );

      // reset max height on collapseEl in case the user switch orientation
      screen.orientation.addEventListener('change', (event) => {
        this._closeMenu(0);
        this._collapseEl.style.removeProperty('max-height');
        this._collapseMaxHeight = null;
      });

      document.addEventListener('keydown', (e) => {
        if (!this._expanded) return;
        if (e.key === 'Escape') this._closeMenu(this._config.fadeoutTransition);
      });
      this._hasInitEventHandlers = true;
    }
  }

  // Event handlers
  //
  _setupMedia(media) {
    if (media.matches) {
      this._closeMenu(0);

      // Safely kill all instantiated modules
      this._coreModulesInstances.forEach((moduleInstance) => {
        moduleInstance.kill();
      });
      this._coreModulesInstances = [];
    } else {
      this._initEventHandlers();

      this._coreModules.forEach((Module) => {
        this._coreModulesInstances.push(new Module(this._config));
      });
    }
  }

  _toggleMenu(e) {
    // prevent multiple clicks
    if (this._isTransitioning) return;

    if (!this._expanded) {
      this._openMenu(this._config.fadeinTransition);
    } else {
      this._closeMenu(this._config.fadeoutTransition);
    }
  }

  _openMenu(fadeinTransition = this._config.transitionDuration) {
    console.log('open');
    const fadeinDuration = Math.abs(fadeinTransition);
    // 'collapsing' has css transition property
    const state = fadeinDuration > 0 ? 'collapsing' : 'show';
    this._isTransitioning = fadeinDuration > 0;
    this._expanded = true;
    this._collapseEl.removeAttribute('data-state');

    // cache the collapseEl height value
    if (!this._collapseHeight) {
      this._collapseHeight = this._config.isFullHeight
        ? `calc(${this._browserSupport.dvh} - ${this._navbarElHeight + 'px'})`
        : this._collapseEl.offsetHeight / this._defaultBrowserFontsize + 'rem';
    }

    // set max height on collapseEl to enable 'overflow-y:scroll' on landscape mode
    if (
      !this._config.isFullHeight &&
      this._collapseEl.offsetHeight + this._navbarElHeight > window.innerHeight
    ) {
      this._collapseMaxHeight =
        (window.innerHeight - this._navbarElHeight) /
          this._defaultBrowserFontsize +
        'rem';

      console.log(
        `max height: ${window.innerHeight} - ${this._navbarElHeight} / ${this._defaultBrowserFontsize} =`,
        (window.innerHeight - this._navbarElHeight) /
          this._defaultBrowserFontsize +
          'rem'
      );
    }

    if (
      fadeinDuration > 0 &&
      fadeinDuration !== this._config.transitionDuration
    ) {
      this._collapseEl.style.setProperty(
        '--transition-duration',
        `${fadeinDuration}ms`
      );
    }

    this._collapseEl.setAttribute('data-state', state);

    this._config.modules.forEach((Module) => {
      Module.init(this._config);
    });

    // the small delay '5ms' guarantee the height transition.
    setTimeout(() => {
      this._collapseEl.style.setProperty('height', this._collapseHeight);
      this._collapseMaxHeight &&
        this._collapseEl.style.setProperty(
          'max-height',
          this._collapseMaxHeight
        );

      console.log('this._collapseEl after open: ', this._collapseEl);
    }, 5);
  }

  _closeMenu(fadeoutTransition = this._config.transitionDuration) {
    console.log('close');

    const fadeoutDuration = Math.abs(fadeoutTransition);
    const state = fadeoutDuration > 0 ? 'collapsing' : 'collapsed';
    this._expanded = false;
    this._isTransitioning = fadeoutDuration > 0;
    this._collapseEl.style.removeProperty('height');

    this._collapseEl.setAttribute('data-state', state);

    if (
      fadeoutDuration > 0 &&
      fadeoutDuration !== this._config.transitionDuration
    ) {
      // defaults to the global transitionDuration
      this._collapseEl.style.setProperty(
        '--transition-duration',
        `${fadeoutDuration}ms`
      );
    } else {
      // required when resizing the window during the transition. (most likely not happening in the production)
      this._collapseEl.style.removeProperty('--transition-duration');
    }

    this._config.modules.forEach((Module) => {
      Module.kill({ fadeoutTransition: fadeoutDuration });
    });

    this._toggleEl.focus();
    console.log('this._collapseEl after close: ', this._collapseEl);
  }

  // this event handler will not trigger if any transition Duration is 0!
  _onMenuTransitionEnd() {
    if (this._expanded) {
      this._collapseEl.setAttribute('data-state', 'show');
    } else {
      this._collapseEl.setAttribute('data-state', 'collapsed');
    }
    this._isTransitioning = false;
  }
}
