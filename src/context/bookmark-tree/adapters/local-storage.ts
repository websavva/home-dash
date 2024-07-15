import { BookmarkManager } from "./manager";
import type {
  CreateBookmarkProps,
  Bookmark,
  CreateFolderProps,
  Folder,
  BookmarkTreeNode,
} from "./types";

import { BOOKMARK_TREE_ID } from "./config";

export class LocalStorageBasedBookmarkManager extends BookmarkManager {
  constructor() {
    super();

    const stringifiedTree = localStorage.getItem(BOOKMARK_TREE_ID);

    if (stringifiedTree) {
      try {
        this._tree = JSON.parse(stringifiedTree);
      } catch {
        // error handling
      }
    }
  }

  generateId = () => crypto.randomUUID();

  async addFolder({ index, title }: CreateFolderProps) {
    const newFolder: Folder = {
      id: this.generateId(),
      index,
      title,
      children: [],
    };

    this._tree!.children!.splice(index, 0, newFolder);

    return newFolder;
  }
}
