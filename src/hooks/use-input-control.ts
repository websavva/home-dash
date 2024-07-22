import type { ChangeEventHandler } from 'react';

export const useInputControl = <F extends Record<string, string>>(
  form: F,
  setForm: (updater: (form: F) => F) => void,
) => {
  return (fieldName: keyof F) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = ({
      target: { value: newValue },
    }) => {
      setForm((form) => ({ ...form, [fieldName]: newValue.trim() }));
    };
    return {
      value: form[fieldName],
      onChange,
    };
  };
};
