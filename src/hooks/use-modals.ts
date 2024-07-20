import { useContext } from 'react';

import { ModalsContext } from '@/context/modals/Provider';
import type { ModalComponent, PartialModalProps } from '@/context/modals/types';

export const useModals = () => {
  const { open: _open, openedModals } = useContext(ModalsContext);

  const open = <P>(
    Component: ModalComponent<P>,
    props?: PartialModalProps<P>,
  ): Promise<P | null> => {
    return _open(Component, props);
  };

  return {
    openedModals,
    open,
  };
};
