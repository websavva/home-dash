import { PropsWithChildren, useContext } from 'react';

import { ModalsContextProvider, ModalsContext } from '../Provider';

function ModalsContainerList() {
  const { openedModals, remove } = useContext(ModalsContext);

  return (
    <div>
      {openedModals.map(({ id, resolve, Component, props }) => {
        return (
          <Component
            key={id}
            onSubmit={async (payload) => {
              resolve(payload);

              await props.onSubmit(payload);

              remove(id);
            }}
            onClose={async () => {
              resolve(null);

              await props.onClose?.();

              remove(id);
            }}
          />
        );
      })}
    </div>
  );
}

function ModalsContainer({ children }: PropsWithChildren) {
  return (
    <ModalsContextProvider>
      <div>
        {children}

        <ModalsContainerList />
      </div>
    </ModalsContextProvider>
  );
}

export default ModalsContainer;
