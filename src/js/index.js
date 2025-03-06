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
import { $$, $, liveSearch } from './utils';

const st = performance.now();
let tab1 = new Tabs();

// new Dropdown();
liveSearch();
let value = 10;
// let custom = debounce((value) => {
//   console.log('value: ', value);
// });
// custom();

/* ==  */

const input = document.querySelector('.input');
const defaultText = document.getElementById('default');
const debounceText = document.getElementById('debounce');

console.log(input);

const updateDebounceText = debounce((text) => {
  console.log('text: ', text);

  debounceText.textContent = text;
});

input.addEventListener('input', (e) => {
  defaultText.textContent = e.target.value;
  updateDebounceText(e.target.value);
});

function debounce(cb, delay = 1000) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log('arg1: ', args);

      cb(...args);
    }, delay);
  };
}

/* == */

const et = performance.now();
const delta = et - st;
console.log(`instantiation took ${delta} milliseconds`);
