import React, { Suspense, useContext, useState } from 'react';

import { run } from 'react-suspense-fetch';

import { AuthContext } from './App';
import UserData from './UserData';

const Login: React.FC = () => {
  const AuthState = useContext(AuthContext);
  if (!AuthState) throw new Error('Missing AuthContext.Provider');
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [isPending, setIsPending] = useState(false);
  const onClick = () => {
    setIsPending(true); // we can't use transison because there's no transition...
    run(AuthState, { email, password });
  };
  return (
    <div>
      <div>
        Email:
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={onClick}>Login</button>
        {isPending && 'Pending...'}
      </div>
    </div>
  );
};

const Main: React.FC = () => {
  const AuthState = useContext(AuthContext);
  if (!AuthState) throw new Error('Missing AuthContext.Provider');
  return (
    <Suspense fallback={<Login />}>
      <UserData />
    </Suspense>
  );
};

export default Main;
