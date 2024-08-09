import type { HTMLAttributes } from 'react';
import { CopyPlusIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useFolderHandlers } from '#page/hooks/use-folder-handlers';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

import baseClasses from '../index.module.scss';

import classes from './index.module.scss';

function FolderCardPlaceholder(props: HTMLAttributes<HTMLDivElement>) {
  const { isLoaded: isBookmarkManagerLoaded } = useBookmarkManager();
  const { onAdd } = useFolderHandlers();

  return (
    <div
      {...props}
      role="button"
      className={clsx(
        baseClasses['folder-card'],
        classes['folder-card-placeholder'],
        props.className,
      )}
      onClick={() => isBookmarkManagerLoaded && onAdd()}
    >
      <CopyPlusIcon />
    </div>
  );
}

export default FolderCardPlaceholder;
