import { expect, describe, vi, it } from 'vitest';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Input from './index';

const mockedClasses = vi.hoisted(() => ({
  input: 'inner-class',
}));

vi.mock('./index.module.scss', () => ({
  default: mockedClasses,
}));

const setup = (props: Parameters<typeof Input>[0]) => {
  const utils = render(<Input {...props} />);

  const input = utils.container.querySelector('input')!;

  return {
    input,
    ...utils,
  };
};

describe('Input', async () => {
  it('should have outer and inner classes', () => {
    const { input } = setup({
      className: 'outer-class',
    });

    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveClass('outer-class');
    expect(input).toHaveClass('inner-class');
  });

  it('should attach attributes', () => {
    const { input } = setup({
      placeholder: 'enter',
      disabled: true,
    });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('placeholder', 'enter');
  });

  it('should be interactive', async () => {
    const onChange = vi.fn((e) => {
      return e.target.value;
    });

    const user = userEvent.setup();

    const { input } = setup({
      onChange,
      value: '',
    });

    const newValue = 'changed-value';

    await user.click(input);

    await user.paste(newValue);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toReturnWith(newValue);
  });
});
