import { BookmarkManager } from './manager';
import type {
  CreateBookmarkProps,
  Bookmark,
  Folder,
  BookmarkTreeNode,
  OnBookmarkTreeChangeCallback,
  MoveBookmarkArgs,
  UpdateBookmarkProps,
} from './types';

import { BOOKMARK_TREE_ID } from './config';

export class LocalStorageBookmarkManager extends BookmarkManager {
  constructor() {
    super();

    const stringifiedTree = localStorage.getItem(BOOKMARK_TREE_ID);

    let parsedTree = this.parseStringifiedTree(stringifiedTree);

    if (!parsedTree) {
      parsedTree = this.createBookmarkTree();

      this.updateTree(parsedTree);
    }

    this.tree = parsedTree;
  }

  private isListenerSetUp: boolean = false;

  private onChangeCallbacks: OnBookmarkTreeChangeCallback[] = [];

  private createBookmarkTree(): BookmarkTreeNode {
    return {
      id: BOOKMARK_TREE_ID,
      children: [],
      title: '__ROOT__',
    };
  }

  generateId = () => crypto.randomUUID();

  private runOnChangeCallbacks(updatedTree: BookmarkTreeNode) {
    this.onChangeCallbacks.forEach((callback) => {
      callback(updatedTree);
    });
  }

  private updateTree(updatedTree: BookmarkTreeNode = this.tree) {
    const copiedUpdatedTree = structuredClone(updatedTree);

    localStorage.setItem(BOOKMARK_TREE_ID, JSON.stringify(copiedUpdatedTree));

    this.runOnChangeCallbacks(copiedUpdatedTree);
  }

  private onLocalStorageHandler = ({ newValue, key }: StorageEvent) => {
    const parsedUpdatedTree = this.parseStringifiedTree(newValue);

    if (key !== BOOKMARK_TREE_ID || !parsedUpdatedTree) return;

    this.tree = parsedUpdatedTree;

    this.runOnChangeCallbacks(parsedUpdatedTree);
  };

  public setUpLocalStorageListener() {
    window.addEventListener('storage', this.onLocalStorageHandler);

    this.isListenerSetUp = true;
  }

  public removeLocalStorageListener() {
    window.removeEventListener('storage', this.onLocalStorageHandler);

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
      index: this.tree!.children!.length,
      title,
      children: [],
    };

    this.tree!.children!.push(newFolder);

    this.updateTree();

    return newFolder;
  };

  public addBookmark = async ({
    title,
    url,
    parentId,
  }: CreateBookmarkProps) => {
    const newBookmark: Bookmark = {
      id: this.generateId(),
      parentId,
      title,
      url,
    };

    const parentFolder = this.tree!.children!.find(({ id }) => {
      return parentId === id;
    });

    if (!parentFolder)
      throw new Error(`No parent folder with id ${parentId} was found`);

    newBookmark.index = parentFolder.children!.length;

    parentFolder.children!.push(newBookmark);

    this.updateTree();

    return newBookmark;
  };

  public removeFolder = async (folderId: string): Promise<boolean> => {
    this.tree!.children = this.tree!.children!.filter(
      ({ id }) => folderId !== id,
    );

    this.updateTree();

    return true;
  };

  public removeBookmark = async (bookmarkId: string): Promise<boolean> => {
    for (const folder of this.tree!.children!) {
      const bookmarkIndex = folder.children!.findIndex(
        ({ id }) => bookmarkId === id,
      );

      if (~bookmarkIndex) {
        folder.children!.splice(bookmarkIndex, 1);

        folder.children!.forEach((bookmark, index) => {
          bookmark.index = index;
        });

        this.updateTree();
      }
    }

    return true;
  };

  public updateFolder = async (folderId: string, title: string) => {
    this.tree.children = this.tree.children!.map((folder) => {
      if (folder.id !== folderId) return folder;

      return {
        ...folder,
        title,
      };
    });

    this.updateTree();

    return true;
  };

  public updateBookmark = async (
    folderId: string,
    { id: bookmarkId, ...updatedBookmarkFields }: UpdateBookmarkProps,
  ) => {
    const folder = this.tree.children!.find(({ id }) => id === folderId);

    if (!folder) throw new Error(`No folder with id ${folderId} was found !`);

    folder.children = folder.children?.map((bookmark) => {
      if (bookmark.id !== bookmarkId) return bookmark;

      return {
        ...bookmark,
        ...updatedBookmarkFields,
      };
    });

    this.updateTree();

    return true;
  };

  private updateIndecesInList(list: BookmarkTreeNode[]) {
    list.forEach((currentItem, index) => (currentItem.index = index));
  }

  private insertItemIntoList(
    list: BookmarkTreeNode[],
    item: BookmarkTreeNode,
    toIndex: number,
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
    toIndex: number,
  ) {
    const item = list[fromIndex];

    this.removeItemFromList(list, fromIndex);

    this.insertItemIntoList(list, item, toIndex);
  }

  public moveFolder = async (folderId: string, toIndex: number) => {
    const fromIndex = this.tree.children!.findIndex(
      ({ id }) => id === folderId,
    );

    if (!~fromIndex)
      throw new Error(`No folder with ${folderId} id was found !`);

    this.moveItemWithinList(this.tree.children!, fromIndex, toIndex);

    this.updateTree();

    return true;
  };

  public moveBookmark = async (
    bookmarkId: string,
    { parentId: toFolderId, index: toIndex }: MoveBookmarkArgs,
  ) => {
    let fromFolder: BookmarkTreeNode | undefined;
    let fromIndex: number;

    // looking for bookmark
    for (const folder of this.tree.children!) {
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
        `No folder with for a bookmark with id ${bookmarkId} was found !`,
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

    this.updateTree();

    return true;
  };

  public onChange = (callback: OnBookmarkTreeChangeCallback) => {
    if (!this.isListenerSetUp) this.setUpLocalStorageListener();

    this.onChangeCallbacks.push(callback);

    return () => {
      this.onChangeCallbacks = this.onChangeCallbacks.filter(
        (currentCallback) => currentCallback !== callback,
      );

      if (!this.onChangeCallbacks.length) this.removeLocalStorageListener();
    };
  };
}
