import {
  Accordion,
  Navbar,
  NavbarOffcanvas,
  NavbarLight,
  NavOffcanvas,
} from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
import { $$ } from './utils';

let content = document.querySelector('.content');

// Capture the start time
const startTime = performance.now();

new NavOffcanvas();

const endTime = performance.now();

// Calculate the time taken to instantiate the class
const timeTaken = endTime - startTime;

// content.textContent = `miliseconds: ${timeTaken}ms`;
console.log(`instantiation took ${timeTaken} milliseconds`);
