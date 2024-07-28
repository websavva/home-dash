import { useContext } from 'react';

import { BookmarkManagerContext } from '#page/context/bookmark-manager';

export const useBookmarkManager = () => {
  return useContext(BookmarkManagerContext);
};
