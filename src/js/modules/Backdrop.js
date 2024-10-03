export class Backdrop {
  static targetElement = null;
  static element = null;
  static config = null;

  static insertTo(element, config = {}) {
    Backdrop.targetElement = element;
    Backdrop.element = document.createElement('div');
    Backdrop.element.classList.add('backdrop', 'fade');
    Backdrop.config = {
      transitionDuration: config.transitionDuration || null,
      backgroundColor: config.backgroundColor || null,
      opacity: config.opacity || null,
      z: config.z || null,
    };

    for (let key in Backdrop.config) {
      Backdrop.config[key] &&
        Backdrop.element.setAttribute(
          'style',
          `--${key}: ${Backdrop.config[key]}${
            key === 'transitionDuration' ? 'ms' : ''
          };`
        );

      // Backdrop.element.setAttribute(
      //     'style',
      //     `--z: ${z}; --opacity: ${opacity}; --backgroundColor: ${backgroundColor}, --transDur: ${Backdrop.transDur}ms`
      //   );
    }

    Backdrop.targetElement.append(Backdrop.element);
    setTimeout((_) => {
      Backdrop.element.classList.add('show');
    });
  }

  // fadeout and then remove
  static remove() {
    Backdrop.element.classList.remove('show');
    setTimeout((_) => {
      Backdrop.element.remove();
    }, Backdrop.config.transitionDuration);
  }
  // remove immediately
  static kill() {
    if (Backdrop.element) {
      Backdrop.element.remove();
    }
  }
}
