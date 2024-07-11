export const hideElement = (el) => {
    el.style.cssText = `border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;`;
};
export const focusElement = (el) => {
    if (el.getAttribute("tabindex") != null) {
        el.removeAttribute("tabindex");
    }
    switch (el.tagName) {
        case "A":
        case "BUTTON":
        case "INPUT":
        case "SELECT":
        case "TEXTAREA":
            el.setAttribute("tabindex", "0");
            break;
        default:
            el.setAttribute("tabindex", "-1");
    }
    el.focus();
};
//# sourceMappingURL=helpers.js.map