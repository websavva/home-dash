export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

export type Bookmark = Omit<BookmarkTreeNode, "url" | "children"> & {
  url: string;
};

export type Folder = Omit<BookmarkTreeNode, "url" | "children"> & {
  children: Array<Bookmark>;
};

export type CreateFolderProps = Required<Pick<Folder, "index" | "title">>;

export type CreateBookmarkProps = Required<
  Pick<Bookmark, "index" | "title" | "parentId" | 'url'>
>;

export type MoveBookmarkArgs = {
  parentId: string;
  index: number;
};
