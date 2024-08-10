import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, vi, it, afterEach } from 'vitest';

import Modal from './index';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the given title and children', () => {
    render(
      <Modal title="Test Title" onClose={mockOnClose}>
        <p data-testid="content">Modal Content</p>
      </Modal>,
    );

    expect(screen.queryByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).toBeInTheDocument();

    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Modal Content');
  });

  it('does not render a title if none is provided', () => {
    render(
      <Modal onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(screen.queryByTestId('title')).toBeNull();
  });

  it('calls onClose when the overlay is clicked', () => {
    render(
      <Modal title="Test Title" onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByTestId('overlay'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <Modal title="Test Title" onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByTestId('button'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking inside the modal window', () => {
    render(
      <Modal title="Test Title" onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByText('Modal Content'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
