import {
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";

import { LocalStorageBookmarkManager, BookmarkManager } from "./manager";

export type BookmarkManagerContextSchema = Omit<
  BookmarkManager,
  "_tree" | "onChange"
>;

export const BookmarkManagerContext =
  // @ts-expect-error optional value
  createContext<BookmarkManagerContextSchema>(undefined);

export const BookmarkManagerContextProvider = ({
  children,
}: PropsWithChildren) => {
  const bookmarkManagerRef = useRef(new LocalStorageBookmarkManager());

  const [bookmarkTree, setBookmarkTree] = useState(
    bookmarkManagerRef.current.tree
  );

  useEffect(() => {
    bookmarkManagerRef.current.onChange((updatedTree) => {
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
  } = bookmarkManagerRef.current;

  const bookmarkManagerContext = {
    tree: bookmarkTree,
    addBookmark,
    addFolder,
    moveBookmark,
    moveFolder,
    removeBookmark,
    removeFolder,
  };

  return (
    <BookmarkManagerContext.Provider value={bookmarkManagerContext}>
      {children}
    </BookmarkManagerContext.Provider>
  );
};