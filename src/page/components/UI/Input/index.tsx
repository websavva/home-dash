import type { JSX } from 'react';
import { clsx } from 'clsx';

import classes from './index.module.scss';

function Input(props: JSX.IntrinsicElements['input']) {
  return (
    <input {...props} className={clsx(classes['input'], props.className)} />
  );
}

export default Input;
