import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CopyXIcon, BookmarkPlusIcon, EditIcon } from 'lucide-react';

import type { Folder } from '#page/services/bookmark-manager';
import ButtonMore, {
  type ButtonMoreAction,
} from '#page/components/UI/ButtonMore';
import ButtonMoreAnchor from '#page/components/UI/ButtonMore/Anchor';
import { useFolderHandlers } from '#page/hooks/use-folder-handlers';
import { useBookmarkHandlers } from '#page/hooks/use-bookmark-handlers';

import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

import BookmarkItem from '../BookmarkItem';

import classes from './index.module.scss';

export interface FolderCardProps extends HTMLAttributes<HTMLDivElement> {
  folder: Folder;
}

function FolderCard({
  folder,

  className,
  ...attrs
}: FolderCardProps) {
  const {
    title,

    children: bookmarks = [],
  } = folder;

  const { moveFolder, moveBookmark } = useBookmarkManager();

  const folderHandlers = useFolderHandlers();
  const bookmarkHandlers = useBookmarkHandlers();

  const onRemove = () => folderHandlers.onRemove(folder);

  const onEdit = () => folderHandlers.onEdit(folder);

  const onAddBookmark = () => bookmarkHandlers.onAdd(folder.id);

  const actions: ButtonMoreAction[] = [
    {
      id: 'edit',
      Icon: EditIcon,
      label: 'Edit',
      onClick: onEdit,
    },
    {
      id: 'remove',
      Icon: CopyXIcon,
      label: 'Remove',
      onClick: onRemove,
    },
    {
      id: 'add-bookmark',
      Icon: BookmarkPlusIcon,
      label: 'Add Bookmark',
      onClick: onAddBookmark,
    },
  ];

  return (
    <ButtonMoreAnchor
      {...attrs}
      className={clsx(classes['folder-card'], className)}
      draggable="true"
      onDragOver={(e) => e.preventDefault()}
      onDragStart={(e) => {
        e.dataTransfer.setData('folder', folder.id);
      }}
      onDrop={async (e) => {
        const targetedBookmarkId = e.dataTransfer.getData('bookmark');

        if (targetedBookmarkId) {
          return moveBookmark(targetedBookmarkId, {
            parentId: folder.id,
            index: folder.children.length,
          });
        }

        const targetedFolderId = e.dataTransfer.getData('folder');

        if (!targetedFolderId || targetedFolderId === folder.id) return;

        await moveFolder(targetedFolderId, folder.index!);
      }}
    >
      <div className={classes['folder-card__head']}>
        <div
          className={classes['folder-card__head__title']}
          data-testid="folder-title"
        >
          {title}
        </div>

        <ButtonMore
          actions={actions}
          className={classes['folder-card__head__btn']}
        />
      </div>

      <div className={classes['folder-card__body']}>
        {bookmarks.map((bookmark) => {
          return <BookmarkItem key={bookmark.id} bookmark={bookmark} />;
        })}
      </div>
    </ButtonMoreAnchor>
  );
}

export default FolderCard;
