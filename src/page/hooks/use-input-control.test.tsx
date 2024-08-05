import { describe, it, expect } from 'vitest';
import { useState, type ChangeEvent } from 'react';
import { renderHook, act } from '@testing-library/react';

import { useInputControl } from './use-input-control'; // Adjust the path accordingly

const createInputEvent = (value: string) => {
  return {
    target: {
      value,
    },
  } as unknown as ChangeEvent<HTMLInputElement>;
};

describe('useInputControl hook', () => {
  function useTestHook() {
    const [form, setForm] = useState({
      name: 'John',
      email: 'john@example.com',
    });
    const inputControl = useInputControl(form, setForm);
    return { form, inputControl, setForm };
  }

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => useTestHook());

    const nameControl = result.current.inputControl('name');
    const emailControl = result.current.inputControl('email');

    expect(nameControl.value).toBe('John');
    expect(emailControl.value).toBe('john@example.com');
  });

  it('should update form state on change', async () => {
    const { result } = renderHook(() => useTestHook());

    const nameControl = result.current.inputControl('name');
    const emailControl = result.current.inputControl('email');

    await act(() => {
      nameControl.onChange(createInputEvent('Jane'));
      emailControl.onChange(createInputEvent('jane@example.com'));
    });

    expect(result.current.form.name).toBe('Jane');
    expect(result.current.form.email).toBe('jane@example.com');
  });

  it('should not affect other fields when one field changes', async () => {
    const { result } = renderHook(() => useTestHook());

    const nameControl = result.current.inputControl('name');

    await act(() => {
      nameControl.onChange(createInputEvent('Jane'));
    });

    expect(result.current.form.name).toBe('Jane');
    expect(result.current.form.email).toBe('john@example.com');
  });
});
