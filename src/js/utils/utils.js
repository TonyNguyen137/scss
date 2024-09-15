export const breakPoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

// selectors
export function $(selector) {
  return document.querySelector(selector);
}
export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function select(selector) {
  let element = document.querySelectorAll(selector);

  if (element.length > 1) {
    return element;
  } else {
    return element[0];
  }
}

// sets multiple attributes
export function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}
