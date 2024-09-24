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

// sets and removes multiple attributes at once
export function setAttributesTo(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function removeAttributesFrom(element, ...attributes) {
  attributes.forEach((attribute) => {
    element.removeAttribute(attribute);
  });
}

export function validatePropertiesOf(config, ...properties) {
  if (Object.keys(config).length === 0) return;

  let validProperties = new Set(properties);

  // Check for any invalid properties in the config object
  for (const key in config) {
    if (!validProperties.has(key)) {
      throw new Error(`Invalid configuration property: '${key}'.`);
    }
  }
}

export class Util {
  static $() {
    return document.querySelector(selector);
  }

  static $$() {
    return document.querySelectorAll(selector);
  }

  static select() {
    let element = document.querySelectorAll(selector);

    if (element.length > 1) {
      return element;
    } else {
      return element[0];
    }
  }

  static toArray(arrayLikeEl) {
    return Array.from(arrayLikeEl);
  }
}
