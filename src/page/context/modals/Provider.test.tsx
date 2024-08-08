import { useContext } from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { ModalsContext, ModalsContextProvider } from './Provider';

describe('ModalsContextProvider', () => {
  it('should initialize with default context values', () => {
    const { result } = renderHook(() => useContext(ModalsContext), {
      wrapper: ModalsContextProvider,
    });

    expect(result.current.open).toBeTypeOf('function');
    expect(result.current.remove).toBeTypeOf('function');
    expect(result.current.openedModals).toEqual([]);
  });

  it('should add modal when open is called and remove it after remove is called', async () => {
    const { result } = renderHook(() => useContext(ModalsContext), {
      wrapper: ModalsContextProvider,
    });

    const TestModal = ({ text }: { text: string }) => <div>{text}</div>;
    const props = {
      text: 'foo',
    };

    let promise: Promise<any> | undefined;

    await act(() => {
      // @ts-expect-error Test modal has defined props
      promise = result.current.open(TestModal, props);
    });

    expect(result.current.openedModals).toHaveLength(1);
    expect(result.current.openedModals[0]).toMatchObject({
      Component: TestModal,
      props,
      promise,
    });

    await act(() => {
      result.current.remove(result.current.openedModals[0].id);
    });

    expect(result.current.openedModals).toHaveLength(0);
  });
});
