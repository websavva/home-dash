import type { PropsWithChildren} from 'react';
import { useContext } from 'react';

import {
  ModalsContextProvider,
  ModalsContext,
} from '#page/context/modals/Provider';

export function ModalsContainerList() {
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
          <Component {...props} key={id} submit={onSubmit} close={onClose} />
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
