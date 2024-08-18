import { describe, it, expect, beforeEach, vi } from 'vitest';

import { BOOKMARK_TREE_ID } from './config';
import type { BookmarkTreeNode, CreateBookmarkProps } from './types';

const mockApi = {
  search: vi.fn(),
  getSubTree: vi.fn(),
  create: vi.fn(),
  removeTree: vi.fn(),
  move: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
  onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
  onChildrenReordered: { addListener: vi.fn(), removeListener: vi.fn() },
  onCreated: { addListener: vi.fn(), removeListener: vi.fn() },
  onRemoved: { addListener: vi.fn(), removeListener: vi.fn() },
  onMoved: { addListener: vi.fn(), removeListener: vi.fn() },
};

vi.stubGlobal('chrome', { bookmarks: mockApi });

describe('NativeBookmarkManager', async () => {
  const { NativeBookmarkManager } = await import('./native');

  let bookmarkManager: InstanceType<typeof NativeBookmarkManager>;
  const mockTree: BookmarkTreeNode = {
    id: '1',
    title: BOOKMARK_TREE_ID,
    children: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.search.mockResolvedValue([mockTree]);
    mockApi.create.mockResolvedValue({ id: '1', title: BOOKMARK_TREE_ID });
    mockApi.getSubTree.mockResolvedValue([mockTree]);
  });

  it('should ensure tree on creation', async () => {
    mockApi.search.mockResolvedValueOnce([]);
    mockApi.search.mockResolvedValueOnce([mockTree]);

    bookmarkManager = await NativeBookmarkManager.create();

    expect(mockApi.search).toHaveBeenCalledWith({ title: BOOKMARK_TREE_ID });
    expect(mockApi.create).toHaveBeenCalledWith({ title: BOOKMARK_TREE_ID });
    expect(mockApi.getSubTree).toHaveBeenCalledWith('1');
    expect(bookmarkManager.tree).toEqual(mockTree);
  });

  it('should add a new folder', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    const newFolder = { id: '2', title: 'New Folder', parentId: '1' };
    mockApi.create.mockResolvedValue(newFolder);

    const folder = await bookmarkManager.addFolder('New Folder');

    expect(mockApi.create).toHaveBeenCalledWith({
      parentId: '1',
      title: 'New Folder',
    });
    expect(folder).toEqual(newFolder);
  });

  it('should add a new bookmark', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    const bookmarkProps: CreateBookmarkProps = {
      title: 'New Bookmark',
      url: 'https://example.com',
      parentId: '1',
    };
    const newBookmark = { id: '2', ...bookmarkProps };
    mockApi.create.mockResolvedValue(newBookmark);

    const bookmark = await bookmarkManager.addBookmark(bookmarkProps);

    expect(mockApi.create).toHaveBeenCalledWith(bookmarkProps);
    expect(bookmark).toEqual(newBookmark);
  });

  it('should remove a folder', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    mockApi.removeTree.mockResolvedValue({});

    const result = await bookmarkManager.removeFolder('2');

    expect(mockApi.removeTree).toHaveBeenCalledWith('2');
    expect(result).toBe(true);
  });

  it('should remove a bookmark', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    mockApi.remove.mockResolvedValue({});

    const result = await bookmarkManager.removeBookmark('2');

    expect(mockApi.remove).toHaveBeenCalledWith('2');
    expect(result).toBe(true);
  });

  it('should update a folder title', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    mockApi.update.mockResolvedValue({ id: '2', title: 'Updated Folder' });

    const result = await bookmarkManager.updateFolder('2', 'Updated Folder');

    expect(mockApi.update).toHaveBeenCalledWith('2', {
      title: 'Updated Folder',
    });
    expect(result).toBe(true);
  });

  it('should update a bookmark', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    const updatedProps = {
      id: '2',
      title: 'Updated Bookmark',
      url: 'https://updated-example.com',
    };
    mockApi.update.mockResolvedValue(updatedProps);

    const result = await bookmarkManager.updateBookmark('1', updatedProps);

    expect(mockApi.update).toHaveBeenCalledWith('2', {
      title: updatedProps.title,
      url: updatedProps.url,
    });
    expect(result).toBe(true);
  });

  it('should move a folder', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    mockApi.move.mockResolvedValue({ id: '2' });

    const result = await bookmarkManager.moveFolder('2', 1);

    expect(mockApi.move).toHaveBeenCalledWith('2', { index: 1, parentId: '1' });
    expect(result).toBe(true);
  });

  it('should move a bookmark', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    const moveArgs = { parentId: '1', index: 1 };
    mockApi.move.mockResolvedValue({ id: '2' });

    const result = await bookmarkManager.moveBookmark('2', moveArgs);

    expect(mockApi.move).toHaveBeenCalledWith('2', moveArgs);
    expect(result).toBe(true);
  });

  it('should set up global listener', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    bookmarkManager.setUpGlobalListener();

    expect(mockApi.onChanged.addListener).toHaveBeenCalled();
    expect(mockApi.onChildrenReordered.addListener).toHaveBeenCalled();
    expect(mockApi.onCreated.addListener).toHaveBeenCalled();
    expect(mockApi.onRemoved.addListener).toHaveBeenCalled();
    expect(mockApi.onMoved.addListener).toHaveBeenCalled();
  });

  it('should remove global listener', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    bookmarkManager.setUpGlobalListener();
    bookmarkManager.removeGlobalListener();

    expect(mockApi.onChanged.removeListener).toHaveBeenCalled();
    expect(mockApi.onChildrenReordered.removeListener).toHaveBeenCalled();
    expect(mockApi.onCreated.removeListener).toHaveBeenCalled();
    expect(mockApi.onRemoved.removeListener).toHaveBeenCalled();
    expect(mockApi.onMoved.removeListener).toHaveBeenCalled();
  });

  it('should call onChange callbacks on tree change', async () => {
    bookmarkManager = await NativeBookmarkManager.create();
    const mockCallback = vi.fn();
    bookmarkManager.onChange(mockCallback);

    await bookmarkManager.onTreeChange();

    expect(mockCallback).toHaveBeenCalledWith(mockTree);
  });
});
