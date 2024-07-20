import { useRef, useEffect } from 'react';

export const useClickAway = <E extends Element>(callback: () => any) => {
  const targetElementRef = useRef<E | null>(null);

  useEffect(() => {
    const onClick = ({ target }: MouseEvent) => {
      const wasClickedWithin =
        target &&
        target instanceof Node &&
        (targetElementRef.current === target ||
          targetElementRef.current?.contains(target));

      if (!wasClickedWithin) callback();
    };

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, [callback]);

  return targetElementRef;
};
