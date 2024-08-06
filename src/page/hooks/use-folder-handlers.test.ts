import { describe, it, vi, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useFolderHandlers } from './use-folder-handlers';

// mocking external hooks and components
const MockedFolderModal = vi.hoisted(() => () => 'Mocked Folder Modal');

const mockedBookmarkContextValue = vi.hoisted(() => ({
  addFolder: vi.fn(),
  updateFolder: vi.fn(),
  removeFolder: vi.fn(),
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

vi.mock('#page/components/Modals/FolderModal', () => ({
  default: MockedFolderModal,
}));

describe('useFolderHandlers hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call removeFolder when onRemove is called', async () => {
    const { result } = renderHook(() => useFolderHandlers());

    await act(() => {
      return result.current.onRemove({
        id: 'folder-id',
        title: 'title',
        children: [],
      });
    });

    expect(mockedBookmarkContextValue.removeFolder).toHaveBeenCalledOnce();
    expect(mockedBookmarkContextValue.removeFolder).toHaveBeenCalledWith(
      'folder-id',
    );
  });

  describe('should call onAdd properly', () => {
    it('when form is invalid', async () => {
      mockedModalsContextValue.open.mockResolvedValue(null);

      const { result } = renderHook(() => useFolderHandlers());

      await act(() => {
        return result.current.onAdd();
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedFolderModal,
        undefined,
      );

      expect(mockedBookmarkContextValue.addFolder).not.toHaveBeenCalled();
    });

    it('when form is valid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: 'valid-title',
      });

      const { result } = renderHook(() => useFolderHandlers());

      await act(() => {
        return result.current.onAdd();
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedFolderModal,
        undefined,
      );

      expect(mockedBookmarkContextValue.addFolder).toHaveBeenCalledOnce();
      expect(mockedBookmarkContextValue.addFolder).toHaveBeenCalledWith(
        'valid-title',
      );
    });
  });

  describe('should call onEdit properly', () => {
    const dummyFolder = {
      id: 'folder-id',
      title: 'folder-title',
      children: [],
    };

    it('when form is invalid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: '',
      });

      const { result } = renderHook(() => useFolderHandlers());

      await act(() => {
        return result.current.onEdit(dummyFolder);
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedFolderModal,
        {
          buttonLabel: 'Save',
          initialTitle: dummyFolder.title,
        },
      );

      expect(mockedBookmarkContextValue.updateFolder).not.toHaveBeenCalled();
    });

    it('when form is valid', async () => {
      mockedModalsContextValue.open.mockResolvedValue({
        title: 'valid-edited-title',
      });

      const { result } = renderHook(() => useFolderHandlers());

      await act(() => {
        return result.current.onEdit(dummyFolder);
      });

      expect(mockedModalsContextValue.open).toHaveBeenCalledOnce();
      expect(mockedModalsContextValue.open).toHaveBeenCalledWith(
        MockedFolderModal,
        {
          buttonLabel: 'Save',
          initialTitle: dummyFolder.title,
        },
      );

      expect(mockedBookmarkContextValue.updateFolder).toHaveBeenCalledOnce();
      expect(mockedBookmarkContextValue.updateFolder).toHaveBeenCalledWith(
        dummyFolder.id,
        'valid-edited-title',
      );
    });
  });
});
