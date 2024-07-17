import { useBookmarkManager } from '@/hooks/use-bookmark-manager';
import type { Folder } from '@/context/bookmark-manager/manager';

import FolderCard from '../FolderCard';
import Layout from '../Layout';

import classes from './index.module.scss';

function HomePage() {
  const {
    tree: { children = [] },
  } = useBookmarkManager();

  const folders = children as Folder[];

  return (
    <Layout>
      <div className={classes['home-page__list']}>
        {folders.map((folder) => {
          return <FolderCard folder={folder} />;
        })}
      </div>
    </Layout>
  );
}

export default HomePage;
