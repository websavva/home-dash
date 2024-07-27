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

  protected isGlobalListenerSetUp: boolean = false;
  protected onChangeCallbacks: OnBookmarkTreeChangeCallback[] = [];

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
    updatedBookmark: UpdateBookmarkProps,
  ): Promise<boolean>;

  public abstract moveBookmark(
    bookmarkId: string,
    args: MoveBookmarkArgs,
  ): Promise<boolean>;

  public abstract setUpGlobalListener(): void;

  public abstract removeGlobalListener(): void;

  public onChange = (callback: OnBookmarkTreeChangeCallback) => {
    if (!this.isGlobalListenerSetUp) this.setUpGlobalListener();

    this.onChangeCallbacks.push(callback);

    return () => {
      this.onChangeCallbacks = this.onChangeCallbacks.filter(
        (currentCallback) => currentCallback !== callback,
      );

      if (!this.onChangeCallbacks.length) this.removeGlobalListener();
    };
  }
  
  protected runOnChangeCallbacks(updatedTree: BookmarkTreeNode) {
    this.onChangeCallbacks.forEach((callback) => {
      callback(updatedTree);
    });
  }
}
