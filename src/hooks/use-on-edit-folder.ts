import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';

import FolderModal from '@/components/Modals/FolderModal';
import type { Folder } from '@/context/bookmark-manager/manager';

export const useOnEditFolder = (folder: Folder) => {
  const { updateFolder } = useBookmarkManager();

  const { open: openModal } = useModals();

  return async () => {
    const form = await openModal(FolderModal, {
      initialTitle: folder.title,
    });

    const trimmedNewTitle = form?.title?.trim();

    if (!trimmedNewTitle) return;

    await updateFolder(folder.id, trimmedNewTitle);
  };
};
