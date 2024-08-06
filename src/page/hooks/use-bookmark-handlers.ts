import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import { useModals } from '#page/hooks/use-modals';
import type { Bookmark } from '#page/services/bookmark-manager';

import BookmarkModal, {
  type BookmarkModalExtraProps,
  type BookmarkModalForm,
} from '#page/components/Modals/BookmarkModal';
import { isFormValid } from '#page/utils/validators';

export const useBookmarkHandlers = () => {
  const { addBookmark, removeBookmark, updateBookmark } = useBookmarkManager();

  const { open: openModal } = useModals();

  const openBookmarkModal = async (
    onSuccess: (form: BookmarkModalForm) => any,
    props?: BookmarkModalExtraProps,
  ) => {
    const form = await openModal(BookmarkModal, props);

    if (!form || !isFormValid(form)) return;

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
