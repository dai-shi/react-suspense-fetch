import React, { Suspense, createContext } from 'react';

import { prepare } from 'react-suspense-fetch';

import Main from './Main';

const loginFunc = async ({ email, password }: { email: string; password: string }) => {
  const res = await fetch('https://reqres.in/api/login?delay=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (res.status !== 200) throw new Error('login failed');
  const data = await res.json();
  return data as { token: string };
};

const AuthState = prepare(loginFunc);

export const AuthContext = createContext<typeof AuthState | null>(null);

const App: React.FC = () => (
  <Suspense fallback={<span>Loading... (never shown)</span>}>
    <AuthContext.Provider value={AuthState}>
      <Main />
    </AuthContext.Provider>
  </Suspense>
);

export default App;
