import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CopyXIcon, BookmarkPlusIcon, EditIcon } from 'lucide-react';

import type { Folder } from '@/context/bookmark-manager/manager';
import ButtonMore, { type ButtonMoreAction } from '@/components/UI/ButtonMore';
import { useOnEditFolder } from '@/hooks/use-on-edit-folder';

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
    id: folderId,

    children: bookmarks = [],
  } = folder;

  const { removeFolder } = useBookmarkManager();

  const onEdit = useOnEditFolder(folder);

  const onRemove = () => {
    removeFolder(folderId);
  };

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
      onClick: () => {},
    },
  ];

  return (
    <div {...attrs} className={clsx(classes['folder-card'], className)}>
      <div className={classes['folder-card__head']}>
        <div className={classes['folder-card__head__title']}>{title}</div>

        <ButtonMore
          actions={actions}
          className={classes['folder-card__head__btn']}
        />
      </div>

      <div className={classes['folder-card__body']}>
        {bookmarks.map(({ id, title, url }) => {
          return (
            <a key={id} href={url}>
              {title}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default FolderCard;
