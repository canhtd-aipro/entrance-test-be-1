export class Observer<D extends Array<any>, F extends (...params: D) => any = (...data: D) => void> {
  protected listeners: Array<F> = [];

  subscribe(fn: F) {
    this.listeners.push(fn);
  }

  unsubscribe(fn: F) {
    this.listeners = this.listeners.filter((e) => e !== fn);
  }

  notify(...data: D) {
    this.listeners.forEach((fn) => fn(...data));
  }
}
