import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { GlobeIcon } from 'lucide-react';

import classes from './index.module.scss';

export interface FavIconProps {
  className?: string;
  url: string;
}

const isProd = import.meta.env.PROD;

function getFavIconUrl(websiteUrl: string) {
  if (isProd) {
    const chromeUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    
    chromeUrl.searchParams.set('pageUrl', websiteUrl);
    chromeUrl.searchParams.set('size', '32');

    return chromeUrl.toString();
  } else {
    try {
      const { origin } = new URL(websiteUrl);

      return `${origin}/favicon.ico`;
    } catch {
      return null;
    }
  }
}

function FavIcon({ url, className }: FavIconProps) {
  const [hasLoadingFailed, setHasLoadingFailed] = useState(false);

  const src = getFavIconUrl(url);

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
