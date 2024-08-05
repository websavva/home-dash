import type { PropsWithChildren } from 'react';
import { describe, it, vi, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { ModalsContext, type ModalsContextSchema } from '#page/context/modals';

import { useModals } from './use-modals';

describe('useModals hook', () => {
  const mockContextValue = {
    open: vi.fn().mockResolvedValue('mockResult'),
    openedModals: ['Modal1', 'Modal2'],
  } as unknown as ModalsContextSchema;

  const wrapper = ({ children }: PropsWithChildren) => (
    <ModalsContext.Provider value={mockContextValue}>
      {children}
    </ModalsContext.Provider>
  );

  it('should return context value for openedModals', () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    expect(result.current.openedModals).toEqual(mockContextValue.openedModals);
  });

  it('should call open function from context and return result', async () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    let openResult;

    const DummyModalComponent = ({ someProp }: { someProp: string }) => (
      <div>{someProp}</div>
    );

    await act(async () => {
      openResult = await result.current.open(DummyModalComponent, {
        someProp: 'value',
      });
    });

    expect(mockContextValue.open).toHaveBeenCalledWith(DummyModalComponent, {
      someProp: 'value',
    });
    expect(openResult).toBe('mockResult');
  });
});
