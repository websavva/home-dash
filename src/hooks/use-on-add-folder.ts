import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';

import FolderModal from '@/components/Modals/FolderModal';

export const useOnAddFolder = () => {
  const { addFolder } = useBookmarkManager();

  const { open: openModal } = useModals();

  return async () => {
    const form = await openModal(FolderModal);

    const trimmedTitle = form?.title?.trim();

    if (!trimmedTitle) return;

    await addFolder(trimmedTitle);
  };
};
