export class BodyScrollLocker {
  // Lock the body (disable scrolling)
  static lock(callback) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.setAttribute(
      'style',
      `padding-right: ${scrollbarWidth}px; overflow: hidden; touch-action: none;`
    );
    // document.documentElement.setAttribute('style', 'overflow: hidden;');
    if (typeof callback === 'function') callback(scrollbarWidth);
  }

  // Release the body (enable scrolling)
  static release(callback) {
    document.body.removeAttribute('style');
    // document.documentElement.removeAttribute('style');

    if (typeof callback === 'function') callback();
  }
}
