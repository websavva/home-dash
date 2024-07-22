import {
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from 'react';

import { LocalStorageBookmarkManager, BookmarkManager } from './manager';

export type BookmarkManagerContextSchema = Omit<
  BookmarkManager,
  '_tree' | 'onChange'
>;

export const BookmarkManagerContext =
  // @ts-expect-error optional value
  createContext<BookmarkManagerContextSchema>(undefined);

export const BookmarkManagerContextProvider = ({
  children,
}: PropsWithChildren) => {
  const bookmarkManagerRef = useRef(new LocalStorageBookmarkManager());

  const [bookmarkTree, setBookmarkTree] = useState(
    bookmarkManagerRef.current.tree,
  );

  useEffect(() => {
    return bookmarkManagerRef.current.onChange((updatedTree) => {
      setBookmarkTree(updatedTree);
    });
  }, []);

  const {
    addBookmark,
    addFolder,
    moveBookmark,
    moveFolder,
    removeBookmark,
    removeFolder,
    updateFolder,
    updateBookmark,
  } = bookmarkManagerRef.current;

  const bookmarkManagerContext = {
    tree: bookmarkTree,
    addBookmark,
    addFolder,
    moveBookmark,
    moveFolder,
    removeBookmark,
    removeFolder,
    updateFolder,
    updateBookmark,
  };

  return (
    <BookmarkManagerContext.Provider value={bookmarkManagerContext}>
      {children}
    </BookmarkManagerContext.Provider>
  );
};
