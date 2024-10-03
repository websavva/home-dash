import { describe, vi, beforeEach, it, expect, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useFolderHandlers } from '#page/hooks/use-folder-handlers';
import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import { mockedClasses } from '#page/utils/test/mocked-classes';

import FolderCardPlaceholder from './index';

vi.mock('#page/hooks/use-folder-handlers');
vi.mock('#page/hooks/use-bookmark-manager');

vi.mock('./index.module.scss', () => ({
  default: mockedClasses,
}));

vi.mock('../index.module.scss', () => ({
  default: mockedClasses,
}));

describe('FolderCardPlaceholder Component', () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useFolderHandlers as Mock).mockReturnValue({
      onAdd: mockOnAdd,
    });
  });

  it('renders correctly with default classes', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      isLoaded: true,
    });

    render(<FolderCardPlaceholder />);

    const placeholderElement = screen.getByTestId('folder-card-placeholder');
    expect(placeholderElement).toBeInTheDocument();
    expect(placeholderElement).toHaveClass('folder-card');
    expect(placeholderElement).toHaveClass('folder-card-placeholder');
  });

  it('applies additional classNames passed via props', () => {
    render(<FolderCardPlaceholder className="custom-class" />);

    const placeholderElement = screen.getByTestId('folder-card-placeholder');
    expect(placeholderElement).toHaveClass('custom-class');
  });

  it('calls onAdd when clicked and bookmark manager is loaded', () => {
    render(<FolderCardPlaceholder />);

    const placeholderElement = screen.getByTestId('folder-card-placeholder');
    fireEvent.click(placeholderElement);

    expect(mockOnAdd).toHaveBeenCalled();
  });
});
