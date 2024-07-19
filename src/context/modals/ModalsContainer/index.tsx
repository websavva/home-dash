import { PropsWithChildren, useContext } from 'react';

import { ModalsContextProvider, ModalsContext } from '../Provider';

import Modal from './Modal';

function ModalsContainerList() {
  const { openedModals, remove } = useContext(ModalsContext);

  return (
    <div>
      {openedModals.map(({ id, resolve, Component, props }) => {
        const onSubmit = async (payload: any) => {
          resolve(payload);

          await props?.submit?.(payload);

          remove(id);
        };

        const onClose = async () => {
          resolve(null);

          await props?.close?.();

          remove(id);
        };

        return (
          <Modal key={id} onClose={onClose}>
            <Component {...props} submit={onSubmit} close={onClose} />
          </Modal>
        );
      })}
    </div>
  );
}

function ModalsContainer({ children }: PropsWithChildren) {
  return (
    <ModalsContextProvider>
      {children}

      <ModalsContainerList />
    </ModalsContextProvider>
  );
}

export default ModalsContainer;
