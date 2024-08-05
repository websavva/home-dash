import { describe, it, expect, vi, beforeEach } from 'vitest';

import { renderHook } from '@testing-library/react';

import { useClickAway } from './use-click-away';

describe('useClickAway hook', () => {
  let callback: ReturnType<(typeof vi)['fn']>;

  beforeEach(() => {
    callback = vi.fn();
  });

  it('should call callback when clicking outside the target element', () => {
    const { result } = renderHook(() => useClickAway(callback));
    const div = document.createElement('div');
    result.current.current = div;

    // Simulate clicking outside the target element
    document.body.click();

    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback when clicking the target element', () => {
    const { result } = renderHook(() => useClickAway(callback));
    const div = document.createElement('div');
    result.current.current = div;

    // Simulate clicking inside the target element
    div.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when clicking inside the target element', () => {
    const { result } = renderHook(() => useClickAway(callback));
    const div = document.createElement('div');

    const button = document.createElement('button');

    div.append(button);

    result.current.current = div;

    // Simulate clicking inside the target element
    button.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const { result, unmount } = renderHook(() => useClickAway(callback));
    const div = document.createElement('div');
    result.current.current = div;

    // Simulate clicking outside before unmount
    document.body.click();
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    // Reset mock to avoid counting previous calls
    callback.mockReset();

    // Simulate clicking outside after unmount
    document.body.click();

    expect(callback).not.toHaveBeenCalled();
  });
});
