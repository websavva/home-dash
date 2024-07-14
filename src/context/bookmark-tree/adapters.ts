
import type { BookmarkTreeContextSchema, BookmarkTreeNode } from './types'

export abstract class BookmarkTreeManagerAdapter {
    public _tree: BookmarkTreeNode | null = null;

    get tree() {
        return this._tree
    }

    abstract addBookmark: BookmarkTreeContextSchema['addBookmark'];
    abstract removeBookmark: BookmarkTreeContextSchema['removeBookmark'];
    abstract removeFolder: BookmarkTreeContextSchema['removeFolder'];
}