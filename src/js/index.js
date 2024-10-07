import { Accordion, Navbar, OffcanvasNavbar } from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
import { $$ } from './utils';

let content = document.querySelector('.content');

$$('.accordion').forEach((accordion) => {
  new Accordion(accordion, {});
});

// new Accordion('.accordion');
// new OffcanvasNavbar('.navbar');
let config = {
  modules: [Backdrop],
  transitionDuration: 0,
  isFullHeight: true,
};

// let height = document.querySelector('.height');
// height.addEventListener('click', () => {
//   console.log('current: ', window.innerHeight);
// });

// Capture the start time
const startTime = performance.now();

// Instantiate the class
// const navbar = new Navbar('.navbar', config);

// Capture the end time
const endTime = performance.now();

// Calculate the time taken to instantiate the class
const timeTaken = endTime - startTime;

// content.textContent = `miliseconds: ${timeTaken}ms`;
// console.log(`Navbar instantiation took ${timeTaken} milliseconds`);

// class Click {
//   constructor(selector) {
//     this.btn = document.querySelector(selector);
//     this.btn.addEventListener('click', this._toggle);
//     console.log('hello');
//   }

//   _toggle() {
//     console.log('toggled');
//   }
// }

// // let button = document.querySelector('.navbar__toggle');

// let button = new Click('.navbar__toggle');

// button = null;
