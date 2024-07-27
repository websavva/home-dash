import { createContext, useState, type PropsWithChildren } from 'react';

import type { ModalsContextSchema, OpenModalHandler } from './types';

export const ModalsContext = createContext<ModalsContextSchema>({
  openedModals: [],

  open: async () => {},

  remove: () => {},
});

export const ModalsContextProvider = ({ children }: PropsWithChildren) => {
  const [openedModals, setOpenedModals] = useState<
    ModalsContextSchema['openedModals']
  >([]);

  const open: OpenModalHandler = async (Component, props) => {
    type T = Awaited<ReturnType<OpenModalHandler>>;

    let resolveModal: (value: T) => void;

    const promise = new Promise<Awaited<ReturnType<OpenModalHandler>>>(
      (resolve) => {
        resolveModal = resolve;
      },
    );

    setOpenedModals((openedModals) => [
      ...openedModals,
      {
        id: crypto.randomUUID(),
        resolve: resolveModal,
        promise,
        Component,
        props,
      },
    ]);

    return promise;
  };

  const remove = (id: string) => {
    setOpenedModals((openedModals) => {
      return openedModals.filter((modalItem) => modalItem.id !== id);
    });
  };

  return (
    <ModalsContext.Provider
      value={{
        openedModals,
        open,
        remove,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};
