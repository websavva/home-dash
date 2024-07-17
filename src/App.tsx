import { BookmarkManagerContextProvider } from '@/context/bookmark-manager';

import HomePage from '@/components/HomePage';

function App() {
  return (
    <BookmarkManagerContextProvider>
      <HomePage />
    </BookmarkManagerContextProvider>
  );
}

export default App;
