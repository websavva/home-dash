import {
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";

import { useWaitFor } from "@/hooks/use-wait-for";

import type { BookmarkTreeContextSchema, BookmarkTreeNode, CreateBookmarkProps, CreateFolderProps } from "./types";

const BOOKMARK_TREE_ID = "__HOME_DASH__";

const isDev = import.meta.env.DEV;

export const BookmarkTreeContext = createContext({
  tree: {},
  isPending: false,
  isLoaded: false,
} as BookmarkTreeContextSchema);

export const BookmarkTreeContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [isPending, setIsPending] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [tree, setTree] = useState<null | BookmarkTreeNode>(null);

  const refreshTree = () => {
    return chrome.bookmarks.get(BOOKMARK_TREE_ID).then(([bookmarkTreeRootNode]) => {
      setTree(bookmarkTreeRootNode);
    });
  };

  useEffect(() => {
    refreshTree().then(() => {
      setIsLoaded(true)
    });
  }, []);

  

  const bookmarkTreeContext: BookmarkTreeContextSchema = {
    tree: tree!,

    isLoaded,
    isPending,

    addBookmark: useWaitFor(setIsPending, async (bookmarkProps: CreateBookmarkProps) =>  {
      const newBookmark = await chrome.bookmarks.create(bookmarkProps);

      await refreshTree();
      
      return newBookmark
    }),

    addFolder: useWaitFor(setIsPending, async (folderProps: CreateFolderProps) => {
      const newFolder = await chrome.bookmarks.create(folderProps);

      await refreshTree();

      return newFolder
    })
  }

  return (
    <BookmarkTreeContext.Provider>{children}</BookmarkTreeContext.Provider>
  );
};
