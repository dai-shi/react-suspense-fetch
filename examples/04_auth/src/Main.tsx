// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, { useState, unstable_useTransition as useTransition } from 'react';

import { prefetch } from 'react-suspense-fetch';

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

const Login: React.FC = () => {
  const [, setAuthState] = useAuthContext();
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [startTransition, isPending] = useTransition();
  const onClick = () => {
    startTransition(() => {
      setAuthState(prefetch(loginFunc, { email, password }));
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

const Main: React.FC = () => {
  const [authState] = useAuthContext();
  if (!authState) return <Login />;
  return <UserData />;
};

export default Main;
