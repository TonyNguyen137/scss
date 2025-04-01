import {
  Accordion,
  Navbar,
  NavbarOffcanvas,
  NavbarLight,
  NavOffcanvas,
  Tabs,
  Dropdown,
  Suggestion,
} from './components';
import { Backdrop, BodyScrollLocker, ScrollLocker } from './modules';
import { Utils } from './utils';

const st = performance.now();
let tab1 = new Tabs();

new Suggestion();

const et = performance.now();
const delta = et - st;
console.log(`instantiation took ${delta} milliseconds`);
