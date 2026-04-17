import { ListIteratee, Many, sortBy } from "lodash";

type Concurrent = <T extends Array<() => Promise<any>>>(
  cbs: [...T],
) => Promise<{ [K in keyof T]: T[K] extends () => Promise<infer R> ? R : never }>;

export const concurrent: Concurrent = async (callbacks) => {
  return Promise.all(callbacks.map((each) => each())) as any;
};

declare global {
  interface Array<T> {
    forEachAsync(callback: (value: T, index: number, array: T[]) => Promise<void>): Promise<void>;
    mapAsync<U>(callback: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]>;
    filterMapAsync<U>(callback: (value: T, index: number, array: T[]) => Promise<U | undefined>): Promise<U[]>;
    sortBy(...iteratees: Array<Many<ListIteratee<T>>>): this;
  }
}

const defineArrayMethod = <T>(name: string, fn: T) => {
  Object.defineProperty(Array.prototype, name, {
    value: fn,
    writable: true,
    configurable: true,
    enumerable: false, // <- important
  });
};

defineArrayMethod("forEachAsync", async function <
  T,
>(this: T[], callback: (value: T, index: number, array: T[]) => Promise<void>) {
  await Promise.all(this.map((value, index, array) => callback(value, index, array)));
});

defineArrayMethod("mapAsync", async function <
  T,
  U,
>(this: T[], callback: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> {
  return Promise.all(this.map((value, index, array) => callback(value, index, array)));
});

defineArrayMethod("filterMapAsync", async function <
  T,
  U,
>(this: T[], callback: (value: T, index: number, array: T[]) => Promise<U | undefined>): Promise<U[]> {
  const ans = await Promise.all(this.map((value, index, array) => callback(value, index, array)));
  return ans.filter((e) => e) as U[];
});

defineArrayMethod("sortBy", function <T>(this: T[], ...iteratees: Array<Many<ListIteratee<T>>>): T[] {
  this.splice(0, this.length, ...sortBy(this, ...iteratees));
  return this;
});
