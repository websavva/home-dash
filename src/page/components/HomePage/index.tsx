import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import type { Folder } from '#page/services/bookmark-manager';

import FolderCard from '../FolderCard';
import FolderCardPlaceholder from '../FolderCard/Placeholder';

import classes from './index.module.scss';

function HomePage() {
  const {
    tree: { children = [] },
    isLoaded,
  } = useBookmarkManager();

  const folders = children as Folder[];

  return (
    <div className={classes['home-page__list']}>
      {isLoaded && (
        <>
          {folders.map((folder) => {
            return <FolderCard key={folder.id} folder={folder} />;
          })}

          <FolderCardPlaceholder />
        </>
      )}
    </div>
  );
}

export default HomePage;
