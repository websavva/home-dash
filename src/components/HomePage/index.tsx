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
    <div>
      <main className={classes['home-page']}>
        {folders.map((folder) => {
          return <FolderCard folder={folder} />;
        })}
      </main>
    </div>
  );
}

export default HomePage;
