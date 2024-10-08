import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import { useModals } from '#page/hooks/use-modals';
import type { Folder } from '#page/services/bookmark-manager';

import type { FolderModalExtraProps } from '#page/components/Modals/FolderModal';
import FolderModal from '#page/components/Modals/FolderModal';
import { isFormValid } from '#page/utils/validators';

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

  const onAdd = () => openFolderModal((title) => addFolder(title));

  const onEdit = (folder: Folder) =>
    openFolderModal((newTitle) => updateFolder(folder.id, newTitle), {
      buttonLabel: 'Save',
      initialTitle: folder.title,
    });

  const onRemove = (folder: Folder) => removeFolder(folder.id);

  return {
    onEdit,
    onAdd,
    onRemove,
  };
};
