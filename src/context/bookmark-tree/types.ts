export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

export type Bookmark = Omit<BookmarkTreeNode, "url" | "children"> & {
  url: string;
};

export type Folder = Omit<BookmarkTreeNode, "url" | "children"> & {
  children: Array<Bookmark>;
};

export type CreateFolderProps = Required<Pick<Folder, "index" | "title">>;

export type CreateBookmarkProps = Required<
  Pick<Bookmark, "index" | "title" | "parentId">
>;

export type MoveBookmarkArgs = {
  parentId: string;
  index: number;
};

export interface BookmarkTreeContextSchema {
  tree: BookmarkTreeNode;

  isPending: boolean;

  isLoaded: boolean;

  addFolder: (folderProps: CreateFolderProps) => Promise<Folder>;

  addBookmark: (bookmarkProps: CreateBookmarkProps) => Promise<Bookmark>;

  removeFolder: (folderId: string) => Promise<boolean>;

  removeBookmark: (bookmarkId: string) => Promise<boolean>;

  moveFolder: (folderId: string, index: number) => Promise<boolean>;

  moveBookmark: (folderId: string, args: MoveBookmarkArgs) => Promise<boolean>;
}
