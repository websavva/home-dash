import type { BookmarkTreeNode } from './types';

export const BOOKMARK_TREE_ID = '__HOME_DASH__';

export const getDefaultBookmarkTree = (): BookmarkTreeNode => ({
  id: BOOKMARK_TREE_ID,
  children: [],
  title: '__ROOT__',
});
