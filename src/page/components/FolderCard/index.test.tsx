import { render, screen, fireEvent } from '@testing-library/react';
import {
  vi,
  describe,
  beforeEach,
  type Mock,
  afterEach,
  it,
  expect,
} from 'vitest';

import { useFolderHandlers } from '#page/hooks/use-folder-handlers';
import { useBookmarkHandlers } from '#page/hooks/use-bookmark-handlers';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import type { Folder, Bookmark } from '#page/services/bookmark-manager';

import FolderCard from './index';

vi.mock('#page/hooks/use-folder-handlers');
vi.mock('#page/hooks/use-bookmark-handlers');
vi.mock('#page/hooks/use-bookmark-manager');
vi.mock('../BookmarkItem', () => ({
  default: ({ bookmark }: { bookmark: Bookmark }) => (
    <div data-testid={`bookmark-${bookmark.id}`}>{bookmark.title}</div>
  ),
}));

describe('FolderCard Component', () => {
  const mockMoveFolder = vi.fn();
  const mockMoveBookmark = vi.fn();
  const mockOnRemove = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnAddBookmark = vi.fn();

  const folder: Folder = {
    id: '1',
    title: 'Test Folder',
    children: [
      { id: 'b1', title: 'Bookmark 1', url: 'https://b2.com' },
      { id: 'b2', title: 'Bookmark 2', url: 'https://b1.com' },
    ],
    index: 0,
  };

  beforeEach(() => {
    (useFolderHandlers as Mock).mockReturnValue({
      onRemove: mockOnRemove,
      onEdit: mockOnEdit,
    });
    (useBookmarkHandlers as Mock).mockReturnValue({
      onAdd: mockOnAddBookmark,
    });
    (useBookmarkManager as Mock).mockReturnValue({
      moveFolder: mockMoveFolder,
      moveBookmark: mockMoveBookmark,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the folder card with title and bookmarks', () => {
    render(<FolderCard folder={folder} />);

    expect(screen.queryByTestId('folder-title')).toHaveTextContent(
      'Test Folder',
    );
    expect(screen.queryByTestId('bookmark-b1')).toHaveTextContent('Bookmark 1');
    expect(screen.queryByTestId('bookmark-b2')).toHaveTextContent('Bookmark 2');
  });

  it('allows dragging and dropping bookmarks between folders', async () => {
    render(<FolderCard folder={folder} />);

    const folderCard = screen.getByText('Test Folder');
    fireEvent.dragStart(folderCard, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => 'b1') },
    });

    fireEvent.drop(folderCard, {
      dataTransfer: {
        getData: vi.fn((type) => (type === 'bookmark' ? 'b1' : '')),
      },
    });

    expect(mockMoveBookmark).toHaveBeenCalledWith('b1', {
      parentId: '1',
      index: 2,
    });
  });

  it('allows dragging and dropping folders to reorder', async () => {
    render(<FolderCard folder={folder} />);

    const folderCard = screen.getByText('Test Folder');
    fireEvent.dragStart(folderCard, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => '2') },
    });

    fireEvent.drop(folderCard, {
      dataTransfer: {
        getData: vi.fn((type) => (type === 'folder' ? '2' : '')),
      },
    });

    expect(mockMoveFolder).toHaveBeenCalledWith('2', 0);
  });

  it('does not trigger any move if dropped on itself', async () => {
    render(<FolderCard folder={folder} />);

    const folderCard = screen.getByText('Test Folder');
    fireEvent.dragStart(folderCard, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => '1') },
    });

    fireEvent.drop(folderCard, {
      dataTransfer: {
        getData: vi.fn((type) => (type === 'folder' ? '1' : '')),
      },
    });

    expect(mockMoveFolder).not.toHaveBeenCalled();
  });
});
