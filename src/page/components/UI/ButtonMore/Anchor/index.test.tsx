import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useContext } from 'react';

import { mockedClasses } from '#page/utils/test/mocked-classes';

import ButtonMoreAnchor, { ButtonMoreContext } from './index';

vi.mock('./index.module.scss', () => ({
  default: mockedClasses,
}));

describe('ButtonMoreAnchor Component', () => {
  it('renders children correctly', () => {
    render(
      <ButtonMoreAnchor>
        <div>Test Child</div>
      </ButtonMoreAnchor>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides correct initial context values', () => {
    function TestComponent() {
      const { isOpened, onToggle, onOpen, onClose, buttonClassName } =
        useContext(ButtonMoreContext);

      return (
        <div>
          <div data-testid="isOpened">{isOpened ? 'true' : 'false'}</div>
          <button onClick={onToggle}>Toggle</button>
          <button onClick={onOpen}>Open</button>
          <button onClick={onClose}>Close</button>
          <div data-testid="buttonClassName">{buttonClassName}</div>
        </div>
      );
    }

    render(
      <ButtonMoreAnchor>
        <TestComponent />
      </ButtonMoreAnchor>,
    );

    expect(screen.getByTestId('isOpened').textContent).toBe('false');
    expect(screen.getByTestId('buttonClassName').textContent).toBe(
      'button-more-anchor__btn',
    );
  });

  it('onToggle toggles isOpened state', () => {
    function TestComponent() {
      const { isOpened, onToggle } = useContext(ButtonMoreContext);

      return (
        <div>
          <div data-testid="isOpened">{isOpened ? 'true' : 'false'}</div>
          <button onClick={onToggle}>Toggle</button>
        </div>
      );
    }

    render(
      <ButtonMoreAnchor>
        <TestComponent />
      </ButtonMoreAnchor>,
    );

    const isOpenedDiv = screen.getByTestId('isOpened');
    const toggleButton = screen.getByText('Toggle');

    // Initial state
    expect(isOpenedDiv.textContent).toBe('false');

    // Toggle to open
    fireEvent.click(toggleButton);
    expect(isOpenedDiv.textContent).toBe('true');

    // Toggle to close
    fireEvent.click(toggleButton);
    expect(isOpenedDiv.textContent).toBe('false');
  });

  it('onOpen sets isOpened to true', () => {
    function TestComponent() {
      const { isOpened, onOpen } = useContext(ButtonMoreContext);

      return (
        <div>
          <div data-testid="isOpened">{isOpened ? 'true' : 'false'}</div>
          <button onClick={onOpen}>Open</button>
        </div>
      );
    }

    render(
      <ButtonMoreAnchor>
        <TestComponent />
      </ButtonMoreAnchor>,
    );

    const isOpenedDiv = screen.getByTestId('isOpened');
    const openButton = screen.getByText('Open');

    // Initial state
    expect(isOpenedDiv.textContent).toBe('false');

    // Open
    fireEvent.click(openButton);
    expect(isOpenedDiv.textContent).toBe('true');

    // Open again, should remain true
    fireEvent.click(openButton);
    expect(isOpenedDiv.textContent).toBe('true');
  });

  it('onClose sets isOpened to false', () => {
    function TestComponent() {
      const { isOpened, onOpen, onClose } = useContext(ButtonMoreContext);

      return (
        <div>
          <div data-testid="isOpened">{isOpened ? 'true' : 'false'}</div>
          <button onClick={onOpen}>Open</button>
          <button onClick={onClose}>Close</button>
        </div>
      );
    }

    render(
      <ButtonMoreAnchor>
        <TestComponent />
      </ButtonMoreAnchor>,
    );

    const isOpenedDiv = screen.getByTestId('isOpened');
    const openButton = screen.getByText('Open');
    const closeButton = screen.getByText('Close');

    // Initial state
    expect(isOpenedDiv.textContent).toBe('false');

    // Open
    fireEvent.click(openButton);
    expect(isOpenedDiv.textContent).toBe('true');

    // Close
    fireEvent.click(closeButton);
    expect(isOpenedDiv.textContent).toBe('false');
  });

  it('onMouseLeave triggers onClose', () => {
    function TestComponent() {
      const { isOpened, onOpen } = useContext(ButtonMoreContext);

      return (
        <div>
          <div data-testid="isOpened">{isOpened ? 'true' : 'false'}</div>
          <button onClick={onOpen}>Open</button>
        </div>
      );
    }

    const { container } = render(
      <ButtonMoreAnchor>
        <TestComponent />
      </ButtonMoreAnchor>,
    );

    const isOpenedDiv = screen.getByTestId('isOpened');
    const openButton = screen.getByText('Open');

    // Initial state
    expect(isOpenedDiv.textContent).toBe('false');

    // Open
    fireEvent.click(openButton);
    expect(isOpenedDiv.textContent).toBe('true');

    // Mouse leave
    fireEvent.mouseLeave(container.firstChild!);
    expect(isOpenedDiv.textContent).toBe('false');
  });

  it('applies additional classNames passed via props', () => {
    const { container } = render(
      <ButtonMoreAnchor className="custom-class">
        <div>Test Child</div>
      </ButtonMoreAnchor>,
    );

    expect(container.firstChild).toHaveClass('button-more-anchor');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
