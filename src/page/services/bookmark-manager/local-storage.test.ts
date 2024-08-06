import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { getDefaultBookmarkTree, BOOKMARK_TREE_ID } from './config';
import { LocalStorageBookmarkManager } from './local-storage';

describe('LocalStorageBookmarkManager', () => {
  let bookmarkManager: LocalStorageBookmarkManager;

  const getFolderById = (id: string) => {
    return bookmarkManager.tree.children!.find((folder) => folder.id === id);
  };

  const getBookmarkById = (id: string) => {
    for (const folder of bookmarkManager.tree.children!) {
      const foundBookmark = folder.children!.find(
        (bookmark) => bookmark.id === id,
      );

      if (foundBookmark) return foundBookmark;
    }
  };

  beforeEach(() => {
    localStorage.clear();
    bookmarkManager = LocalStorageBookmarkManager.create();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with a default bookmark tree if localStorage is empty', () => {
    expect(bookmarkManager.tree).toEqual(getDefaultBookmarkTree());
    expect(JSON.parse(localStorage.getItem(BOOKMARK_TREE_ID)!)).toEqual(
      getDefaultBookmarkTree(),
    );
  });

  it('should add a new folder', async () => {
    const title = 'New Folder';
    const newFolder = await bookmarkManager.addFolder(title);

    expect(newFolder).toBeDefined();
    expect(newFolder.title).toBe(title);
    expect(newFolder).toHaveProperty('id');
    expect(newFolder).toHaveProperty('children', []);
    expect(bookmarkManager.tree.children).toContainEqual(newFolder);
  });

  it('should add a new bookmark', async () => {
    const folder = await bookmarkManager.addFolder('Folder');
    const bookmarkProps = {
      title: 'Bookmark',
      url: 'https://example.com',
      parentId: folder.id,
    };

    const newBookmark = await bookmarkManager.addBookmark(bookmarkProps);

    expect(newBookmark).toBeDefined();
    expect(newBookmark.title).toBe(bookmarkProps.title);
    expect(newBookmark.url).toBe(bookmarkProps.url);
    expect(newBookmark.parentId).toBe(folder.id);
    expect(newBookmark).toHaveProperty('id');
    expect(newBookmark).not.toHaveProperty('children');
    expect(folder.children).toContainEqual(newBookmark);
  });

  it('should remove a folder', async () => {
    const folder = await bookmarkManager.addFolder('Folder');
    const result = await bookmarkManager.removeFolder(folder.id);

    expect(result).toBe(true);
    expect(bookmarkManager.tree.children).not.toContainEqual(folder);
  });

  it('should remove a bookmark', async () => {
    const folder = await bookmarkManager.addFolder('Folder');
    const bookmark = await bookmarkManager.addBookmark({
      title: 'Bookmark',
      url: 'https://example.com',
      parentId: folder.id,
    });

    const result = await bookmarkManager.removeBookmark(bookmark.id);

    expect(result).toBe(true);
    expect(folder.children).not.toContainEqual(bookmark);
  });

  it('should update a folder title', async () => {
    const folder = await bookmarkManager.addFolder('Folder');
    const newTitle = 'Updated Folder';
    const result = await bookmarkManager.updateFolder(folder.id, newTitle);

    const updatedFolder = getFolderById(folder.id);

    expect(result).toBe(true);
    expect(updatedFolder?.title).toBe(newTitle);
  });

  it('should update a bookmark', async () => {
    const folder = await bookmarkManager.addFolder('Folder');
    const bookmark = await bookmarkManager.addBookmark({
      title: 'Bookmark',
      url: 'https://example.com',
      parentId: folder.id,
    });

    const updatedProps = {
      id: bookmark.id,
      title: 'Updated Bookmark',
      url: 'https://updated-example.com',
    };

    const result = await bookmarkManager.updateBookmark(
      folder.id,
      updatedProps,
    );

    const updatedBookmark = getBookmarkById(updatedProps.id)!;

    expect(result).toBe(true);
    expect(updatedBookmark.title).toBe(updatedProps.title);
    expect(updatedBookmark.url).toBe(updatedProps.url);
    expect(updatedBookmark.id).toBe(updatedProps.id);
    expect(updatedBookmark.parentId).toBe(bookmark.parentId);
  });

  it('should move a folder', async () => {
    const folder1 = await bookmarkManager.addFolder('Folder 1');
    const folder2 = await bookmarkManager.addFolder('Folder 2');
    const folder3 = await bookmarkManager.addFolder('Folder 3');

    const result = await bookmarkManager.moveFolder(folder1.id, 1);

    const expectedReorderFolders = [
      getFolderById(folder2.id),
      getFolderById(folder1.id),
      getFolderById(folder3.id),
    ];

    expect(result).toBe(true);
    expect(bookmarkManager.tree.children).toEqual(expectedReorderFolders);
  });

  it('should move a bookmark within the same folder', async () => {
    const folder = await bookmarkManager.addFolder('Folder');

    const bookmark1 = await bookmarkManager.addBookmark({
      title: 'Bookmark 1',
      url: 'https://example1.com',
      parentId: folder.id,
    });

    const bookmark2 = await bookmarkManager.addBookmark({
      title: 'Bookmark 2',
      url: 'https://example2.com',
      parentId: folder.id,
    });

    const bookmark3 = await bookmarkManager.addBookmark({
      title: 'Bookmark 3',
      url: 'https://example3.com',
      parentId: folder.id,
    });

    const result = await bookmarkManager.moveBookmark(bookmark1.id, {
      parentId: folder.id,
      index: 2,
    });

    const expectedReorderedBookmarks = [
      getBookmarkById(bookmark2.id),
      getBookmarkById(bookmark3.id),
      getBookmarkById(bookmark1.id),
    ];

    expect(result).toBe(true);
    expect(getFolderById(folder.id)!.children).toEqual(
      expectedReorderedBookmarks,
    );
  });

  it('should move a bookmark to another folder', async () => {
    const folder1 = await bookmarkManager.addFolder('Folder 1');
    const folder2 = await bookmarkManager.addFolder('Folder 2');
    const bookmark = await bookmarkManager.addBookmark({
      title: 'Bookmark',
      url: 'https://example.com',
      parentId: folder1.id,
    });

    const result = await bookmarkManager.moveBookmark(bookmark.id, {
      parentId: folder2.id,
      index: 0,
    });

    expect(result).toBe(true);
    expect(getFolderById(folder1.id)).not.toContainEqual(bookmark);
    expect(getFolderById(folder2.id)!.children![0]).toBe(bookmark);
  });
});
