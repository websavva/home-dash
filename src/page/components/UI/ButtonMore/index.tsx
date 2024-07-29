import {
  type HTMLAttributes,
  type FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { clsx } from 'clsx';

import { useClickAway } from '#page/hooks/use-click-away';

import { getScrollingParent } from '#page/utils/get-scrolling-parent';

import { ButtonMoreContext } from './Anchor';
import classes from './index.module.scss';

export interface ButtonMoreAction {
  id: string | number;
  Icon: FunctionComponent;
  label: string;
  onClick: () => any;
}

export interface ButtonMoreProps extends HTMLAttributes<HTMLDivElement> {
  actions: ButtonMoreAction[];
}

function ButtonMore({ actions, className, ...attrs }: ButtonMoreProps) {
  const { isOpened, onToggle, onClose, buttonClassName } =
    useContext(ButtonMoreContext);

  const [positionType, setPositionType] = useState<'top' | 'bottom' | null>(
    null,
  );

  const onClickAway = useCallback(() => {
    onClose();
  }, [onClose]);

  const rootElementRef = useClickAway<HTMLDivElement>(onClickAway);

  useEffect(() => {
    if (!isOpened) setPositionType(null);
  }, [isOpened]);

  const onActionsListMount = (actionsList: HTMLElement | null) => {
    const { current: rootElement } = rootElementRef;

    if (!actionsList || !rootElement) return;

    const scrollingParent = getScrollingParent(actionsList);

    if (!scrollingParent) return;

    const relativeTopHeight =
      rootElement.offsetTop +
      -(scrollingParent.offsetTop + scrollingParent.scrollTop);

    const { offsetHeight: actionsListHeight } = actionsList;

    const { scrollHeight: scrollingParentFullHeight } = scrollingParent;

    const hasLeftSpaceBelow =
      actionsListHeight + rootElement.offsetHeight + relativeTopHeight <
      scrollingParentFullHeight;

    const hasLeftSpaceUp = relativeTopHeight - actionsListHeight > 0;

    if (!hasLeftSpaceBelow && hasLeftSpaceUp) {
      setPositionType('top');
    } else {
      setPositionType('bottom');
    }
  };

  return (
    <div
      {...attrs}
      ref={rootElementRef}
      className={clsx(classes['button-more'], buttonClassName, className)}
      data-button-more={isOpened ? 'opened' : 'closed'}
    >
      <button className={classes['button-more__activator']} onClick={onToggle}>
        <EllipsisVerticalIcon />
      </button>

      {isOpened && (
        <div
          className={clsx(classes['button-more__actions'], {
            [classes[`button-more__actions--${positionType}`]]: positionType,
          })}
          ref={onActionsListMount}
        >
          {actions.map(({ id, onClick, label, Icon }) => {
            return (
              <div
                key={id}
                className={classes['button-more__actions__item']}
                onClick={() => {
                  onClick();
                  onClose();
                }}
              >
                <Icon />

                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ButtonMore;
