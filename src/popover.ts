import {
  inject,
  ContainerInstance,
  ViewEngine,
  View,
  Bus,
  ViewRouterLocationChanged,
  CloseStack,
} from "fw";
import { makerOf, DialogResult } from "./types";

import offset from "document-offset";

@inject
export class PopoverCoordinator {
  private openPosition: { x: number; y: number; fixed: boolean } = {
    x: 0,
    y: 0,
    fixed: false,
  };
  private opened = [];

  private openAwaiters = [];
  private closeAwaiters = [];

  constructor(private bus: Bus) {
    this.bus.subscribe(ViewRouterLocationChanged, this.closeAll.bind(this));
  }

  public openAt(x: number, y: number, fixed = false) {
    this.openPosition = { x, y, fixed };
    console.log(this.openPosition);
  }

  public openAtElement(element: any, fixed = false) {
    const { offsetHeight } = element;

    const { left, top } = offset(element);

    let y = top + offsetHeight;
    if (fixed) {
      y -= window.scrollY;
    }

    this.openAt(left, y, fixed);
  }

  public getPosition(
    popoverWidth: number,
    popoverHeight: number,
  ): { x: number; y: number; fixed: boolean } {
    const {
      innerWidth: viewPortWidth,
      innerHeight: viewPortHeight,
      scrollY,
    } = window;

    let { x, y, fixed } = this.openPosition;

    if (x + popoverWidth > viewPortWidth) {
      x = viewPortWidth - popoverWidth - 20;
    } else {
      x = Math.max(x, 20);
    }

    if (y + popoverHeight > viewPortHeight + scrollY) {
      y = viewPortHeight - popoverHeight - 20 + scrollY;
    }

    return { x, y, fixed };
  }

  public closeAll() {
    this.opened.forEach(p => p({ canceled: true, result: null }));
    this.opened = [];

    this.closeAllAwaiters();
  }

  public closeAllAwaiters() {
    this.closeAwaiters.forEach(p => p());
    this.closeAwaiters = [];
  }

  public push(resolver) {
    this.opened.push(resolver);

    this.openAwaiters.forEach(p => p());
    this.openAwaiters = [];
  }

  public waitForOpen() {
    return new Promise(res => {
      this.openAwaiters.push(res);
    });
  }

  public waitForClose() {
    return new Promise(res => {
      this.closeAwaiters.push(res);
    });
  }
}

const classes = {
  wrapper: "fw-popover-wrapper",
  container: "fw-popover",
  open: "open",
};

@inject
export class PopoverService {
  constructor(
    private coordinator: PopoverCoordinator,
    private closeStack: CloseStack,
  ) {}

  public async open<TResult>(
    view: makerOf<any>,
    data?: any,
    element?: any,
  ): Promise<DialogResult<TResult>> {
    this.coordinator.closeAll();
    const ve = new ViewEngine(ContainerInstance);

    const popoverElement = document.createElement("div");
    popoverElement.classList.add(classes.wrapper);
    popoverElement.appendChild(document.createElement("div"));
    document.body.appendChild(popoverElement);

    let resolver = null;
    const returnPromise = new Promise<DialogResult<TResult>>(
      res => (resolver = res),
    );
    const controller = new PopoverController<TResult>(resolver);
    //newContainer.use(PopoverController, controller);
    const v = ve.loadView(view, data, o => {
      o.use(PopoverController, controller);
    });

    if (element != null) {
      this.coordinator.openAtElement(element);
    }

    v.renderTo(popoverElement.children[0] as HTMLElement);
    setTimeout(() => {
      const { x, y, fixed } = this.coordinator.getPosition(
        popoverElement.clientWidth,
        popoverElement.clientHeight,
      );

      popoverElement.style.left = `${x}px`;
      popoverElement.style.top = `${y}px`;
      popoverElement.style.position = fixed ? "fixed" : null;

      popoverElement.classList.add(classes.open);
    }, 10);

    // setup key listener for ESC; and call cancel or close or something on the controller...
    //
    const closer = this.closeStack.enroll(() => resolver({ canceled: true }));

    const clickHandler = (e: MouseEvent) => {
      if ((<any>e).__getFile) return;

      this.coordinator.closeAll();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    };

    const stopBubble = e => {
      closer.closeAbove();

      e.stopImmediatePropagation();
      e.stopPropagation();
      // Removed the e.preventDefault() here because it prevents interaction with checkboxes in popovers
    };

    window.addEventListener("click", clickHandler);
    popoverElement.addEventListener("click", stopBubble);

    await v.activate();
    this.coordinator.push(resolver);

    const res = await returnPromise;

    popoverElement.classList.remove(classes.open);
    this.coordinator.closeAllAwaiters();

    setTimeout(() => {
      v.remove();
      popoverElement.removeEventListener("click", stopBubble);
      popoverElement.remove();

      //document.removeEventListener("keydown", escHandler);
      window.removeEventListener("click", clickHandler);
    }, 300);

    return res;
  }
}

export class PopoverController<T> {
  constructor(private resolver: (result: DialogResult<T>) => void) {}

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
