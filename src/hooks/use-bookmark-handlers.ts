import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import { useModals } from '@/hooks/use-modals';
import type { Bookmark } from '@/context/bookmark-manager/manager';

import BookmarkModal, {
  BookmarkModalExtraProps,
  BookmarkModalForm,
} from '@/components/Modals/BookmarkModal';

export const useBookmarkHandlers = () => {
  const { addBookmark, removeBookmark, updateBookmark } = useBookmarkManager();

  const { open: openModal } = useModals();

  const openBookmarkModal = async (
    onSuccess: (form: BookmarkModalForm) => any,
    props?: BookmarkModalExtraProps,
  ) => {
    const form = await openModal(BookmarkModal, props);

    if (!form) return;

    await onSuccess(form);
  };

  const onAdd = (folderId: string) =>
    openBookmarkModal((form) =>
      addBookmark({
        ...form,
        parentId: folderId,
      }),
    );

  const onEdit = ({ id, parentId, title, url }: Bookmark) =>
    openBookmarkModal(
      (form) =>
        updateBookmark(parentId!, {
          id,
          ...form,
        }),
      {
        initialForm: {
          url,
          title,
        },

        buttonLabel: 'Save',
      },
    );

  const onRemove = (bookmark: Bookmark) => removeBookmark(bookmark.id);

  return {
    onAdd,
    onRemove,
    onEdit,
  };
};
