declare module 'fw-dialog/dialog' {
	export interface makerOf<T> {
	    new (...args: any[]): T;
	}
	export interface DialogResult<T> {
	    canceled: boolean;
	    result: T;
	}
	export class DialogService {
	    open<TResult>(view: makerOf<any>, data?: any): Promise<DialogResult<TResult>>;
	}
	export class DialogController<T> {
	    private resolver;
	    constructor(resolver: (result: DialogResult<T>) => void);
	    close(canceled?: boolean, result?: T): void;
	    cancel(): void;
	    ok(result: T): void;
	}

}
declare module 'fw-dialog' {
	export * from 'fw-dialog/dialog';

}
