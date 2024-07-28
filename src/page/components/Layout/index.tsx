import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { LayoutDashboardIcon, CopyPlusIcon } from 'lucide-react';

import { useFolderHandlers } from '#page/hooks/use-folder-handlers';

import classes from './index.module.scss';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

function Layout({
  children,
  className,
  ...attrs
}: HTMLAttributes<HTMLDivElement>) {
  const { isLoaded: isBookmarkManagerLoaded } = useBookmarkManager();

  const { onAdd: onAddFolder } = useFolderHandlers();

  const sidebarButtons = [
    {
      id: 'logo',
      Icon: LayoutDashboardIcon,
    },

    {
      id: 'new-card-addition',
      Icon: CopyPlusIcon,
      onClick: onAddFolder,
      disabled: !isBookmarkManagerLoaded,
    },
  ];

  return (
    <div {...attrs} className={clsx(classes['layout'], className)}>
      <aside className={classes['layout__sidebar']}>
        {sidebarButtons.map(({ id, Icon, onClick, disabled }) => {
          const isClickable = Boolean(onClick);

          const className = clsx(classes['layout__sidebar__btn'], {
            [classes['layout__sidebar__btn--clickable']]: isClickable,
          });

          if (isClickable) {
            return (
              <button
                key={id}
                className={className}
                onClick={onClick}
                disabled={disabled}
              >
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
