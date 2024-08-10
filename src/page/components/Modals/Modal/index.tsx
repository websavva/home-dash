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
      <div
        className={classes['modal__overlay']}
        data-testid="overlay"
        onClick={onClose}
      />

      <div className={classes['modal__window']}>
        <div className={classes['modal__window__head']}>
          {title && (
            <div
              className={classes['modal__window__head__title']}
              data-testid="title"
            >
              {title}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className={classes['modal__window__head__close']}
            data-testid="button"
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
