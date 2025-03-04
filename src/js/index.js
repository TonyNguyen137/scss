import {
  Accordion,
  Navbar,
  NavbarOffcanvas,
  NavbarLight,
  NavOffcanvas,
  Tabs,
  Dropdown,
} from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
import { $$, $ } from './utils';

var accessibleTabs6 = (function () {
  'use strict';

  var d = document;
  var tabListClass;
  var onClass;
  var hoverableClass;

  var setTabsOff = function (tabList) {
    var i = tabList.tabs.length;
    while (i--) {
      setTab(tabList.tabs[i], false);
    }
  };

  var setTab = function (tab, switchOn) {
    if (tab && tab.panelId) {
      d.getElementById(tab.panelId).setAttribute('aria-hidden', !switchOn);
      tab.setAttribute('aria-selected', switchOn);
      tab.setAttribute('tabindex', switchOn ? '0' : '-1');
    }
  };

  var _activateTab = function (e) {
    var tab = e.target;
    if (e.preventDefault) {
      e.preventDefault();
      setTabsOff(tab.tabList);
      setTab(tab, true);
      d.getElementById(tab.panelId).children[0].focus();
    }
  };

  var _keypressed = function (e) {
    var tab = e.target;
    var newNo = -1;
    var tabs = tab.tabList.tabs;
    var maxNo = tabs.length - 1;

    if (e.keyCode === 37 || e.keyCode === 38) {
      // left / up arrow
      newNo = tab.no === 0 ? maxNo : tab.no - 1;
    }
    if (e.keyCode === 39 || e.keyCode === 40) {
      // right arrow / down arrow
      newNo = tab.no === maxNo ? 0 : tab.no + 1;
    }

    if (newNo > -1) {
      setTabsOff(tab.tabList);
      setTab(tabs[newNo], true);
      tabs[newNo].focus();
    }
  };

  var _tabHovered = function (e) {
    var a = e.target;
    var useHover = a.tabList.classList.contains(hoverableClass);
    if (useHover) {
      _activateTab(e);
    }
  };

  var _events = function (tab) {
    tab.addEventListener('click', _activateTab, false);
    tab.addEventListener('keydown', _keypressed, false);
    tab.addEventListener('mouseover', _tabHovered, false);
  };

  var _initialiseAriaAttributes = function (tab) {
    var tabPanel = d.getElementById(tab.panelId);

    tab.parentNode.setAttribute('role', 'presentation');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.panelId);

    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', tab.id);

    // Make first <section> object keyboard focussable
    // Preferably a heading
    // Tabindex=0 to work both forwards and backwards through the keychain
    tabPanel.children[0].setAttribute('tabindex', '0');
  };

  var _setUpConfig = function (cfg) {
    tabListClass = cfg.tabListClass || 'tl_list';
    onClass = cfg.onClass || 'ON';
    hoverableClass = cfg.hoverableClass || 'tl-hoverable';
  };

  var _setUpTab = function (tab, panelId, count) {
    tab.no = count;
    tab.id = 'tab-' + panelId;
    tab.panelId = panelId;
    _initialiseAriaAttributes(tab);
    _events(tab);
  };

  var _initialiseTabList = function (tabList) {
    var defaultTab = 0;
    var panelId;
    var tabPanel;
    var i;

    if (tabList) {
      tabList.setAttribute('role', 'tablist');
      tabList.tabs = tabList.getElementsByTagName('a');
      i = tabList.tabs.length;

      while (i--) {
        tabList.tabs[i].tabList = tabList;

        panelId = tabList.tabs[i].href.slice(
          tabList.tabs[i].href.lastIndexOf('#') + 1
        );
        tabPanel = d.getElementById(panelId);

        if (tabPanel) {
          _setUpTab(tabList.tabs[i], panelId, i);
          if (tabList.tabs[i].classList.contains(onClass)) {
            defaultTab = i;

            // onClass only used to declare intial state, so remove from DOM
            tabList.tabs[i].classList.remove(onClass);
            d.getElementById(panelId).classList.remove(onClass);
          }
        }
      }
      setTabsOff(tabList);
      if (tabList.tabs[defaultTab] && tabList.tabs[defaultTab].panelId) {
        setTab(tabList.tabs[defaultTab], true);
      }
    }
  };

  var _isMustardCut = function (e) {
    // check browser feature support (IE10+)
    return (
      typeof d.querySelectorAll === 'function' &&
      d.addEventListener &&
      !!d.documentElement.classList // IE10+
    );
  };

  var init = function (cfg) {
    var tabLists;
    var i;

    if (_isMustardCut()) {
      _setUpConfig(cfg);
      tabLists = d.getElementsByClassName(tabListClass);
      i = tabLists.length;
      while (i--) {
        _initialiseTabList(tabLists[i]);
      }
    }
  };

  return {
    init: init,
  };
})();

accessibleTabs6.init({
  tabListClass: 'tl_list', // default, may omit
  onClass: 'ON', // default, may omit
  hoverableClass: 'tl-hoverable', // default, may omit
});

const st = performance.now();
let tab1 = new Tabs();
let reset = $('.reset');
reset.addEventListener('click', () => {
  tab1.reset();
});
// new Dropdown();

const et = performance.now();
// Calculate the time taken to instantiate the class
const delta = et - st;

console.log(`custom instantiation took ${delta} milliseconds`);
