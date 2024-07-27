import { useContext } from 'react';

import { BookmarkManagerContext } from '@/context/bookmark-manager';

export const useBookmarkManager = () => {
  return useContext(BookmarkManagerContext);
};
