import type { HTMLAttributes } from 'react';
import { CopyPlusIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useOnAddFolder } from '@/hooks/use-on-add-folder';

import baseClasses from '../index.module.scss';

import classes from './index.module.scss';

function FolderCardPlaceholder(props: HTMLAttributes<HTMLDivElement>) {
  const onAddFolder = useOnAddFolder();

  return (
    <div
      {...props}
      className={clsx(
        baseClasses['folder-card'],
        classes['folder-card-placeholder'],
        props.className,
      )}
      onClick={onAddFolder}
    >
      <CopyPlusIcon />
    </div>
  );
}

export default FolderCardPlaceholder;
