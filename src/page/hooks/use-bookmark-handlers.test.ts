import { describe, it, vi, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useBookmarkHandlers } from './use-bookmark-handlers';

// mocking external hooks and components
const MockedBookmarkModal = vi.hoisted(() => () => 'Mocked Bookmark Modal');

const mockedBookmarkContextValue = vi.hoisted(() => ({
  addBookmark: vi.fn(),
  updateBookmark: vi.fn(),
  removeBookmark: vi.fn(),
}));

const mockedModalsContextValue = vi.hoisted(() => ({
  open: vi.fn(),
}));

vi.mock('#page/hooks/use-bookmark-manager', () => ({
  useBookmarkManager: () => mockedBookmarkContextValue,
}));

vi.mock('#page/hooks/use-modals', () => ({
  useModals: () => mockedModalsContextValue,
}));

vi.mock('#page/components/Modals/BookmarkModal', () => ({
  default: MockedBookmarkModal,
}));

describe('useBookmarkHandlers hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call removeBookmark when onRemove is called', async () => {
    const { result } = renderHook(() => useBookmarkHandlers());

    await act(() => {
      return result.current.onRemove({
        id: 'bookmark-id',
        title: 'title',
        url: 'url',
      });
    });

    expect(mockedBookmarkContextValue.removeBookmark).toHaveBeenCalledOnce();
    expect(mockedBookmarkContextValue.removeBookmark).toHaveBeenCalledWith(
      'bookmark-id',
    );
  });

  describe('should call onAdd properly', () => {
    it('when form is invalid', async () => {
      mockedModalsContextValue.open.mockResolvedValue(null);

      const { result } = renderHook(() => useBookmarkHandlers());

      await act(() => {
        return result.current.onAdd('parent-folder-id');
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedBookmarkModal,
        undefined,
      );

      expect(mockedBookmarkContextValue.addBookmark).not.toHaveBeenCalled();
    });

    it('when form is valid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: 'valid-title',
        url: 'https://foo.com',
      });

      const { result } = renderHook(() => useBookmarkHandlers());

      await act(() => {
        return result.current.onAdd('parent-id');
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedBookmarkModal,
        undefined,
      );

      expect(mockedBookmarkContextValue.addBookmark).toHaveBeenCalledOnce();
      expect(mockedBookmarkContextValue.addBookmark).toHaveBeenCalledWith({
        title: 'valid-title',
        url: 'https://foo.com',
        parentId: 'parent-id',
      });
    });
  });

  describe('should call onEdit properly', () => {
    const dummyBookmark = {
      id: 'bookmark-id',
      title: 'bookmark-title',
      url: 'bookmark-url',
      parentId: 'bookmark-parent-id',
    };

    it('when form is invalid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: '',
        url: 'bookmark-url',
      });

      const { result } = renderHook(() => useBookmarkHandlers());

      await act(() => {
        return result.current.onEdit(dummyBookmark);
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedBookmarkModal,
        {
          buttonLabel: 'Save',
          initialForm: {
            title: dummyBookmark.title,
            url: dummyBookmark.url,
          },
        },
      );

      expect(mockedBookmarkContextValue.updateBookmark).not.toHaveBeenCalled();
    });

    it('when form is valid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: 'valid-edited-title',
        url: 'valid-edited-url',
      });

      const { result } = renderHook(() => useBookmarkHandlers());

      await act(() => {
        return result.current.onEdit(dummyBookmark);
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedBookmarkModal,
        {
          buttonLabel: 'Save',
          initialForm: {
            title: dummyBookmark.title,
            url: dummyBookmark.url,
          },
        },
      );

      expect(mockedBookmarkContextValue.updateBookmark).toHaveBeenCalledOnce();
      expect(mockedBookmarkContextValue.updateBookmark).toHaveBeenCalledWith(
        dummyBookmark.parentId,
        {
          id: dummyBookmark.id,
          title: 'valid-edited-title',
          url: 'valid-edited-url',
        },
      );
    });
  });
});
