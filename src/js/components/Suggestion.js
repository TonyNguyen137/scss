import { Utils } from '../utils';

const DELAY = 500;
const API =
  'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

export class Suggestion {
  constructor(rootElSelector = '.suggestion') {
    this._rootEls = Utils.$$(rootElSelector);
    let i = this._rootEls.length;
    while (i--) {
      this._initRootEl(this._rootEls[i]);
    }
  }

  _initRootEl(rootEl) {
    rootEl.inputEl = Utils.$('.suggestion__input', rootEl);
    rootEl.listEl = Utils.$('.suggestion__list', rootEl);

    const debouncedSuggest = Utils.debounce(this._suggest.bind(this), DELAY);

    rootEl.inputEl.addEventListener('input', debouncedSuggest.bind(this));
    // rootEl.inputEl.addEventListener('change', (e) => {
    //   setTimeout(() => {
    //     this._emptyList();
    //   }, 100);
    // });
    rootEl.listEl.addEventListener('click', this._selectSuggestion.bind(this));
  }

  // event Handlers

  _suggest(e) {
    fetch(API)
      .then((data) => data.json())
      .then((jsonData) => {
        this._render(jsonData, e);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  _render(data, e) {
    let listEl = e.target.parentNode.listEl;
    if (listEl.hasChildNodes()) this._emptyList(listEl);
    const matchArray = this._findMatches(e.target.value, data);
    const documentFragment = document.createDocumentFragment();

    const regex = new RegExp(e.target.value, 'gi');

    for (let i = 0; i < matchArray.length; i++) {
      const listItemEl = document.createElement('li');

      const cityName = matchArray[i].city.replace(
        regex,
        `<strong>${e.target.value}</strong>`
      );
      const stateName = matchArray[i].state.replace(
        regex,
        `<strong>${e.target.value}</strong>`
      );

      listItemEl.innerHTML = `${cityName}, ${stateName}`;
      documentFragment.append(listItemEl);
    }
    listEl.append(documentFragment);
  }

  _findMatches(wordToMatch, data) {
    if (wordToMatch === '') return [];
    const regex = new RegExp(wordToMatch, 'gi');

    return data.filter((place) => {
      return place.city.match(regex) || place.state.match(regex);
    });
  }

  _emptyList(listEl) {
    if (!listEl) {
      this._rootEls.forEach((rootEl) => {
        rootEl.listEl.innerHTML = '';
      });
    } else {
      listEl.innerHTML = '';
    }
  }

  _selectSuggestion(e) {
    console.log('clicked');

    const listEl = e.target.closest('ul');
    const inputEl = listEl.previousElementSibling;
    inputEl.value = e.target.textContent;
    this._emptyList(listEl);
  }
}
