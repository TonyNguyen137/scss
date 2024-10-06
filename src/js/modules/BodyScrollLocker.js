import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export class ScrollLocker {
  static scrollTop;
  static element;
  // Lock the body (disable scrolling)
  static init({
    callback = null,
    adjustPadding = true,
    element = document.querySelector('.main'),
  }) {
    ScrollLocker.element = element;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (adjustPadding) {
      ScrollLocker.element.setAttribute(
        'style',
        `padding-right: ${scrollbarWidth}px;`
      );
    }

    ScrollLocker.scrollTop = window.scrollY;

    document.documentElement.dataset.modalActive = true;
    ScrollLocker.element.classList.add('is-locked');
    document.documentElement.classList.add('scroll-behavior-auto');

    ScrollLocker.element.scroll(0, ScrollLocker.scrollTop);

    if (typeof callback === 'function') callback(scrollbarWidth);
  }

  // Release the body (enable scrolling)
  static kill({ callback = null }) {
    if (ScrollLocker.element) {
      ScrollLocker.element.classList.remove('is-locked');
      document.documentElement.classList.remove('is-locked');
      document.documentElement.removeAttribute('data-modal-active');

      window.scrollTo(0, ScrollLocker.scrollTop);

      if (typeof callback === 'function') callback();
      setTimeout(() => {
        document.documentElement.classList.remove('scroll-behavior-auto');
      });
    }
  }
}

export class BodyScrollLocker {
  // Lock the body (disable scrolling)

  static init({ callback = null }) {
    disableBodyScroll(document.body, {
      reserveScrollBarGap: true,
    });
    if (typeof callback === 'function') callback(scrollbarWidth);
  }

  // Release the body (enable scrolling)
  static kill({ callback = null }) {
    enableBodyScroll(document.body);
    if (typeof callback === 'function') callback(scrollbarWidth);
  }
}
