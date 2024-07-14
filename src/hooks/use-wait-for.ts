export const useWaitFor = <F extends (...args: any[]) => Promise<any>>(
  updatePending: (pending: boolean) => void,
  func: F
) => {
  return async (...args: Parameters<F>) => {
    updatePending(true);

    try {
      return await func.call(null, ...args);
    } finally {
      updatePending(false);
    }
  };
};
