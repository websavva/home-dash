import type { HTMLAttributes } from 'react';
import { CopyPlusIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useOnAddNewCard } from '@/hooks/use-on-add-new-card';

import baseClasses from '../index.module.scss';

import classes from './index.module.scss';

function FolderCardPlaceholder(props: HTMLAttributes<HTMLDivElement>) {
  const onAddNewCard = useOnAddNewCard();

  return (
    <div
      {...props}
      className={clsx(
        baseClasses['folder-card'],
        classes['folder-card-placeholder'],
        props.className,
      )}
      onClick={onAddNewCard}
    >
      <CopyPlusIcon />
    </div>
  );
}

export default FolderCardPlaceholder;
