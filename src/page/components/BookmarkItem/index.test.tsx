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

import { useBookmarkHandlers } from '#page/hooks/use-bookmark-handlers';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

import BookmarkItem from './index';
vi.mock('#page/hooks/use-bookmark-handlers');
vi.mock('#page/hooks/use-bookmark-manager');

describe('BookmarkItem Component', () => {
  const mockMoveBookmark = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnRemove = vi.fn();

  const bookmark = {
    id: 'b1',
    url: 'https://example.com',
    title: 'Example Bookmark',
    parentId: 'f1',
    index: 0,
  };

  beforeEach(() => {
    (useBookmarkHandlers as Mock).mockReturnValue({
      onEdit: mockOnEdit,
      onRemove: mockOnRemove,
    });
    (useBookmarkManager as Mock).mockReturnValue({
      moveBookmark: mockMoveBookmark,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the bookmark item with title and favicon', () => {
    render(<BookmarkItem bookmark={bookmark} />);

    expect(screen.getByText('Example Bookmark')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('handles drag and drop to reorder bookmarks', async () => {
    render(<BookmarkItem bookmark={bookmark} />);

    const bookmarkItem = screen.getByText('Example Bookmark');
    fireEvent.dragStart(bookmarkItem, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => 'b2') },
    });

    fireEvent.drop(bookmarkItem, {
      dataTransfer: {
        getData: vi.fn((type) => (type === 'bookmark' ? 'b2' : '')),
      },
    });

    expect(mockMoveBookmark).toHaveBeenCalledWith('b2', {
      parentId: 'f1',
      index: 0,
    });
  });

  it('does not move bookmark if dropped on itself', async () => {
    render(<BookmarkItem bookmark={bookmark} />);

    const bookmarkItem = screen.getByText('Example Bookmark');
    fireEvent.dragStart(bookmarkItem, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn(() => 'b1') },
    });

    fireEvent.drop(bookmarkItem, {
      dataTransfer: {
        getData: vi.fn((type) => (type === 'bookmark' ? 'b1' : '')),
      },
    });

    expect(mockMoveBookmark).not.toHaveBeenCalled();
  });
});
