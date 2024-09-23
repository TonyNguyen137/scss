export class Backdrop {
    static targetElement = null;
    static element = null;
    static transDur = null;
    static insertTo(element, {transDur = 300, opacity = 0.5, z = 2} = {}) {
        Backdrop.targtElelement = element;
        Backdrop.element = document.createElement("div");
        Backdrop.element.classList.add("backdrop", "fade");
        Backdrop.transDur = transDur;
        Backdrop.element.setAttribute("style", `--z: ${z}; --opacity: ${opacity}; --transDur: ${Backdrop.transDur}ms`)
        Backdrop.targtElelement.append(Backdrop.element);
        setTimeout(_=> {
            Backdrop.element.classList.add("show");
        })
    }


    // fadeout and then remove
    static remove() {
        Backdrop.element.classList.remove("show");
        setTimeout(_=> {
            Backdrop.element.remove();
        }, Backdrop.transDur)

    }
    // remove immediately
    static kill() {
        if(Backdrop.element) {
            Backdrop.element.remove();
        }
    }
}