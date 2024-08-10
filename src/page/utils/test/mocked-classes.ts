export const mockedClasses = new Proxy(
  {},
  {
    get: (_, className) => className,
  },
);
