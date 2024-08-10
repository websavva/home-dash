import { expect, describe, vi, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useContext } from 'react';

import {
  ModalsContext,
  ModalsContextProvider,
} from '#page/context/modals/Provider';

import ModalsContainer, { ModalsContainerList } from './index';

// Mock Modal Component
const MockModalComponent = ({ submit, close, message }: any) => (
  <div data-testid="mock-modal">
    <p>{message}</p>
    <button onClick={() => submit('submitted')}>Submit</button>
    <button onClick={close}>Close</button>
  </div>
);

// Custom hook to add a modal for testing
const AddModalComponent = ({ id, Component, props, resolve }: any) => {
  const { open } = useContext(ModalsContext);
  return (
    <button
      onClick={() => open(Component, props).then((res) => resolve?.(res))}
    >
      Open Modal {id}
    </button>
  );
};

describe('ModalsContainer', () => {
  it('renders without crashing', () => {
    render(<ModalsContainer>Test Content</ModalsContainer>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders modals when opened and removes them when closed', async () => {
    const { getByText, queryByText } = render(
      <ModalsContextProvider>
        <AddModalComponent
          id="1"
          Component={MockModalComponent}
          props={{ message: 'Modal 1' }}
        />
        <ModalsContainerList />
      </ModalsContextProvider>,
    );

    fireEvent.click(getByText('Open Modal 1'));

    await waitFor(() => {
      expect(getByText('Modal 1')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(queryByText('Modal 1')).not.toBeInTheDocument();
    });
  });

  it('calls submit and close functions correctly', async () => {
    const mockSubmit = vi.fn();
    const mockClose = vi.fn();
    const mockResolve = vi.fn();

    const { getByText } = render(
      <ModalsContextProvider>
        <AddModalComponent
          id="1"
          Component={MockModalComponent}
          resolve={mockResolve}
          props={{
            message: 'Modal 1',
            submit: mockSubmit,
            close: mockClose,
          }}
        />
        <ModalsContainerList />
      </ModalsContextProvider>,
    );

    fireEvent.click(getByText('Open Modal 1'));

    await waitFor(() => {
      expect(screen.queryByTestId('mock-modal')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledOnce();
      expect(mockSubmit).toHaveBeenCalledWith('submitted');

      expect(mockResolve).toHaveBeenCalledOnce();
      expect(mockResolve).toHaveBeenCalledWith('submitted');
    });

    expect(mockClose).not.toHaveBeenCalled();

    mockClose.mockClear();
    mockResolve.mockClear();
    mockSubmit.mockClear();

    fireEvent.click(getByText('Open Modal 1'));

    await waitFor(() => {
      expect(screen.queryByTestId('mock-modal')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Close'));

    await waitFor(() => {
      expect(mockResolve).toHaveBeenCalledOnce();
      expect(mockResolve).toHaveBeenCalledWith(null);

      expect(mockClose).toHaveBeenCalledOnce();
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
