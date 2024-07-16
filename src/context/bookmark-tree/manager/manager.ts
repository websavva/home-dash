import type {
  Folder,
  Bookmark,
  BookmarkTreeNode,
  CreateBookmarkProps,
  MoveBookmarkArgs,
  OnBookmarkTreeChangeCallback,
} from "./types";

export abstract class BookmarkManager {
  public _tree: BookmarkTreeNode;

  constructor() {
    this._tree = { title: "root" } as BookmarkTreeNode;
  }

  get tree() {
    return this._tree;
  }

  public abstract addFolder(title: string): Promise<Folder>;

  public abstract addBookmark(
    bookmarkProps: CreateBookmarkProps
  ): Promise<Bookmark>;

  public abstract removeFolder(folderId: string): Promise<boolean>;

  public abstract removeBookmark(bookmarkId: string): Promise<boolean>;

  public abstract moveFolder(folderId: string, index: number): Promise<boolean>;

  public abstract moveBookmark(
    bookmarkId: string,
    args: MoveBookmarkArgs
  ): Promise<boolean>;

  public abstract onChange(callback: OnBookmarkTreeChangeCallback): () => void;
}
