export class BodyLocker {

    // Lock the body (disable scrolling)
    static lock() {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.setAttribute("style", `padding-right: ${scrollbarWidth}px; overflow: hidden;`);
    }

    // Release the body (enable scrolling)
    static release() {
        document.body.removeAttribute("style");
    }
}