import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import type { Folder } from '@/context/bookmark-manager/manager';

import FolderCard from '../FolderCard';

import classes from './index.module.scss';

function HomePage() {
  const {
    tree: { children = [] },
  } = useBookmarkManager();

  const folders = children as Folder[];

  return (
    <div className={classes['home-page']}>
      <aside className={classes['home-page__sidebar']} />

      <main className={classes['home-page__main']}>
        {folders.map((folder) => {
          return <FolderCard folder={folder} />;
        })}
      </main>
    </div>
  );
}

export default HomePage;
