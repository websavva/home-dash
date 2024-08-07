import { describe, it, expect, vi, afterEach } from 'vitest';

import { createBookmarkManager } from './index';

const MockedNativeBookmarkManager = vi.hoisted(() => ({
  create: vi.fn(() => ({
    isNative: true,
  })),
}));

const MockedLocalStorageBookmarkManager = vi.hoisted(() => ({
  create: vi.fn(() => ({
    isLocalStorage: true,
  })),
}));

vi.mock('./native', () => ({
  NativeBookmarkManager: MockedNativeBookmarkManager,
}));

vi.mock('./local-storage', () => ({
  LocalStorageBookmarkManager: MockedLocalStorageBookmarkManager,
}));

describe('BookmarkManager factory', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('should create LocalStorageBookmarkManager in non-production enviroment', async () => {
    vi.stubEnv('PROD', false);

    const mockedBookmarkManager = await createBookmarkManager();

    expect(mockedBookmarkManager).toEqual({
      isLocalStorage: true,
    });
    expect(MockedLocalStorageBookmarkManager.create).toHaveBeenCalledOnce();
    expect(MockedNativeBookmarkManager.create).not.toHaveBeenCalledOnce();
  });

  it('should create NativeBookmarkManager in production enviroment', async () => {
    vi.stubEnv('PROD', true);

    const mockedBookmarkManager = await createBookmarkManager();

    expect(mockedBookmarkManager).toEqual({
      isNative: true,
    });
    expect(MockedNativeBookmarkManager.create).toHaveBeenCalledOnce();
    expect(MockedLocalStorageBookmarkManager.create).not.toHaveBeenCalledOnce();
  });
});
