import { Utils } from '../utils';

export class Dropdown {
  constructor(dropdownEl = '.dropdown') {
    document.addEventListener('click', (e) => {
      const isDropdownButton = e.target.matches('.dropdown__toggle');

      console.log(isDropdownButton);
      console.log(e.target.closest('.dropdown'));

      console.log(
        'condition ',
        !isDropdownButton && e.target.closest('.dropdown') != null
      );

      if (!isDropdownButton && e.target.closest('.dropdown') != null) return;
      console.log('passed');

      let currentDropdown;
      if (isDropdownButton) {
        currentDropdown = e.target.closest('.dropdown');
        currentDropdown.classList.toggle('active');
      }

      // will not execute if node list is empty
      document.querySelectorAll('.dropdown.active').forEach((dropdown) => {
        if (dropdown === currentDropdown) return;
        dropdown.classList.remove('active');
      });
    });
  }
}
