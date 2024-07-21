import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

import type { Bookmark } from '@/context/bookmark-manager/manager';
import FavIcon from '@/components/FavIcon';

import classes from './index.module.scss';

export interface BookmarkItemProps extends HTMLAttributes<HTMLAnchorElement> {
  bookmark: Bookmark;
}

function BookmarkItem({ bookmark, className, ...attrs }: BookmarkItemProps) {
  const { url, title } = bookmark;

  return (
    <a
      {...attrs}
      target="_blank"
      href={url}
      className={clsx(classes['bookmark-item'], className)}
    >
      <div>
        <FavIcon url={url} className={classes['bookmark-item__icon']} />

        <span>{title}</span>
      </div>
    </a>
  );
}

export default BookmarkItem;
