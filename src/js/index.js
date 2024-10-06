import { Accordion, Navbar, OffcanvasNavbar } from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';

let content = document.querySelector('.content');

// new Accordion('.accordion');
// new OffcanvasNavbar('.navbar');
let config = {
  modules: [Backdrop],
  fadeinTransition: 200,
  fadeoutTransition: 0,
};

let height = document.querySelector('.height');
height.addEventListener('click', () => {
  console.log('current: ', window.innerHeight);
});

// Capture the start time
const startTime = performance.now();

// Instantiate the class
const navbar = new Navbar('.navbar', config);

// Capture the end time
const endTime = performance.now();

// Calculate the time taken to instantiate the class
const timeTaken = endTime - startTime;

content.textContent = `miliseconds: ${timeTaken}ms`;
console.log(`Navbar instantiation took ${timeTaken} milliseconds`);

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
