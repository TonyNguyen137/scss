export const breakPoints = {
  xs: '0',
  sm: '36rem', // 576px
  md: '48rem', // 768ox
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
  xxl: '87.5rem', // 1400px
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

// sets and removes multiple attributes of an Element
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

export function validatePropertiesOf(config, ...allowedProperties) {
  if (typeof config !== 'object' || config === null) {
    throw new Error(
      `Invalid argument: ${config}. The argument passed must be an object.`
    );
  }
  if (Object.keys(config).length === 0) return;

  let validProperties = new Set(allowedProperties);

  // Check for any invalid properties in the config object
  for (const key in config) {
    if (!validProperties.has(key)) {
      throw new Error(`Invalid property: '${key}'.`);
    }
  }
}

export function validatePropertiesOf2(config, rule) {
  // Iterate through each key in the rule object
  for (let key in rule) {
    // Check if the config object has the key
    if (!config.hasOwnProperty(key)) {
      console.warn(`Missing property: ${key}`);
      continue;
    }

    const value = config[key];
    const ruleValue = rule[key];

    // If rule is an array, we assume it defines the allowed values
    if (Array.isArray(ruleValue)) {
      if (!ruleValue.includes(value)) {
        console.warn(
          `Invalid value for ${key}. Expected one of ${ruleValue}, defaulting to '${ruleValue[0]}'.`
        );
        config[key] = ruleValue[0]; // Set to default value
      }
    }
    // If rule is a function, it defines the type (e.g., String, Number)
    else if (typeof ruleValue === 'function') {
      if (!(value instanceof ruleValue)) {
        console.warn(
          `Invalid type for ${key}. Expected ${
            ruleValue.name
          }, defaulting to '${ruleValue()}'`
        );
        config[key] = ruleValue(); // Set to a default of the expected type
      }
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

export function toArray(nodeList) {
  if (typeof nodeList === 'string') {
    return Array.from(document.querySelectorAll(nodeList));
  }
  return Array.from(nodeList);
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

// inspired by GSAP.wrap()
// wrapping a number within a given range
export function wrap(min, max, value) {
  return (
    ((((value - min) % (max - min + 1)) + (max - min + 1)) % (max - min + 1)) +
    min
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
