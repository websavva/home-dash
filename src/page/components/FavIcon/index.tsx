import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { GlobeIcon } from 'lucide-react';

import classes from './index.module.scss';

export interface FavIconProps {
  className?: string;
  url: string;
}

const isProd = import.meta.env.PROD;

function FavIcon({ url, className }: FavIconProps) {
  const [hasLoadingFailed, setHasLoadingFailed] = useState(false);

  let src: string | undefined;

  if (isProd) {
    src = `chrome://favicon/size/32@1x/${url}`;
  } else {
    try {
      const { origin } = new URL(url);

      src = `${origin}/favicon.ico`;
    } catch {
      // continue regardless of error
    }
  }

  useEffect(() => {
    setHasLoadingFailed(false);
  }, [url]);

  if (!src || hasLoadingFailed) {
    return <GlobeIcon className={className} />;
  } else {
    return (
      <img
        src={src}
        onError={() => setHasLoadingFailed(true)}
        className={clsx(classes['fav-icon'], className)}
      />
    );
  }
}

export default FavIcon;
