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
import { Utils } from './utils';

const st = performance.now();
let tab1 = new Tabs();

/* == */

const et = performance.now();
const delta = et - st;
console.log(`instantiation took ${delta} milliseconds`);
