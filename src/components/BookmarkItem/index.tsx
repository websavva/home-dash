import { type HTMLAttributes } from 'react';
import { EditIcon, CopyXIcon } from 'lucide-react';

import type { Bookmark } from '@/context/bookmark-manager/manager';
import FavIcon from '@/components/FavIcon';
import ButtonMoreAnchor from '@/components/UI/ButtonMore/Anchor';
import ButtonMore, { type ButtonMoreAction } from '@/components/UI/ButtonMore';

import classes from './index.module.scss';
import { useBookmarkHandlers } from '@/hooks/use-bookmark-handlers';

export interface BookmarkItemProps extends HTMLAttributes<HTMLDivElement> {
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
    <ButtonMoreAnchor {...attrs} className={className}>
      <a target="_blank" className={classes['bookmark-item']} href={url}>
        <FavIcon url={url} className={classes['bookmark-item__icon']} />

        <span className={classes['bookmark-item__title']}>{title}</span>

        <ButtonMore actions={actions} onClick={(e) => e.preventDefault()} />
      </a>
    </ButtonMoreAnchor>
  );
}

export default BookmarkItem;
