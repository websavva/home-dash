import { BookmarkManager } from './manager';
import { BOOKMARK_TREE_ID } from './config';
import type {
  Bookmark,
  BookmarkTreeNode,
  CreateBookmarkProps,
  Folder,
  MoveBookmarkArgs,
  UpdateBookmarkProps,
} from './types';

const api = chrome?.bookmarks;

export class NativeBookmarkManager extends BookmarkManager {
  constructor(tree: BookmarkTreeNode) {
    super();

    this.tree = tree;
  }

  protected api = api;

  private static eventNames = [
    'onChanged',
    'onChildrenReordered',
    'onCreated',
    'onRemoved',
    'onMoved',
  ] as const;

  public static getExistingTree() {
    return api
      .search({
        title: BOOKMARK_TREE_ID,
      })
      .then(([tree]) => tree);
  }

  public static async create() {
    let tree = await NativeBookmarkManager.getExistingTree();

    if (!tree) {
      tree = await api.create({
        title: BOOKMARK_TREE_ID,
      });
    }

    return new NativeBookmarkManager(tree);
  }

  public get rootId() {
    const {
      tree: { id: rootId },
    } = this;

    return rootId;
  }

  public addFolder = async (title: string) => {
    const folder = await this.api.create({
      parentId: this.rootId,
      title,
    });

    return folder as Folder;
  };

  public removeFolder = (folderId: string) => {
    return this.api
      .removeTree(folderId)
      .then(() => true)
      // .catch(() => false);
  };

  public moveFolder = (folderId: string, index: number) => {
    return this.api
      .move(folderId, {
        index,
        parentId: this.rootId,
      })
      .then(() => true)
      // .catch(() => false);
  };

  public addBookmark = async (bookmarkProps: CreateBookmarkProps) => {
    const newBookmark = await this.api.create(bookmarkProps);

    return newBookmark as Bookmark;
  };

  public removeBookmark = (bookmarkId: string) => {
    return this.api
      .remove(bookmarkId)
      .then(() => true)
      // .catch(() => false);
  };

  public moveBookmark = (bookmarkId: string, args: MoveBookmarkArgs) => {
    return this.api
      .move(bookmarkId, args)
      .then(() => true)
      .catch(() => true);
  };

  public updateFolder = (folderId: string, title: string) => {
    return this.api
      .update(folderId, {
        title,
      })
      .then(() => true);
  };

  public updateBookmark = (
    _: string,
    { id: bookmarkId, ...bookmarkProps }: UpdateBookmarkProps,
  ) => {
    return this.api
      .update(bookmarkId, bookmarkProps)
      .then(() => true)
      // .catch(() => false);
  };

  protected onTreeChange = async () => {
    const updatedTree = await NativeBookmarkManager.getExistingTree();

    this.runOnChangeCallbacks(updatedTree);
  };

  public setUpGlobalListener = () => {
    if (this.isGlobalListenerSetUp) return;

    NativeBookmarkManager.eventNames.forEach((eventName) => {
      this.api[eventName].addListener(this.onTreeChange);
    });

    this.isGlobalListenerSetUp = false;
  };

  public removeGlobalListener = () => {
    if (!this.isGlobalListenerSetUp) return;

    NativeBookmarkManager.eventNames.forEach((eventName) => {
      this.api[eventName].removeListener(this.onTreeChange);
    });

    this.isGlobalListenerSetUp = false;
  };
}
