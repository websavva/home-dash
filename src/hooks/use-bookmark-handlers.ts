import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';
import type { Bookmark } from '@/context/bookmark-manager/manager';

import BookmarkModal, {
  BookmarkModalExtraProps,
  BookmarkModalForm,
} from '@/components/Modals/BookmarkModal';

export const useBookmarkHandlers = () => {
  const { addBookmark, removeBookmark } = useBookmarkManager();

  const { open: openModal } = useModals();

  const openBookmarkModal = async (
    onSuccess: (form: BookmarkModalForm) => any,
    props?: BookmarkModalExtraProps,
  ) => {
    const form = await openModal(BookmarkModal, props);

    const trimmedTitle = form?.title?.trim();

    if (!trimmedTitle) return;

    await onSuccess(trimmedTitle);
  };

  const onAdd = () => openBookmarkModal((title) => addBookmark(title));

  const onEdit = (folder: Bookmark) =>
    openBookmarkModal((newTitle) => updateBookmark(folder.id, newTitle), {
      buttonLabel: 'Save',
      initialTitle: folder.title,
    });

  const onRemove = (folder: Bookmark) => removeBookmark(folder.id);

  return {
    onEdit,
    onAdd,
    onRemove,
  };
};
