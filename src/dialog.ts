import { inject, ContainerInstance, ViewEngine, View, CloseStack, Bus, ViewRouterLocationChanged } from "fw";
import { makerOf, DialogResult } from "./types";

const classes = {
  wrapper: "fw-dialog-wrapper",
  container: "fw-dialog",
  bodyOpen: "fw-dialog-open",
  open: "open",
};

@inject
export class DialogService {
  private opened: Array<() => void> = [];

  constructor(private closeStack: CloseStack, private bus: Bus) {
    this.bus.subscribe(ViewRouterLocationChanged, () => {
      this.opened.reverse().forEach(p => p());
      this.opened = [];
    });
  }

  public async open<TResult>(view: makerOf<any>, data?: any, cssClass?: string): Promise<DialogResult<TResult>> {
    const ve = new ViewEngine(ContainerInstance);

    const dialogElement = document.createElement("div");
    dialogElement.classList.add(classes.wrapper);
    dialogElement.classList.add(cssClass);
    document.body.appendChild(dialogElement);

    const containerElement = document.createElement("div");
    containerElement.classList.add(classes.container);
    containerElement.appendChild(document.createElement("div"));
    dialogElement.appendChild(containerElement);

    let resolver = null;
    const returnPromise = new Promise<DialogResult<TResult>>((res) => resolver = res);
    const controller = new DialogController<TResult>(resolver);
    const v = ve.loadView(view, data, (o) => {
      o.use(DialogController, controller);
    });

    document.body.classList.add(classes.bodyOpen);
    document.documentElement.classList.add(classes.bodyOpen);

    v.renderTo(containerElement.children[0] as HTMLElement);
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

    dialogElement.addEventListener("click", close);
    containerElement.addEventListener("click", stop);

    await v.activate();

    const res = await returnPromise;

    closer.close();

    // animate out??
    containerElement.classList.remove(classes.open);
    dialogElement.classList.remove(classes.open);

    // remove after a bit.. preferabbly when all animations are done...
    setTimeout(() => {
      v.remove();
      containerElement.removeEventListener("click", stop);
      containerElement.remove();
      dialogElement.removeEventListener("click", close);
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
