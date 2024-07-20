import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';

import AddFolderModal from '@/components/Modals/AddFolderModal';

export const useOnAddNewCard = () => {
  const { addFolder } = useBookmarkManager();

  const { open: openModal } = useModals();

  return async () => {
    const form = await openModal(AddFolderModal);

    const trimmedTitle = form?.title?.trim();

    if (!trimmedTitle) return;

    await addFolder(trimmedTitle);
  };
};
