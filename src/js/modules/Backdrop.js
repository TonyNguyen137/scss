export class Backdrop {
  static targetElement = null;
  static element = null;
  static config = null;

  static init(config = {}) {
    Backdrop.targetElement = config.insertBackdropTo || document.body;
    Backdrop.element = document.createElement('div');
    Backdrop.element.classList.add('backdrop', 'backdrop--fade');
    Backdrop.config = {
      transitionDuration: config.fadeinTransition ?? config.transitionDuration,
    };

    for (let key in Backdrop.config) {
      Backdrop.config[key] !== undefined &&
        Backdrop.config[key] !== null &&
        Backdrop.element.style.setProperty(
          `--${key}`,
          `${Backdrop.config[key]}${key === 'transitionDuration' ? 'ms' : ''}`
        );
    }

    Backdrop.targetElement.append(Backdrop.element);

    // this code makes that transition possible
    setTimeout((_) => {
      Backdrop.element.classList.add('backdrop--show');
    }, 5);
  }

  // fadeout and then remove
  static kill({ fadeoutTransition = Backdrop.config.transitionDuration }) {
    if (!Backdrop.element) return;
    Backdrop.element.style.setProperty(
      '--transitionDuration',
      fadeoutTransition + 'ms'
    );
    Backdrop.element.classList.remove('backdrop--show');
    setTimeout((_) => {
      Backdrop.element.remove();
    }, fadeoutTransition);
  }
}
