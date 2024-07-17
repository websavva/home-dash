import { BookmarkManager } from "./manager";
import type {
  CreateBookmarkProps,
  Bookmark,
  Folder,
  BookmarkTreeNode,
  OnBookmarkTreeChangeCallback,
  MoveBookmarkArgs,
} from "./types";

import { BOOKMARK_TREE_ID } from "./config";

export class LocalStorageBookmarkManager extends BookmarkManager {
  constructor() {
    super();

    const stringifiedTree = localStorage.getItem(BOOKMARK_TREE_ID);

    let parsedTree = this.parseStringifiedTree(stringifiedTree);

    if (!parsedTree) {
      parsedTree = this.createBookmarkTree();

      this.updateTreeInLocalStorage(parsedTree);
    }

    this._tree = parsedTree;
  }

  private isListenerSetUp: boolean = false;

  private onChangeCallbacks: OnBookmarkTreeChangeCallback[] = [];

  private createBookmarkTree(): BookmarkTreeNode {
    return {
      id: BOOKMARK_TREE_ID,
      children: [],
      title: "__ROOT__",
    };
  }

  generateId = () => crypto.randomUUID();

  private runOnChangeCallbacks(updatedTree: BookmarkTreeNode) {
    this.onChangeCallbacks.forEach((callback) => {
      callback(updatedTree);
    });
  }

  private updateTreeInLocalStorage(updatedTree: BookmarkTreeNode = this._tree) {
    localStorage.setItem(BOOKMARK_TREE_ID, JSON.stringify(updatedTree));
  }

  private onLocalStorageHandler = ({ newValue, key }: StorageEvent) => {
    const parsedUpdatedTree = this.parseStringifiedTree(newValue);

    if (key !== BOOKMARK_TREE_ID || !parsedUpdatedTree) return;

    this.runOnChangeCallbacks(parsedUpdatedTree);
  };

  public setUpLocalStorageListener() {
    window.addEventListener("storage", this.onLocalStorageHandler);

    this.isListenerSetUp = true;
  }

  public removeLocalStorageListener() {
    window.removeEventListener("storage", this.onLocalStorageHandler);

    this.isListenerSetUp = false;
  }

  private parseStringifiedTree(stringifiedTree: string | null) {
    if (!stringifiedTree) return null;

    try {
      return JSON.parse(stringifiedTree) as BookmarkTreeNode;
    } catch {
      // TODO error handling

      return null;
    }
  }

  public addFolder = async (title: string) => {
    const newFolder: Folder = {
      id: this.generateId(),
      index: this._tree!.children!.length,
      title,
      children: [],
    };

    this._tree!.children!.push(newFolder);

    this.updateTreeInLocalStorage();

    return newFolder;
  };

  addBookmark = async ({ title, url, parentId }: CreateBookmarkProps) => {
    const newBookmark: Bookmark = {
      id: this.generateId(),
      parentId,
      title,
      url,
    };

    const parentFolder = this._tree!.children!.find(({ id }) => {
      return parentId === id;
    });

    if (!parentFolder)
      throw new Error(`No parent folder with id ${parentId} was found`);

    newBookmark.index = parentFolder.children!.length;

    parentFolder.children!.push(newBookmark);

    this.updateTreeInLocalStorage();

    return newBookmark;
  };

  removeFolder = async (folderId: string): Promise<boolean> => {
    this._tree!.children = this._tree!.children!.filter(
      ({ id }) => folderId !== id
    );

    this.updateTreeInLocalStorage();

    return true;
  };

  removeBookmark = async (bookmarkId: string): Promise<boolean> => {
    for (const folder of this._tree!.children!) {
      const bookmarkIndex = folder.children!.findIndex(
        ({ id }) => bookmarkId === id
      );

      if (~bookmarkIndex) {
        folder.children!.splice(bookmarkIndex, 1);

        folder.children!.forEach((bookmark, index) => {
          bookmark.index = index;
        });

        this.updateTreeInLocalStorage();
      }
    }

    return true;
  };

  private updateIndecesInList(list: BookmarkTreeNode[]) {
    list.forEach((currentItem, index) => (currentItem.index = index));
  }

  private insertItemIntoList(
    list: BookmarkTreeNode[],
    item: BookmarkTreeNode,
    toIndex: number
  ) {
    list.splice(toIndex, 0, item);

    this.updateIndecesInList(list);
  }

  private removeItemFromList(list: BookmarkTreeNode[], fromIndex: number) {
    list.splice(fromIndex, 1);

    this.updateIndecesInList(list);
  }

  private moveItemWithinList(
    list: BookmarkTreeNode[],
    fromIndex: number,
    toIndex: number
  ) {
    const item = list[fromIndex];

    this.removeItemFromList(list, fromIndex);

    this.insertItemIntoList(list, item, toIndex);
  }

  public moveFolder = async (folderId: string, toIndex: number) => {
    const fromIndex = this._tree.children!.findIndex(
      ({ id }) => id === folderId
    );

    if (!~fromIndex)
      throw new Error(`No folder with ${folderId} id was found !`);

    this.moveItemWithinList(this._tree.children!, fromIndex, toIndex);

    this.updateTreeInLocalStorage();

    return true;
  };

  public moveBookmark = async (
    bookmarkId: string,
    { parentId: toFolderId, index: toIndex }: MoveBookmarkArgs
  ) => {
    let fromFolder: BookmarkTreeNode | undefined;
    let fromIndex: number;

    // looking for bookmark
    for (const folder of this._tree.children!) {
      const currentFromIndex = folder.children!.findIndex(({ id }) => {
        return bookmarkId === id;
      });

      if (~currentFromIndex) {
        fromFolder = folder;
        fromIndex = currentFromIndex;

        break;
      }
    }

    if (!fromFolder)
      throw new Error(
        `No folder with for a bookmark with id ${bookmarkId} was found !`
      );

    if (!toFolderId) {
      this.moveItemWithinList(fromFolder.children!, fromIndex!, toIndex);
    } else {
      const toFolder = this.tree.children!.find(({ id }) => toFolderId === id);

      if (!toFolder)
        throw new Error(`No folder with with id ${toFolderId} was found !`);

      const bookmark = fromFolder.children![fromIndex!];

      this.removeItemFromList(fromFolder.children!, fromIndex!);

      this.insertItemIntoList(toFolder.children!, bookmark, toIndex);
    }

    this.updateTreeInLocalStorage();

    return true;
  };

  public onChange = (callback: OnBookmarkTreeChangeCallback) => {
    if (!this.isListenerSetUp) this.setUpLocalStorageListener();

    this.onChangeCallbacks.push(callback);

    return () => {
      this.onChangeCallbacks = this.onChangeCallbacks.filter(
        (currentCallback) => currentCallback !== callback
      );

      if (!this.onChangeCallbacks.length) this.removeLocalStorageListener();
    };
  };
}
