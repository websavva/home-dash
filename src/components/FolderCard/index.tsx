import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CopyXIcon, BookmarkPlusIcon, EditIcon } from 'lucide-react';

import type { Folder } from '@/context/bookmark-manager/manager';
import ButtonMore, { type ButtonMoreAction } from '@/components/UI/ButtonMore';
import ButtonMoreAnchor from '@/components/UI/ButtonMore/Anchor';
import { useFolderHandlers } from '@/hooks/use-folder-handlers';
import { useBookmarkHandlers } from '@/hooks/use-bookmark-handlers';

import BookmarkItem from '../BookmarkItem';

import classes from './index.module.scss';
import { useBookmarkManager } from '@/hooks/use-bookmark-manager';

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

  const { moveFolder } = useBookmarkManager();

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
      onDragStart={(e) => e.dataTransfer.setData('text/plain', folder.id)}
      onDrop={(e) => {
        const targetFolderId = e.dataTransfer.getData('text/plain');

        if (!targetFolderId) return;

        moveFolder(targetFolderId, folder.index!);
      }}
    >
      <div className={classes['folder-card__head']}>
        <div className={classes['folder-card__head__title']}>{title}</div>

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
