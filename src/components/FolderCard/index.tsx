import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

import type { Folder } from '@/context/bookmark-manager/manager';

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

  return (
    <div {...attrs} className={clsx(classes['folder-card'], className)}>
      <div className={classes['folder-card__head']}>
        <div className={classes['folder-card__head__title']}>{title}</div>
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
