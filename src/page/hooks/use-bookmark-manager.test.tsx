import type { PropsWithChildren } from 'react';
import { describe, it, vi, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
  BookmarkManagerContext,
  type BookmarkManagerContextSchema,
} from '#page/context/bookmark-manager';

import { useBookmarkManager } from './use-bookmark-manager';

describe('useBookmarkManager hook', () => {
  const mockContextValue = {
    bookmarks: [],
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
  } as unknown as BookmarkManagerContextSchema;

  const wrapper = ({ children }: PropsWithChildren) => (
    <BookmarkManagerContext.Provider value={mockContextValue}>
      {children}
    </BookmarkManagerContext.Provider>
  );

  it('should return context value', () => {
    const { result } = renderHook(() => useBookmarkManager(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });

  it('should call addBookmark function from context', () => {
    const { result } = renderHook(() => useBookmarkManager(), { wrapper });

    const bookmarkProps = {
      title: 'new',
      url: 'https://foo.com',
      parentId: 'parent',
    };

    result.current.addBookmark(bookmarkProps);
    expect(mockContextValue.addBookmark).toHaveBeenCalledWith(bookmarkProps);
  });

  it('should call removeBookmark function from context', () => {
    const { result } = renderHook(() => useBookmarkManager(), { wrapper });

    result.current.removeBookmark('bookmarkToRemove');
    expect(mockContextValue.removeBookmark).toHaveBeenCalledWith(
      'bookmarkToRemove',
    );
  });
});
