import { useRef, useEffect } from 'react';

export const useClickAway = (callback: () => any) => {
  const targetElementRef = useRef<Element | null>(null);

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
  });

  return targetElementRef;
};
