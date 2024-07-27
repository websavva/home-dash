import type { PropsWithChildren } from 'react';
import { XIcon } from 'lucide-react';

import classes from './index.module.scss';

function Modal({
  onClose,
  children,
  title,
}: PropsWithChildren<{ onClose: () => any; title?: string }>) {
  return (
    <div className={classes['modal']}>
      <div className={classes['modal__overlay']} onClick={onClose} />

      <div className={classes['modal__window']}>
        <div className={classes['modal__window__head']}>
          {title && (
            <div className={classes['modal__window__head__title']}>{title}</div>
          )}

          <button
            type="button"
            onClick={onClose}
            className={classes['modal__window__head__close']}
          >
            <XIcon />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
