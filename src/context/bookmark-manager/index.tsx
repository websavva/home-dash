import {
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  createBookmarkManager,
  type BookmarkManager,
  type BookmarkTreeNode,
  getDefaultBookmarkTree,
} from './manager';

export type BookmarkManagerContextSchema = Pick<
  BookmarkManager,
  | 'tree'
  | 'addFolder'
  | 'addBookmark'
  | 'updateFolder'
  | 'updateBookmark'
  | 'removeFolder'
  | 'removeBookmark'
  | 'moveFolder'
  | 'moveBookmark'
> & {
  isLoaded: boolean;
};

const getDefaultContext = () => {
  return {
    tree: getDefaultBookmarkTree(),
    addFolder: async () => {},
    addBookmark: async () => {},
    removeFolder: async () => {},
    removeBookmark: async () => {},
    updateBookmark: async () => {},
    updateFolder: async () => {},
    moveBookmark: async () => {},
    moveFolder: async () => {},
    isLoaded: false,
  } as unknown as BookmarkManagerContextSchema;
};

export const BookmarkManagerContext = createContext(getDefaultContext());

export const BookmarkManagerContextProvider = ({
  children,
}: PropsWithChildren) => {
  const bookmarkManagerRef = useRef<BookmarkManager | null>(null);

  const [bookmarkTree, setBookmarkTree] = useState<BookmarkTreeNode | null>(
    null,
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function initializeBookmarkManager() {
      const bookmarkManager = await createBookmarkManager();

      bookmarkManager.onChange((updatedTree) => {
        setBookmarkTree(updatedTree);
      });

      bookmarkManagerRef.current = bookmarkManager;

      setBookmarkTree(bookmarkManager.tree);

      setIsLoaded(true);
    }

    initializeBookmarkManager();
  }, []);

  let bookmarkManagerContext: BookmarkManagerContextSchema;

  if (isLoaded) {
    const {
      addBookmark,
      addFolder,
      moveBookmark,
      moveFolder,
      removeBookmark,
      removeFolder,
      updateFolder,
      updateBookmark,
    } = bookmarkManagerRef.current!;

    bookmarkManagerContext = {
      tree: bookmarkTree!,
      addBookmark,
      addFolder,
      moveBookmark,
      moveFolder,
      removeBookmark,
      removeFolder,
      updateFolder,
      updateBookmark,
      isLoaded: true,
    };
  } else {
    bookmarkManagerContext = getDefaultContext();
  }

  return (
    <BookmarkManagerContext.Provider value={bookmarkManagerContext}>
      {children}
    </BookmarkManagerContext.Provider>
  );
};
