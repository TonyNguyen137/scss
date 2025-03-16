export const breakPoints = {
  xs: '0',
  sm: '36rem', // 576px
  md: '48rem', // 768ox
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
  xxl: '87.5rem', // 1400px
};

/**
 * A utility class providing helper methods.
 */

export class Utils {
  /**
   * Selects the first element within the document (or a specified scope) that matches the given CSS selector.
   *
   * @param {string} selector - A CSS selector string used to select the element.
   * @param {HTMLElement} [scope=document] - The element or document to search within. Defaults to `document`.
   * @returns {HTMLElement|null} - The first matching element, or `null` if no match is found.
   *
   * @example
   * Select an element with the class "example" within the entire document
   *
   * const element = Utilities.$('.example');
   *
   * @example
   * Select an element with the ID "myElement" within a specific container
   *
   * const container = document.getElementById('container');
   * const element = Utilities.$('#myElement', container);
   */

  static $(selector, scope = document) {
    return scope.querySelector(selector);
  }

  // sets and removes multiple attributes of an Element
  static setAttributesTo(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  static removeAttributesFrom(element, ...attributes) {
    attributes.forEach((attribute) => {
      element.removeAttribute(attribute);
    });
  }

  /**
   * Returns the next number in a range after the given index, wrapping around if necessary.
   * Inspired by GSAP's wrap() function.
   * @see {@link https://gsap.com/docs/v3/GSAP/UtilityMethods/wrap()/ GSAP wrap() Documentation}
   *
   * @param {number | Array} min - The minimum value of the range (inclusive) or an array of values to wrap within.
   * @param {number} max - The maximum value of the range (inclusive). If `min` is an array, this parameter is treated as the index.
   * @param {number} index -  The index or position in the range. If `min` is an array, this parameter is ignored.
   * @returns {number | * } -  If `min` is a number, returns a number within the range. If `min` is an array, returns an element from the array
   *
   * @example
   * Wrap around within a range of 1 to 3
   *
   * Utilities.wrap(1, 3, 0); // Returns 1
   * Utilities.wrap(1, 3, 1); // Returns 2
   * Utilities.wrap(1, 3, 2); // Returns 3
   * Utilities.wrap(1, 3, 3); // Returns 1
   *
   * @example
   * Wrap within an array
   *
   * const arr = ["a", "b", "c"];
   * Utilities.wrap(arr, 0); // Returns "a"
   * Utilities.wrap(arr, 1); // Returns "b"
   * Utilities.wrap(arr, 2); // Returns "c"
   * Utilities.wrap(arr, 3); // Returns "a" (wraps around)
   */

  static wrap(min, max, index) {
    // Handle array input
    if (Array.isArray(min)) {
      return this.wrapArray(min, max);
    }

    // Handle numeric range input
    return this.wrapRange(min, max, index);
  }

  /**
   * Returns the value from the array at the given index, wrapping around if the index exceeds the array length.
   *
   * @param {Array} arr - The array to retrieve the value from.
   * @param {number} index - The index to access, which wraps around if out of bounds.
   * @returns {*} - The value from the array at the wrapped index.
   */

  static wrapArray(arr, index) {
    const length = arr.length;
    return arr[((index % length) + length) % length];
  }

  /**
   * Wraps a value within a numeric range, ensuring it stays within bounds.
   * @param {number} min - The minimum value of the range (inclusive).
   * @param {number} max - The maximum value of the range (inclusive).
   * @param {number} value - The value to wrap.
   * @returns {number} - The wrapped value within the range.
   */
  static wrapRange(min, max, value) {
    const range = max - min + 1;
    return ((((value - min) % range) + range) % range) + min;
  }

  static debounce(cb, delay = 1000) {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  /**
   * Converts a NodeList into an array of elements.
   *
   * @param {string | NodeList } selector -  A CSS selector string or NodeList,
   * @param {Document | HTMLElement} [parent=document] - The parent element to query within. Defaults to `document`.
   * @returns {Array | false}
   */
  static toArray(selector, scope = document) {
    if (typeof selector === 'string') {
      const elements = Array.from(scope.querySelectorAll(selector));
      return elements.length ? elements : false;
    }

    return Array.from(selector);
  }
}

export function CSSsupports(property, value) {
  const element = document.createElement('div');
  element.style[property] = value;
  return element.style[property] === 'fixed';
}

export function isIosDevice() {
  return (
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    (/iP(ad|hone|od)/.test(window.navigator.platform) ||
      (window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1))
  );
}

export function rangeWrapper(min, max) {
  return function (value) {
    return (
      ((((value - min) % (max - min + 1)) + (max - min + 1)) %
        (max - min + 1)) +
      min
    );
  };
}
export function toggleTheme(
  selector = '.switch__input',
  options = { onTrue: 'dark' }
) {
  let input = document.querySelector(selector);
  let theme = options.onTrue;

  input.addEventListener('change', (e) => {
    let isChecked = e.target.checked;

    if (isChecked) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });
}
