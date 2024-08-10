import type { PropsWithChildren } from 'react';
import { vi, it, afterEach, expect, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import BookmarkModal from './index';

vi.mock('../Modal', () => ({
  default: ({ children }: PropsWithChildren) => children,
}));

describe('BookmarkModal Component', () => {
  const mockSubmit = vi.fn();
  const mockClose = () => {};

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the provided initial form and button label', () => {
    render(
      <BookmarkModal
        submit={mockSubmit}
        close={mockClose}
        initialForm={{
          title: 'title',
          url: 'url',
        }}
        buttonLabel="Save"
      />,
    );

    expect(screen.getByTestId('title-input')).toHaveValue('title');
    expect(screen.getByTestId('url-input')).toHaveValue('url');
    expect(screen.getByTestId('button')).toHaveTextContent('Save');
  });

  it('renders the modal with default form and button label', () => {
    render(<BookmarkModal submit={mockSubmit} close={mockClose} />);

    expect(screen.getByTestId('title-input')).toHaveValue('');
    expect(screen.getByTestId('url-input')).toHaveValue('');
    expect(screen.getByRole('button')).toHaveTextContent('Create');
  });

  it('calls submit with the form data when the form is submitted', () => {
    render(<BookmarkModal submit={mockSubmit} close={mockClose} />);

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    const urlInput = screen.getByTestId('url-input');
    fireEvent.change(urlInput, { target: { value: 'New Url' } });

    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'New Title',
      url: 'New Url',
    });
  });
});
