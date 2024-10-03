import type { HTMLAttributes } from 'react';
import { CopyPlusIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useFolderHandlers } from '#page/hooks/use-folder-handlers';

import baseClasses from '../index.module.scss';

import classes from './index.module.scss';

function FolderCardPlaceholder(props: HTMLAttributes<HTMLDivElement>) {
  const { onAdd } = useFolderHandlers();

  return (
    <div
      {...props}
      className={clsx(
        baseClasses['folder-card'],
        classes['folder-card-placeholder'],
        props.className,
      )}
      data-testid="folder-card-placeholder"
      onClick={() => onAdd()}
    >
      <CopyPlusIcon />
    </div>
  );
}

export default FolderCardPlaceholder;
