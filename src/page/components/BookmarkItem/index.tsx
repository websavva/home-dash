import { type HTMLAttributes } from 'react';
import { EditIcon, CopyXIcon } from 'lucide-react';

import type { Bookmark } from '#page/services/bookmark-manager';
import FavIcon from '#page/components/FavIcon';
import ButtonMoreAnchor from '#page/components/UI/ButtonMore/Anchor';
import ButtonMore, {
  type ButtonMoreAction,
} from '#page/components/UI/ButtonMore';
import { useBookmarkHandlers } from '#page/hooks/use-bookmark-handlers';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

import classes from './index.module.scss';

export interface BookmarkItemProps extends HTMLAttributes<HTMLDivElement> {
  bookmark: Bookmark;
}

function BookmarkItem({ bookmark, className, ...attrs }: BookmarkItemProps) {
  const { url, title } = bookmark;

  const { moveBookmark } = useBookmarkManager();

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
      <a
        target="_blank"
        className={classes['bookmark-item']}
        href={url}
        onDragOver={(e) => e.preventDefault}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData('bookmark', bookmark.id);
        }}
        onDrop={async (e) => {
          e.stopPropagation();
          const targetedBookmarkId = e.dataTransfer.getData('bookmark');

          if (!targetedBookmarkId || targetedBookmarkId === bookmark.id) return;

          await moveBookmark(targetedBookmarkId, {
            parentId: bookmark.parentId!,
            index: bookmark.index!,
          });
        }}
      >
        <div className={classes['bookmark-item__left']}>
          <FavIcon url={url} className={classes['bookmark-item__left__icon']} />

          <span className={classes['bookmark-item__left__title']}>{title}</span>
        </div>

        <ButtonMore
          actions={actions}
          onClick={(e) => e.preventDefault()}
          className={classes['bookmark-item__btn']}
        />
      </a>
    </ButtonMoreAnchor>
  );
}

export default BookmarkItem;
