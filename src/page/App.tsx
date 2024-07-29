import { BookmarkManagerContextProvider } from '#page/context/bookmark-manager';

import Layout from '#page/components/Layout';
import HomePage from '#page/components/HomePage';

import ModalsContainer from './components/Modals/ModalsContainer';

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
