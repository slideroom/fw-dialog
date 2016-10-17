import { ContainerInstance, ViewEngine, View } from "fw";

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

export class DialogService {
  public async open<TResult>(view: makerOf<any>, data?: any): Promise<DialogResult<TResult>> {
    const ve = new ViewEngine(ContainerInstance);

    const dialogElement = document.createElement("div");
    dialogElement.classList.add(classes.wrapper);
    document.body.appendChild(dialogElement);

    const containerElement = document.createElement("div");
    containerElement.classList.add(classes.container);
    dialogElement.appendChild(containerElement);

    let resolver = null;
    const returnPromise = new Promise<DialogResult<TResult>>((res) => resolver = res);
    const controller = new DialogController<TResult>(resolver);
    const v = ve.loadView(view, data, (o) => {
      o.use(DialogController, controller);
    });

    document.body.classList.add(classes.bodyOpen);
    document.documentElement.classList.add(classes.bodyOpen);

    v.renderTo(containerElement);
    setTimeout(() => {
      containerElement.classList.add(classes.open);
      dialogElement.classList.add(classes.open);
    }, 100);

    const prevent = (e: Event) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    };

    // setup key listener for ESC; and call cancel or close or something on the controller...
    const close = (e: Event) => {
      resolver({ canceled: true, result: null });
      prevent(e);
    };

    const escHandler = (e: KeyboardEvent) => {
      if (e.keyCode == 27) {
        close(e);
      }
    };

    dialogElement.addEventListener("click", close);
    containerElement.addEventListener("click", prevent);

    document.addEventListener("keydown", escHandler);
    await v.activate();

    const res = await returnPromise;

    // animate out??
    containerElement.classList.remove(classes.open);
    dialogElement.classList.remove(classes.open);

    // remove after a bit.. preferabbly when all animations are done...
    setTimeout(() => {
      v.remove();
      containerElement.removeEventListener("click", prevent);
      containerElement.remove();
      dialogElement.removeEventListener("click", close);
      dialogElement.remove();
      document.removeEventListener("keydown", escHandler);

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
