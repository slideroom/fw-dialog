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
  closeOnClick: boolean;
}

const defaultOptions: OpenOptions = {
  closeOnClick: false,
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
    dialogElement.setAttribute("role", "dialog");
    if (options.cssClass)
      dialogElement.classList.add(options.cssClass);

    const containerElement = document.createElement("div");
    containerElement.classList.add(classes.container);
    containerElement.appendChild(document.createElement("div"));

    const getViewElement = (): HTMLElement => containerElement.children[0] as HTMLElement;

    const tabLooper = document.createElement("button");
    const tabLooperOnFocus = () => focusElement(getViewElement());
    tabLooper.addEventListener("focus", tabLooperOnFocus);

    const tabLooper2 = document.createElement("button");
    tabLooper2.addEventListener("focus", tabLooperOnFocus);

    hideElement(tabLooper);
    hideElement(tabLooper2);
    tabLooper.setAttribute("aria-hidden", "true");
    tabLooper2.setAttribute("aria-hidden", "true");

    dialogElement.appendChild(tabLooper);
    dialogElement.appendChild(containerElement);
    dialogElement.appendChild(tabLooper2);

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

      tabLooper.removeEventListener("focus", tabLooperOnFocus);
      tabLooper2.removeEventListener("focus", tabLooperOnFocus);

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
