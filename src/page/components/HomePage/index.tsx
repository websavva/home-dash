import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import type { Folder } from '@/context/bookmark-manager/manager';

import FolderCard from '../FolderCard';
import FolderCardPlaceholder from '../FolderCard/Placeholder';

import classes from './index.module.scss';

function HomePage() {
  const {
    tree: { children = [] },
  } = useBookmarkManager();

  const folders = children as Folder[];

  return (
    <div className={classes['home-page__list']}>
      {folders.map((folder) => {
        return <FolderCard key={folder.id} folder={folder} />;
      })}

      <FolderCardPlaceholder />
    </div>
  );
}

export default HomePage;
