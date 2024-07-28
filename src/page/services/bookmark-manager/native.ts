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

  public static async getExistingTree() {
    const foundExistingTrees = await api.search({
      title: BOOKMARK_TREE_ID,
    });

    const doesTreeExist = foundExistingTrees.length > 0;

    if (doesTreeExist) {
      const [fullExistingTree] = await api.getSubTree(foundExistingTrees[0].id);

      return fullExistingTree!;
    } else {
      return null;
    }
  }

  public static async ensureTree() {
    const existingTree = await NativeBookmarkManager.getExistingTree();

    if (existingTree) return existingTree;

    await api.create({
      title: BOOKMARK_TREE_ID,
    });

    return (await NativeBookmarkManager.getExistingTree())!;
  }

  public static async create() {
    const tree = await NativeBookmarkManager.ensureTree();

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
    return this.api.removeTree(folderId).then(() => true);
  };

  public moveFolder = (folderId: string, index: number) => {
    return this.api
      .move(folderId, {
        index,
        parentId: this.rootId,
      })
      .then(() => true);
  };

  public addBookmark = async (bookmarkProps: CreateBookmarkProps) => {
    const newBookmark = await this.api.create(bookmarkProps);

    return newBookmark as Bookmark;
  };

  public removeBookmark = (bookmarkId: string) => {
    return this.api.remove(bookmarkId).then(() => true);
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
    return this.api.update(bookmarkId, bookmarkProps).then(() => true);
  };

  protected onTreeChange = async () => {
    const updatedTree = await NativeBookmarkManager.getExistingTree();

    this.tree = updatedTree!;

    this.runOnChangeCallbacks(updatedTree!);
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
