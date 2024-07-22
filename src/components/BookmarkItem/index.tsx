import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { EditIcon, CopyXIcon } from 'lucide-react';

import type { Bookmark } from '@/context/bookmark-manager/manager';
import FavIcon from '@/components/FavIcon';
import ButtonMore, { type ButtonMoreAction } from '@/components/UI/ButtonMore';

import classes from './index.module.scss';
import { useBookmarkHandlers } from '@/hooks/use-bookmark-handlers';

export interface BookmarkItemProps extends HTMLAttributes<HTMLAnchorElement> {
  bookmark: Bookmark;
}

function BookmarkItem({ bookmark, className, ...attrs }: BookmarkItemProps) {
  const { url, title } = bookmark;

  const bookmarkHandlers = useBookmarkHandlers();

  const actions: ButtonMoreAction[] = [
    {
      id: 'edit',
      Icon: EditIcon,
      label: 'Edit',
      onClick: () => bookmarkHandlers.onEdit(bookmark),
    },
    {
      id: 'remove',
      Icon: CopyXIcon,
      label: 'Remove',
      onClick: () => bookmarkHandlers.onRemove(bookmark),
    },
  ];
  return (
    <a
      {...attrs}
      target="_blank"
      href={url}
      className={clsx(classes['bookmark-item'], className)}
    >
      <FavIcon url={url} className={classes['bookmark-item__icon']} />

      <span className={classes['bookmark-item__title']}>{title}</span>

      <ButtonMore
        onClick={(e) => e.preventDefault()}
        actions={actions}
        className={classes['bookmark-item__btn']}
      />
    </a>
  );
}

export default BookmarkItem;
