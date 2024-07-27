export * from './manager';
export * from './config';
export * from './local-storage';
export * from './types';
export * from './native';

import { LocalStorageBookmarkManager } from './local-storage';
import { NativeBookmarkManager } from './native';
import type { BookmarkManager } from './manager';

export const createBookmarkManager = () => {
  const isProd = import.meta.env.PROD;

  const BookmarkManagerConstructor = isProd
    ? NativeBookmarkManager
    : LocalStorageBookmarkManager;

  return BookmarkManagerConstructor.create() as BookmarkManager;
};
