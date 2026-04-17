import { sleep } from "./sleep.util";

export interface RetryOptions {
  shouldRetry?: (err: any, retry: number) => boolean;
  retryAfter?: number; // milliseconds
}

type Retry = <R>(func: () => Promise<R>, count: number, options?: RetryOptions) => Promise<R>;

export const retry: Retry = async (func, count, options = {}) => {
  const { shouldRetry = () => true, retryAfter = 1000 } = options;
  try {
    return await func();
  } catch (e: any) {
    if (count <= 1 || !shouldRetry(e, count)) {
      throw e;
    }
    await sleep(retryAfter);
    return await retry(func, count - 1, options);
  }
};
