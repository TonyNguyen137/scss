import {
  Accordion,
  Navbar,
  NavbarOffcanvas,
  NavbarLight,
  NavOffcanvas,
  Tabbar,
} from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
import { $$ } from './utils';

console.log(`instantiation took ${timeTaken} milliseconds`);

const st = performance.now();
let tab1 = new Tabbar();

const et = performance.now();
// Calculate the time taken to instantiate the class
const delta = et - st;

// content.textContent = `miliseconds: ${timeTaken}ms`;
console.log(`custom instantiation took ${delta} milliseconds`);
