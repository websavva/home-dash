import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CopyXIcon, BookmarkPlusIcon } from 'lucide-react';

import type { Folder } from '@/context/bookmark-manager/manager';
import ButtonMore, { type ButtonMoreAction } from '@/components/UI/ButtonMore';

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

  const actions: ButtonMoreAction[] = [
    {
      id: 'remove-folder',
      Icon: CopyXIcon,
      label: 'Remove',
      onClick: () => {},
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
