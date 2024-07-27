import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';
import type { Folder } from '@/context/bookmark-manager/manager';

import FolderModal, {
  FolderModalExtraProps,
} from '@/components/Modals/FolderModal';
import { isFormValid } from '@/utils/validators';

export const useFolderHandlers = () => {
  const { addFolder, updateFolder, removeFolder } = useBookmarkManager();

  const { open: openModal } = useModals();

  const openFolderModal = async (
    onSuccess: (newTitle: string) => any,
    props?: FolderModalExtraProps,
  ) => {
    const form = await openModal(FolderModal, props);

    if (!form || !isFormValid(form)) return;

    await onSuccess(form.title);
  };

  const onAdd = () => openFolderModal((title) => title && addFolder(title));

  const onEdit = (folder: Folder) =>
    openFolderModal(
      (newTitle) => newTitle.trim() && updateFolder(folder.id, newTitle),
      {
        buttonLabel: 'Save',
        initialTitle: folder.title,
      },
    );

  const onRemove = (folder: Folder) => removeFolder(folder.id);

  return {
    onEdit,
    onAdd,
    onRemove,
  };
};