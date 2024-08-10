import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useBookmarkManager } from '#page/hooks/use-bookmark-manager';
import { useFolderHandlers } from '#page/hooks/use-folder-handlers';

import Layout from './index';

vi.mock('#page/hooks/use-folder-handlers');
vi.mock('#page/hooks/use-bookmark-manager');

describe('Layout Component', () => {
  const mockOnAddFolder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useFolderHandlers as Mock).mockReturnValue({
      onAdd: mockOnAddFolder,
    });
  });

  it('renders sidebar buttons correctly', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      isLoaded: true,
    });

    render(<Layout>Content</Layout>);

    const logoButton = screen.getByTestId('logo');
    const newCardAdditionButton = screen.getByTestId('new-card-addition');

    expect(logoButton).toBeInTheDocument();
    expect(newCardAdditionButton).toBeInTheDocument();
  });

  it('disables the add folder button when bookmark manager is not loaded', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      isLoaded: false,
    });

    render(<Layout>Content</Layout>);

    const newCardAdditionButton = screen.getByTestId('new-card-addition');

    expect(newCardAdditionButton).toBeDisabled();
  });

  it('calls onAddFolder when add folder button is clicked', () => {
    (useBookmarkManager as Mock).mockReturnValue({
      isLoaded: true,
    });

    render(<Layout>Content</Layout>);

    const newCardAdditionButton = screen.getByTestId('new-card-addition');

    fireEvent.click(newCardAdditionButton);

    expect(mockOnAddFolder).toHaveBeenCalled();
  });

  it('renders children correctly', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test</div>
      </Layout>,
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies additional classNames passed via props', () => {
    render(<Layout className="custom-class">Content</Layout>);

    const layoutElement = screen.getByRole('main').parentElement;

    expect(layoutElement).toHaveClass('custom-class');
  });
});
