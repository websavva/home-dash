import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

import { LayoutDashboardIcon, CopyPlusIcon } from 'lucide-react';

import { useOnAddNewCard } from '@/hooks/use-on-add-new-card';

import classes from './index.module.scss';

function Layout({
  children,
  className,
  ...attrs
}: HTMLAttributes<HTMLDivElement>) {
  const onAddNewCard = useOnAddNewCard();

  const sidebarButtons = [
    {
      id: 'logo',
      Icon: LayoutDashboardIcon,
    },

    {
      id: 'new-card-addition',
      Icon: CopyPlusIcon,
      onClick: onAddNewCard,
    },
  ];

  return (
    <div {...attrs} className={clsx(classes['layout'], className)}>
      <aside className={classes['layout__sidebar']}>
        {sidebarButtons.map(({ id, Icon, onClick }) => {
          const isClickable = Boolean(onClick);

          const className = clsx(classes['layout__sidebar__btn'], {
            [classes['layout__sidebar__btn--clickable']]: isClickable,
          });

          if (isClickable) {
            return (
              <button key={id} className={className} onClick={onClick}>
                <Icon />
              </button>
            );
          } else {
            return (
              <div key={id} className={className}>
                <Icon />
              </div>
            );
          }
        })}
      </aside>

      <main>{children}</main>
    </div>
  );
}

export default Layout;
