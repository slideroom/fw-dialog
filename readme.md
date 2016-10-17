# fw-dialog

A quick dialog component for fw.

To open a dialog:

```
import { DialogService } from "fw-dialog";


class ViewModel {
  private dialogService: DialogService;
  // ...

  async openDialog() {
    const result = await this.dialogservice.open(DialogView, { some: "data" });

    if (result.canceled) { // clicked out or canceled }
    else {
      const data = result.result;
    }
  }
}
```

To be a dialog:

```
import { DialogController } from "fw-dialog";

class DialogView {
  private dialogController: DialogController<{ hey: string }>;
  // ...

  activate(data) {
    // data is passed from an open call
  }

  handleCancelClick() {
    this.dialogController.cancel();
  }

  handleOkClick() {
    this.dialogController.ok({ hey: "now" });
  }
}
```

TODO: bring over the popover stuff in here, since it works the same with with an added vue component..
