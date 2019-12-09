import React, { Suspense, createContext, useState } from 'react';

import Main from './Main';

const useAuthState = () => useState<{ token: string } | null>(null);

export const AuthContext = createContext<ReturnType<typeof useAuthState>>([
  null,
  () => { throw new Error('uninitialized'); },
]);

const App: React.FC = () => (
  <Suspense fallback={<span>Loading...</span>}>
    <AuthContext.Provider value={useAuthState()}>
      <Main />
    </AuthContext.Provider>
  </Suspense>
);

export default App;
