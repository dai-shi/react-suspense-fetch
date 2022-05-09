import React, { Suspense } from 'react';

import { AuthContextProvider } from './AuthContext';
import Main from './Main';

const App = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  </Suspense>
);

export default App;
