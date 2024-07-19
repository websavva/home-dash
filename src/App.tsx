import { BookmarkManagerContextProvider } from '@/context/bookmark-manager';
import ModalsContainer from './context/modals/ModalsContainer';

import Layout from '@/components/Layout';
import HomePage from '@/components/HomePage';

function App() {
  return (
    <BookmarkManagerContextProvider>
      <ModalsContainer>
        <Layout>
          <HomePage />
        </Layout>
      </ModalsContainer>
    </BookmarkManagerContextProvider>
  );
}

export default App;
