import type { PropsWithChildren } from 'react';
import { vi, it, afterEach, expect, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import FolderModal from './index';

vi.mock('../Modal', () => ({
  default: ({ children }: PropsWithChildren) => children,
}));

describe('FolderModal Component', () => {
  const mockSubmit = vi.fn();
  const mockClose = () => {};

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the provided initial title', () => {
    render(
      <FolderModal
        submit={mockSubmit}
        close={mockClose}
        initialTitle="Test Title"
      />,
    );

    expect(screen.getByTestId('input')).toHaveValue('Test Title');
  });

  it('renders the modal with default title and button label', () => {
    render(<FolderModal submit={mockSubmit} close={mockClose} />);

    expect(screen.getByTestId('input')).toHaveValue('');
    expect(screen.getByRole('button')).toHaveTextContent('Create');
  });

  it('calls submit with the form data when the form is submitted', () => {
    render(<FolderModal submit={mockSubmit} close={mockClose} />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'New Folder' } });

    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalledWith({ title: 'New Folder' });
  });
});
