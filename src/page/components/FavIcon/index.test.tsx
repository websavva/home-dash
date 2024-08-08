import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, afterEach } from 'vitest';

import FavIcon from './index';

const mockedGetFavIconUrl = vi.hoisted(() =>
  vi.fn().mockImplementation((path: string) => `chrome-extension://${path}`),
);

vi.stubGlobal('chrome', {
  runtime: {
    getURL: mockedGetFavIconUrl,
  },
});

describe('FavIcon Component', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('renders the GlobeIcon when URL is invalid', () => {
    const { container } = render(<FavIcon url="invalid-url" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders the favicon correctly in production environment', () => {
    vi.stubEnv('PROD', true);

    render(<FavIcon url="https://example.com" />);

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(mockedGetFavIconUrl).toHaveBeenCalledOnce();
    expect(mockedGetFavIconUrl).toHaveBeenCalledWith('/_favicon/');
    expect(img).toHaveAttribute(
      'src',
      `chrome-extension:///_favicon/?pageUrl=${encodeURIComponent('https://example.com')}&size=32`,
    );
  });

  it('renders the favicon correctly in development environment', () => {
    vi.stubEnv('PROD', false);

    render(<FavIcon url="https://example.com" />);

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/favicon.ico');
  });

  it('renders the GlobeIcon when favicon fails to load', async () => {
    const { container } = render(<FavIcon url="https://example.com" />);

    const img = screen.getByRole('img');

    // Simulate the error event
    fireEvent.error(img);

    await waitFor(() => {
      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
