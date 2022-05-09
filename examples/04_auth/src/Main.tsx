import React, { useState, useTransition } from 'react';

import { createFetchStore } from 'react-suspense-fetch';

import { useAuthContext } from './AuthContext';
import UserData from './UserData';

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

const loginStore = createFetchStore(loginFunc);

const Login = () => {
  const [, setAuthState] = useAuthContext();
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      const auth = { email, password };
      loginStore.prefetch(auth);
      setAuthState({ getToken: () => loginStore.get(auth).token });
    });
  };
  return (
    <div>
      <div>
        Email:
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={onClick}>Login</button>
        {isPending && 'Pending...'}
      </div>
    </div>
  );
};

const Main = () => {
  const [authState] = useAuthContext();
  if (!authState) return <Login />;
  return <UserData />;
};

export default Main;
