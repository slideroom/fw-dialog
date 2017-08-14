import { inject, prop, ComponentEventBus } from "fw";

import { PopoverCoordinator } from "../popover";

// keeping this around..  if we want to try and autodetect
const isFixed = elem => {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ((elem = elem.offsetParent));

  return false;
};

@inject
export class Popover {
  @prop(false)
  isFixed: boolean;

  private isOpen = false;

  constructor(
    private coordinator: PopoverCoordinator,
    private ceb: ComponentEventBus,
  ) {}

  private async click(event: MouseEvent) {
    if (this.isOpen) {
      this.coordinator.closeAll();
      return;
    }

    const element = (event.target || event.srcElement) as HTMLAnchorElement;

    this.coordinator.openAtElement(element, this.isFixed);
    this.ceb.dispatch("open");

    await this.coordinator.waitForOpen();
    this.isOpen = true;
    await this.coordinator.waitForClose();
    this.isOpen = false;
  }
}
