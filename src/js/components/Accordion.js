import { $ } from '../utils';
// accordion-grid
export class Accordion {
  constructor(selector, config = {}) {
    this._accordionEl = typeof selector === 'string' ? $(selector) : selector;
    this._currentToggleEl = null;
    this._currentGridEl = null;
    this._prevToggleEl = null;
    this._prevGridEl = null;
    this._isTransitioning = false;
    this._config = {
      // possible type: 'free-expand' or 'one-in-group' else default behavior
      type: config.type,
      // transition Duration values come from css file, needed for setTimeout to block double Click
      transitionDuration: {
        default:
          parseFloat(
            getComputedStyle(this._accordionEl).getPropertyValue(
              '--transition-duration-default'
            )
          ) || 0,
        open:
          parseFloat(
            getComputedStyle(this._accordionEl).getPropertyValue(
              '--transition-duration-open'
            )
          ) || undefined,
        close:
          parseFloat(
            getComputedStyle(this._accordionEl).getPropertyValue(
              '--transition-duration-close'
            )
          ) || undefined,
      },
    };

    this._initEventHandlers();
  }

  get _expanded() {
    return this._currentToggleEl.getAttribute('aria-expanded') === 'true';
  }

  // The _expanded setter manage the opening and closing of the accordion item.

  set _expanded({
    accordionItem = null,
    state,
    transitionDuration,
    blockClick = true,
  }) {
    if (accordionItem) {
      accordionItem.toggleEl.setAttribute('aria-expanded', state);
      accordionItem.gridEl.setAttribute('aria-hidden', !state);
    } else {
      this._currentToggleEl.setAttribute('aria-expanded', state);
      this._currentGridEl.setAttribute('aria-hidden', !state);
    }

    // Not required when closing a previous accordion__item while opening a new one, as _open() already calls _blockClickDuringTransition()
    blockClick && this._blockClickDuringTransition(transitionDuration);

    this._config.type === 'one-in-group' &&
      this._blockInteractionOnOtherAccordions(transitionDuration);
  }

  _initEventHandlers() {
    this._accordionEl.addEventListener('click', this._toggle.bind(this));
  }

  _open(transitionDuration = this._config.transitionDuration.default) {
    this._expanded = { state: true, transitionDuration };
  }

  _close({
    accordionItem,
    transitionDuration = this._config.transitionDuration.default,
    blockClick,
  }) {
    this._expanded = {
      accordionItem,
      state: false,
      transitionDuration: transitionDuration,
      blockClick,
    };
  }

  _isDefaultType() {
    return (
      this._config.type !== 'one-in-group' &&
      this._config.type !== 'always-open'
    );
  }

  // prevent double clicks
  _blockClickDuringTransition(duration) {
    setTimeout(() => {
      this._isTransitioning = false;
    }, duration);
  }

  _blockInteractionOnOtherAccordions(duration) {
    let accordions = document.querySelectorAll('.accordion-group .accordion');
    let className = 'accordion--block-interaction';
    accordions.forEach((accordion) => {
      accordion !== this._accordionEl && accordion.classList.add(className);
    });

    setTimeout(() => {
      accordions.forEach((accordion) => {
        accordion !== this._accordionEl &&
          accordion.classList.remove(className);
      });
    }, duration);
  }

  // event Handler
  _toggle(e) {
    // only execute if toggleEl is clicked
    const clickedToggleEl = e.target.closest('.accordion__toggle');
    if (!clickedToggleEl || this._isTransitioning) return;

    this._isTransitioning = true;

    // cache the toggleEl & gridEl of the selected accordion__item
    if (this._currentToggleEl !== clickedToggleEl) {
      // only need prev Elements for the default accordion type
      if (this._isDefaultType) {
        this._prevToggleEl = this._currentToggleEl;
        this._prevGridEl = this._currentGridEl;
      }

      this._currentToggleEl = clickedToggleEl;
      this._currentGridEl = this._currentToggleEl
        .closest('.accordion__item')
        .querySelector('.accordion__grid');
    }

    if (this._expanded) {
      this._close({
        transitionDuration: this._config.transitionDuration.close,
      });
    } else {
      switch (this._config.type) {
        // close accordion item when another item is opened inside a group element
        // class .accordion-group is required on the group element
        case 'one-in-group':
          const accordionGroup = document.querySelector('.accordion-group');

          const toggleEl = accordionGroup.querySelector(
            '.accordion__toggle[aria-expanded=true]'
          );

          if (!toggleEl) break;

          const gridEl = accordionGroup.querySelector(
            '.accordion__grid[aria-hidden=false]'
          );

          const activeAccordionItemInGroup = {
            toggleEl,
            gridEl,
          };

          this._close({
            accordionItem: activeAccordionItemInGroup,
            blockClick: false,
          });

          break;

        // make accordion item stay open when another item is opened.
        case 'alway-open':
          break;

        // close accordion item when another item is opened.
        default:
          if (this._prevToggleEl) {
            const activeAccordionItemLocal = {
              toggleEl: this._prevToggleEl,
              gridEl: this._prevGridEl,
            };

            this._close({
              accordionItem: activeAccordionItemLocal,
              blockClick: false,
            });
          }

          break;
      }

      this._open(this._config.transitionDuration.open);
    }
  }
}

// Accordion Grid light
/*
export class Accordion {
  constructor(selector) {
    this._accordionEl = typeof selector === 'string' ? $(selector) : selector;
    this._currentToggleEl = null;
    this._currentGridEl = null;
    this._initEventHandlers();
  }
  get _expanded() {
    return this._currentToggleEl.getAttribute('aria-expanded') === 'true';
  }

  set _expanded({ previousAccordionItem = null, state }) {
    if (previousAccordionItem) {
      const { prevToggleEl, prevGridEl } = previousAccordionItem;
      prevToggleEl.setAttribute('aria-expanded', state);
      prevGridEl.setAttribute('aria-hidden', !state);
    } else {
      this._currentToggleEl.setAttribute('aria-expanded', state);
      this._currentGridEl.setAttribute('aria-hidden', !state);
    }
  }
  _initEventHandlers() {
    this._accordionEl.addEventListener('click', this._toggle.bind(this));
  }

  // event Handler
  _toggle(e) {
    const clickedToggleEl = e.target.closest('.accordion__toggle');
    // only execute if toggleEl is clicked
    if (!clickedToggleEl || this._isTransitioning) return;

    // cache current toggleEl & gridEl
    if (this._currentToggleEl !== clickedToggleEl) {
      this._currentToggleEl = clickedToggleEl;
      this._currentGridEl = this._currentToggleEl
        .closest('.accordion__item')
        .querySelector('.accordion__grid');
    }

    if (this._expanded) {
      // close accordion__item
      this._expanded = { state: false };
    } else {
      // close previous accordion__item if exist
      const prevToggleEl = document.querySelector(
        '.accordion-group .accordion__toggle[aria-expanded=true]'
      );
      if (prevToggleEl) {
        const prevGridEl = prevToggleEl
          .closest('.accordion__item')
          .querySelector('.accordion__grid');

        const previousAccordionItem = {
          prevToggleEl,
          prevGridEl,
        };

        this._expanded = {
          previousAccordionItem,
          state: false,
        };
      }

      // open accordion__item
      this._expanded = { state: true };
    }
  }
}

*/
