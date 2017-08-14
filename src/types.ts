export interface makerOf<T> {
  new (...args): T;
}

export interface DialogResult<T> {
  canceled: boolean;
  result: T;
}
