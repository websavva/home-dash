import { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, afterEach } from 'vitest';

import {
  BookmarkManagerContext,
  BookmarkManagerContextProvider,
} from './index';

const mockedCreateBookmarkManager = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    onChange: () => {},
    tree: { title: 'root' },
  }),
);

// Mock the bookmark manager functions
vi.mock('#page/services/bookmark-manager', () => ({
  createBookmarkManager: mockedCreateBookmarkManager,
  getDefaultBookmarkTree: vi.fn().mockReturnValue({ title: 'root' }),
}));

describe('BookmarkManagerContextProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default context values', () => {
    const TestComponent = () => {
      const context = useContext(BookmarkManagerContext);

      return (
        <div>
          <div data-testid="isLoaded">{context.isLoaded.toString()}</div>
          <div data-testid="tree-title">{context.tree.title}</div>
        </div>
      );
    };

    render(
      <BookmarkManagerContextProvider>
        <TestComponent />
      </BookmarkManagerContextProvider>,
    );

    expect(screen.getByTestId('isLoaded').textContent).toBe('false');
    expect(screen.getByTestId('tree-title').textContent).toBe('root');
  });

  it('should initialize the bookmark manager and update state', async () => {
    const mockBookmarkManager = {
      tree: { title: 'root', children: [] },
      onChange: vi.fn(),
      addFolder: vi.fn(),
      addBookmark: vi.fn(),
      removeFolder: vi.fn(),
      removeBookmark: vi.fn(),
      updateFolder: vi.fn(),
      updateBookmark: vi.fn(),
      moveFolder: vi.fn(),
      moveBookmark: vi.fn(),
    };

    mockedCreateBookmarkManager.mockResolvedValue(mockBookmarkManager);

    const TestComponent = () => {
      const context = useContext(BookmarkManagerContext);

      return (
        <div>
          <div data-testid="isLoaded">{context.isLoaded.toString()}</div>
          <div data-testid="tree-title">{context.tree.title}</div>
        </div>
      );
    };

    render(
      <BookmarkManagerContextProvider>
        <TestComponent />
      </BookmarkManagerContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoaded').textContent).toBe('true');
      expect(screen.getByTestId('tree-title').textContent).toBe('root');
    });
  });

  it('should provide the correct context value once loaded', async () => {
    const mockBookmarkManager = {
      tree: { title: 'root', children: [] },
      onChange: vi.fn(),
      addFolder: vi.fn(),
      addBookmark: vi.fn(),
      removeFolder: vi.fn(),
      removeBookmark: vi.fn(),
      updateFolder: vi.fn(),
      updateBookmark: vi.fn(),
      moveFolder: vi.fn(),
      moveBookmark: vi.fn(),
    };

    mockedCreateBookmarkManager.mockResolvedValue(mockBookmarkManager);

    const TestComponent = () => {
      const context = useContext(BookmarkManagerContext);

      return (
        <div>
          <div data-testid="isLoaded">{context.isLoaded.toString()}</div>
          <div data-testid="tree-title">{context.tree.title}</div>
          <button onClick={() => context.addFolder('New Folder')}>
            Add Folder
          </button>
          <button
            onClick={() =>
              context.addBookmark({
                title: 'New Bookmark',
                url: 'http://example.com',
                parentId: '1',
              })
            }
          >
            Add Bookmark
          </button>
        </div>
      );
    };

    render(
      <BookmarkManagerContextProvider>
        <TestComponent />
      </BookmarkManagerContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoaded').textContent).toBe('true');
      expect(screen.getByTestId('tree-title').textContent).toBe('root');
    });

    screen.getByText('Add Folder').click();
    screen.getByText('Add Bookmark').click();

    expect(mockBookmarkManager.addFolder).toHaveBeenCalledWith('New Folder');
    expect(mockBookmarkManager.addBookmark).toHaveBeenCalledWith({
      title: 'New Bookmark',
      url: 'http://example.com',
      parentId: '1',
    });
  });
});
