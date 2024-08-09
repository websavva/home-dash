import { describe, vi, beforeEach, it, expect, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';

import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';

import FolderCard from '../FolderCard';
import FolderCardPlaceholder from '../FolderCard/Placeholder';

import HomePage from './index';

vi.mock('#page/hooks/use-bookmark-manager');
vi.mock('../FolderCard');
vi.mock('../FolderCard/Placeholder');
vi.mock('./index.module.scss', () => ({
  default: { 'home-page__list': 'list' },
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders FolderCards for each folder and a single FolderCardPlaceholder', () => {
    const mockFolders = [
      { id: '1', title: 'Folder 1', children: [] },
      { id: '2', title: 'Folder 2', children: [] },
    ];

    (useBookmarkManager as Mock).mockReturnValue({
      tree: { children: mockFolders },
    });

    render(<HomePage />);

    expect(FolderCard).toHaveBeenCalledTimes(mockFolders.length);
    mockFolders.forEach((folder) => {
      expect(FolderCard).toHaveBeenCalledWith(
        expect.objectContaining({ folder }),
        expect.anything(),
      );
    });

    expect(FolderCardPlaceholder).toHaveBeenCalledTimes(1);
  });

  it('renders only the FolderCardPlaceholder when no folders are present', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      tree: { children: [] },
    });

    render(<HomePage />);

    expect(FolderCard).not.toHaveBeenCalled();
    expect(FolderCardPlaceholder).toHaveBeenCalledTimes(1);
  });

  it('handles undefined children by rendering only the FolderCardPlaceholder', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      tree: { children: undefined },
    });

    render(<HomePage />);

    expect(FolderCard).not.toHaveBeenCalled();
    expect(FolderCardPlaceholder).toHaveBeenCalledTimes(1);
  });

  it('renders correct DOM structure with appropriate classes', () => {
    const mockFolders = [
      { id: '1', title: 'Folder 1', children: [] },
      { id: '2', title: 'Folder 2', children: [] },
    ];

    (useBookmarkManager as Mock).mockReturnValue({
      tree: { children: mockFolders },
    });

    (FolderCard as Mock).mockImplementation(() => <article>Article</article>);

    (FolderCardPlaceholder as Mock).mockImplementation(() => (
      <article>Article</article>
    ));

    const { container } = render(<HomePage />);

    expect(container.firstChild).toHaveClass('list');
    expect(screen.getAllByRole('article')).toHaveLength(mockFolders.length + 1);
  });
});
