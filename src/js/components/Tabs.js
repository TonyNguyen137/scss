import { $, wrap } from '../utils';

export class Tabs {
  constructor(rootEl = '.tabs', options) {
    this._rootEl = typeof rootEl === 'string' ? $(rootEl) : rootEl;
    if (!this._rootEl) return;
    this._tabListEls = Array.from(this._rootEl.querySelectorAll('.tabs__list'));
    this._wrapperPanelEls = Array.from(
      this._rootEl.querySelectorAll('.tabs__wrapper-panels')
    );

    let i = this._tabListEls.length;

    while (i--) {
      this._initialiseTabList(this._tabListEls[i], i);
    }
  }

  // reset() {
  //   const FIRST_TAB_INDEX = 0;

  //   let activeTabEls = this._rootEl.querySelectorAll(
  //     '.tabs__tab[aria-selected="true"]'
  //   );

  //   activeTabEls.forEach((tab, i) => {
  //     let activeTabElIndex = this._tabListEls[i].tabEls.indexOf(tab);

  //     if (activeTabElIndex === FIRST_TAB_INDEX) return;
  //     let tabListEl = this._tabListEls[i];
  //     let firstTabEl = tabListEl.tabEls[FIRST_TAB_INDEX];

  //     this._setTab(tab, false, tabListEl);
  //     this._setTab(firstTabEl, true, tabListEl);
  //     tabListEl.currentActiveTabEl = firstTabEl;
  //   });
  // }

  _initialiseTabList(tabList, i) {
    tabList.tabEls = Array.from(tabList.querySelectorAll('.tabs__tab'));

    tabList.lastTabIndex = tabList.tabEls.length - 1;

    tabList.panelEls = Array.from(
      this._wrapperPanelEls[i].querySelectorAll('.tabs__panel')
    );

    tabList.currentActiveTabEl = tabList.querySelector("[aria-selected='true'");

    tabList.addEventListener('click', this._activeTab.bind(this));
    tabList.addEventListener('keydown', this._keypressed.bind(this));
  }

  _setTab(tab, switchOn, tabList) {
    let index = tabList.tabEls.indexOf(tab);
    tab.ariaSelected = switchOn;
    tabList.panelEls[index].ariaHidden = !switchOn;

    if (switchOn) {
      tab.removeAttribute('tabindex');
    } else {
      tab.tabIndex = '-1';
    }
  }

  _moveTab(event, direction = 0) {
    event.preventDefault();
    let tabListEl = event.currentTarget;
    let currentActiveTabEl = tabListEl.currentActiveTabEl;
    let currentActiveTabIndex = tabListEl.tabEls.indexOf(currentActiveTabEl);
    let firstTabIndex = 0;
    let lastTabIndex = tabListEl.lastTabIndex;
    let nextTabIndex = wrap(
      firstTabIndex,
      lastTabIndex,
      currentActiveTabIndex + direction
    );

    let nextTabEl = tabListEl.tabEls[nextTabIndex];

    this._setTab(currentActiveTabEl, false, tabListEl);
    this._setTab(nextTabEl, true, tabListEl);
    nextTabEl.focus();
    tabListEl.currentActiveTabEl = nextTabEl;
  }

  // Event Handler
  _keypressed(e) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        this._moveTab(e, -1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        this._moveTab(e, +1);
        break;
      default:
        return;
    }
  }

  _activeTab(e) {
    let clickedTabEl = e.target.closest('.tabs__tab');

    if (clickedTabEl === e.currentTarget.currentActiveTabEl || !clickedTabEl)
      return;

    let parentTabListEl = e.currentTarget;
    let currentActiveTabEl = parentTabListEl.currentActiveTabEl;

    this._setTab(currentActiveTabEl, false, parentTabListEl);
    this._setTab(clickedTabEl, true, parentTabListEl);

    parentTabListEl.currentActiveTabEl = clickedTabEl;
  }
}

/*

tabs light

export class tabs {
  constructor(rootEl = '.tabs') {
    this._rootEl = typeof rootEl === 'string' ? $(rootEl) : rootEl;
    this._tabListEl = this._rootEl.querySelector('.tabs__list');
    this._tabEls = Array.from(this._tabListEl.querySelectorAll('.tabs__tab'));
    this._lastTabIndex = this._tabEls.length - 1;
    this._panelEls = Array.from(
      this._rootEl.querySelectorAll('.tabs__panel')
    );

    this._currentActiveTabEl = this._tabListEl.querySelector(
      "[aria-selected='true']"
    );

    this._tabListEl.addEventListener('clicked', this._activeTab.bind(this));
    this._tabListEl.addEventListener('keydown', this._keypressed.bind(this));
  }

  _getTabIndex(tab) {
    return this._tabEls.indexOf(tab);
  }

  _setTab(tab, switchOn) {
    let index = this._getTabIndex(tab);
    tab.ariaSelected = switchOn;
    this._panelEls[index].ariaHidden = !switchOn;

    if (switchOn) {
      tab.removeAttribute('tabindex');
    } else {
      tab.tabIndex = '-1';
    }
  }

  _moveTab(event, direction = 0) {
    event.preventDefault();

    let currentActiveTabIndex = this._getTabIndex(this._currentActiveTabEl);
    let minIndex = 0;
    let maxIndex = this._lastTabIndex;

    let nextTabIndex = wrap(
      minIndex,
      maxIndex,
      currentActiveTabIndex + direction
    );

    let nextTabEl = this._tabEls[nextTabIndex];

    this._setTab(this._currentActiveTabEl, false);
    this._setTab(nextTabEl, true);
    nextTabEl.focus();
    this._currentActiveTabEl = nextTabEl;
  }

  // event handlers
  _activeTab(event) {
    if (event.target === this._currentActiveTabEl) return;
    let clickedTabEl = event.target;
    this._setTab(currentActiveTabEl, false);
    this._setTab(clickedTabEl, true);
    this._currentActiveTabEl = clickedTabEl;
  }

  _keypressed(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        this._moveTab(event, -1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        this._moveTab(event, +1);
        break;
      default:
        return;
    }
  }
}
  */
