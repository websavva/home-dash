import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextCursorIcon } from 'lucide-react';

import { mockedClasses } from '#page/utils/test/mocked-classes';

import { ButtonMoreContext } from './Anchor';

import ButtonMore, { type ButtonMoreAction } from './index';

vi.mock('./index.module.scss', () => ({
  default: mockedClasses,
}));

describe('ButtonMore Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockActions: ButtonMoreAction[] = [
    {
      id: 'button-more-action1',
      label: 'Action 1',
      Icon: TextCursorIcon,
      onClick: vi.fn(),
    },
    {
      id: 'button-more-action2',
      label: 'Action 2',
      Icon: TextCursorIcon,
      onClick: vi.fn(),
    },
  ];

  const renderWithContext = (isOpened = false) => {
    return render(
      <ButtonMoreContext.Provider
        value={{
          isOpened,
          onToggle: vi.fn(),
          onClose: vi.fn(),
          onOpen: vi.fn(),
          setIsOpened: vi.fn(),
          buttonClassName: 'button-class',
        }}
      >
        <ButtonMore actions={mockActions} />
      </ButtonMoreContext.Provider>,
    );
  };

  it('renders activator button', () => {
    renderWithContext();
    const button = screen.getByTestId('button-more');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button-class');
    expect(button).toHaveAttribute('data-button-more', 'closed');
  });

  it('does not render actions when closed', () => {
    renderWithContext(false);
    expect(screen.queryByTestId('button-more-action1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-more-action2')).not.toBeInTheDocument();
  });

  it('renders actions when opened', () => {
    renderWithContext(true);
    expect(screen.queryByTestId('button-more-action1')).toBeInTheDocument();
    expect(screen.queryByTestId('button-more-action2')).toBeInTheDocument();
  });

  it('calls onToggle when activator is clicked', () => {
    const mockOnToggle = vi.fn();
    render(
      <ButtonMoreContext.Provider
        value={{
          isOpened: false,
          onToggle: mockOnToggle,
          onClose: vi.fn(),
          onOpen: vi.fn(),
          setIsOpened: vi.fn(),
          buttonClassName: 'button-class',
        }}
      >
        <ButtonMore actions={mockActions} />
      </ButtonMoreContext.Provider>,
    );

    const button = screen.getByTestId('button-more-activator');
    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalled();
  });

  it('calls onClick and onClose when an action is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <ButtonMoreContext.Provider
        value={{
          isOpened: true,
          onToggle: vi.fn(),
          onClose: mockOnClose,
          onOpen: vi.fn(),
          setIsOpened: vi.fn(),
          buttonClassName: 'button-class',
        }}
      >
        <ButtonMore actions={mockActions} />
      </ButtonMoreContext.Provider>,
    );

    const action1 = screen.getByTestId('button-more-action1');
    fireEvent.click(action1);

    expect(mockActions[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('applies correct classes based on context and state', () => {
    renderWithContext(true);

    const buttonMore = screen.getByTestId('button-more');
    expect(buttonMore).toHaveAttribute('data-button-more', 'opened');
  });
});
