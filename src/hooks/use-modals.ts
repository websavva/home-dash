import { useContext } from 'react';

import { ModalsContext } from '@/context/modals/Provider';
import type { ModalComponent, PartialModalProps } from '@/context/modals/types';

export const useModals = () => {
  const { open: _open, openedModals } = useContext(ModalsContext);

  const open = <P, E>(
    Component: ModalComponent<P, E>,
    props?: PartialModalProps<P, E>,
  ): Promise<P | null> => {
    return _open(Component as any, props);
  };

  return {
    openedModals,
    open,
  };
};
