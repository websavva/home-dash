import type {
  Folder,
  Bookmark,
  BookmarkTreeNode,
  CreateBookmarkProps,
  MoveBookmarkArgs,
  OnBookmarkTreeChangeCallback,
  UpdateBookmarkProps,
} from './types';

export abstract class BookmarkManager {
  public tree: BookmarkTreeNode;

  constructor() {
    this.tree = { title: 'root' } as BookmarkTreeNode;
  }

  public abstract addFolder(title: string): Promise<Folder>;

  public abstract addBookmark(
    bookmarkProps: CreateBookmarkProps,
  ): Promise<Bookmark>;

  public abstract removeFolder(folderId: string): Promise<boolean>;

  public abstract removeBookmark(bookmarkId: string): Promise<boolean>;

  public abstract updateFolder(
    folderId: string,
    title: string,
  ): Promise<boolean>;

  public abstract moveFolder(folderId: string, index: number): Promise<boolean>;

  public abstract updateBookmark(
    folderId: string,
    updateBookmark: UpdateBookmarkProps,
  ): Promise<boolean>;

  public abstract moveBookmark(
    bookmarkId: string,
    args: MoveBookmarkArgs,
  ): Promise<boolean>;

  public abstract onChange(callback: OnBookmarkTreeChangeCallback): () => void;
}
