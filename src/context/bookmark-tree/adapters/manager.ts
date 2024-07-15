import type {
  Folder,
  Bookmark,
  BookmarkTreeNode,
  CreateBookmarkProps,
  CreateFolderProps,
  MoveBookmarkArgs,
} from "./types";

export abstract class BookmarkManager {
  public _tree: BookmarkTreeNode | null = null;

  get tree() {
    return this._tree;
  }

  abstract addFolder(folderProps: CreateFolderProps): Promise<Folder>;

  abstract addBookmark(bookmarkProps: CreateBookmarkProps): Promise<Bookmark>;

  abstract removeFolder(folderId: string): Promise<boolean>;

  abstract removeBookmark(bookmarkId: string): Promise<boolean>;

  abstract moveFolder(folderId: string, index: number): Promise<boolean>;

  abstract moveBookmark(
    folderId: string,
    args: MoveBookmarkArgs
  ): Promise<boolean>;
}
