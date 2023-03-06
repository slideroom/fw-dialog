import { CloseStack, Bus } from "@slideroom/fw";
export interface makerOf<T> {
    new (...args: any[]): T;
}
export interface DialogResult<T> {
    canceled: boolean;
    result: T;
}
export type OpenOptions = {
    cssClass?: string;
    closeOnClick?: boolean;
    ariaLabel?: string;
};
export declare class DialogService {
    private closeStack;
    private bus;
    private opened;
    constructor(closeStack: CloseStack, bus: Bus);
    open<TResult>(view: makerOf<any>, data?: any, opts?: OpenOptions): Promise<DialogResult<TResult>>;
}
export declare class DialogController<T> {
    private resolver;
    constructor(resolver: (result: DialogResult<T>) => void);
    close(canceled?: boolean, result?: T): void;
    cancel(): void;
    ok(result: T): void;
}
