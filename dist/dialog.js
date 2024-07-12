var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, CloseStack, Bus, ViewRouterLocationChanged, makeAndActivate } from "@derekpitt/fw";
import { hideElement, focusElement } from "./helpers.js";
const classes = {
    wrapper: "fw-dialog-wrapper",
    container: "fw-dialog",
    bodyOpen: "fw-dialog-open",
    open: "open",
};
const defaultOptions = {
    closeOnClick: false,
    ariaLabel: "Dialog",
};
let DialogService = class DialogService {
    closeStack;
    bus;
    opened = [];
    constructor(closeStack, bus) {
        this.closeStack = closeStack;
        this.bus = bus;
        this.bus.subscribe(ViewRouterLocationChanged, () => {
            this.opened.reverse().forEach(p => p());
            this.opened = [];
        });
    }
    async open(view, data, opts, originatingEvent) {
        const options = Object.assign({}, defaultOptions, opts);
        const dialogElement = document.createElement("div");
        dialogElement.classList.add(classes.wrapper);
        dialogElement.setAttribute("role", "dialog");
        dialogElement.setAttribute("aria-modal", "true");
        dialogElement.setAttribute("aria-label", options.ariaLabel);
        if (options.cssClass)
            dialogElement.classList.add(options.cssClass);
        const containerElement = document.createElement("div");
        containerElement.classList.add(classes.container);
        containerElement.appendChild(document.createElement("div"));
        const getViewElement = () => containerElement.children[0];
        const tabLoopStart = document.createElement("button");
        const tabLooperOnFocus = () => focusElement(getViewElement());
        tabLoopStart.addEventListener("focus", tabLooperOnFocus);
        const tabLoopEnd = document.createElement("button");
        tabLoopEnd.addEventListener("focus", tabLooperOnFocus);
        hideElement(tabLoopStart);
        hideElement(tabLoopEnd);
        tabLoopStart.setAttribute("aria-label", "Begin Dialog");
        tabLoopEnd.setAttribute("aria-label", "End Dialog");
        dialogElement.appendChild(tabLoopStart);
        dialogElement.appendChild(containerElement);
        dialogElement.appendChild(tabLoopEnd);
        document.body.appendChild(dialogElement);
        let resolver = null;
        const returnPromise = new Promise((res) => resolver = res);
        const controller = new DialogController(resolver);
        await makeAndActivate(view, getViewElement(), data, o => o.use(DialogController, controller));
        document.body.classList.add(classes.bodyOpen);
        document.documentElement.classList.add(classes.bodyOpen);
        setTimeout(() => {
            containerElement.classList.add(classes.open);
            dialogElement.classList.add(classes.open);
        }, 100);
        const closer = this.closeStack.enroll(() => resolver({ canceled: true }));
        this.opened.push(() => closer.close());
        const stop = (e) => {
            e.stopPropagation();
            closer.closeAbove();
        };
        // setup key listener for ESC; and call cancel or close or something on the controller...
        const close = (e) => {
            resolver({ canceled: true, result: null });
            stop(e);
            if (originatingEvent) {
                // Set focus to the initial dom that trigger the popup
                focusElement(originatingEvent.target);
            }
        };
        if (options.closeOnClick) {
            dialogElement.addEventListener("click", close);
        }
        containerElement.addEventListener("click", stop);
        const res = await returnPromise;
        closer.close();
        // animate out??
        containerElement.classList.remove(classes.open);
        dialogElement.classList.remove(classes.open);
        // remove after a bit.. preferably when all animations are done...
        setTimeout(() => {
            containerElement.removeEventListener("click", stop);
            containerElement.remove();
            if (options.closeOnClick) {
                dialogElement.removeEventListener("click", close);
            }
            tabLoopStart.removeEventListener("focus", tabLooperOnFocus);
            tabLoopEnd.removeEventListener("focus", tabLooperOnFocus);
            dialogElement.remove();
            document.body.classList.remove(classes.bodyOpen);
            document.documentElement.classList.remove(classes.bodyOpen);
            if (originatingEvent) {
                // Set focus to the initial dom that trigger the popup
                focusElement(originatingEvent.target);
            }
        }, 600);
        return res;
    }
};
DialogService = __decorate([
    inject,
    __metadata("design:paramtypes", [CloseStack, Bus])
], DialogService);
export { DialogService };
export class DialogController {
    resolver;
    constructor(resolver) {
        this.resolver = resolver;
    }
    close(canceled = false, result) {
        this.resolver({ canceled, result });
    }
    cancel() {
        this.close(true);
    }
    ok(result) {
        this.close(false, result);
    }
}
//# sourceMappingURL=dialog.js.map