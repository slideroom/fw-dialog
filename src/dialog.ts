import { inject, ContainerInstance, CloseStack, Bus, ViewRouterLocationChanged, makeAndActivate } from "@derekpitt/fw";
import { hideElement, focusElement } from "./helpers";

export interface makerOf<T> {
  new(...args): T;
}

export interface DialogResult<T> {
  canceled: boolean;
  result: T;
}

const classes = {
  wrapper: "fw-dialog-wrapper",
  container: "fw-dialog",
  bodyOpen: "fw-dialog-open",
  open: "open",
};

export type OpenOptions = {
  cssClass?: string;
  closeOnClick?: boolean;
  ariaLabel?: string;
}

const defaultOptions: OpenOptions = {
  closeOnClick: false,
  ariaLabel: "Dialog",
}

@inject
export class DialogService {
  private opened: Array<() => void> = [];

  constructor(private closeStack: CloseStack, private bus: Bus) {
    this.bus.subscribe(ViewRouterLocationChanged, () => {
      this.opened.reverse().forEach(p => p());
      this.opened = [];
    });
  }

  public async open<TResult>(view: makerOf<any>, data?: any, opts?: OpenOptions): Promise<DialogResult<TResult>> {
    const options = Object.assign({}, defaultOptions, opts);

    const dialogElement = document.createElement("div");
    dialogElement.classList.add(classes.wrapper);
    dialogElement.setAttribute("aria-labelledby", "modal-title");
    dialogElement.setAttribute("aria-describedby", "modal-content")
    dialogElement.setAttribute("role", "dialog");
    dialogElement.setAttribute("aria-modal", "true");
    dialogElement.setAttribute("aria-label", options.ariaLabel);
    if (options.cssClass)
      dialogElement.classList.add(options.cssClass);

    const containerElement = document.createElement("div");
    containerElement.classList.add(classes.container);
    containerElement.appendChild(document.createElement("div"));

    const getViewElement = (): HTMLElement => containerElement.children[0] as HTMLElement;

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
    const returnPromise = new Promise<DialogResult<TResult>>((res) => resolver = res);
    const controller = new DialogController<TResult>(resolver);
    await makeAndActivate(view, getViewElement(), data, o => o.use(DialogController, controller));

    document.body.classList.add(classes.bodyOpen);
    document.documentElement.classList.add(classes.bodyOpen);

    setTimeout(() => {
      containerElement.classList.add(classes.open);
      dialogElement.classList.add(classes.open);
    }, 100);

    const closer = this.closeStack.enroll(() => resolver({ canceled: true }));

    this.opened.push(() => closer.close());

    const stop = (e: Event) => {
      e.stopPropagation();
      closer.closeAbove();
    };

    // setup key listener for ESC; and call cancel or close or something on the controller...
    const close = (e: Event) => {
      resolver({ canceled: true, result: null });
      stop(e);
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

    // remove after a bit.. preferabbly when all animations are done...
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
    }, 600);

    return res;
  }
}

export class DialogController<T> {
  constructor(private resolver: (result: DialogResult<T>) => void) { }

  close(canceled = false, result?: T) {
    this.resolver({ canceled, result });
  }

  cancel() {
    this.close(true);
  }

  ok(result: T) {
    this.close(false, result);
  }
}
