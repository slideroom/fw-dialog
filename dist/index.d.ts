import { CloseStack, Bus } from '@slideroom/fw';

interface makerOf<T> {
    new (...args: any[]): T;
}
interface DialogResult<T> {
    canceled: boolean;
    result: T;
}
type OpenOptions = {
    cssClass?: string;
    closeOnClick?: boolean;
    ariaLabel?: string;
};
declare class DialogService {
    private closeStack;
    private bus;
    private opened;
    constructor(closeStack: CloseStack, bus: Bus);
    open<TResult>(view: makerOf<any>, data?: any, opts?: OpenOptions): Promise<DialogResult<TResult>>;
}
declare class DialogController<T> {
    private resolver;
    constructor(resolver: (result: DialogResult<T>) => void);
    close(canceled?: boolean, result?: T): void;
    cancel(): void;
    ok(result: T): void;
}

declare const hideElement: (el: HTMLElement) => void;
declare const focusElement: (el: HTMLElement) => void;

export { DialogController, DialogResult, DialogService, OpenOptions, focusElement, hideElement, makerOf };
//# sourceMappingURL=index.d.ts.map
