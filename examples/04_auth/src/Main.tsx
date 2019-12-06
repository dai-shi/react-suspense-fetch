import React, { Suspense, useContext, useState } from 'react';

import { run } from 'react-suspense-fetch';

import { AuthContext } from './App';
import UserData from './UserData';

const Main: React.FC = () => {
  const AuthState = useContext(AuthContext);
  if (!AuthState) throw new Error('Missing AuthContext.Provider');
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
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
        <button type="button" onClick={() => run(AuthState, { email, password })}>Login</button>
      </div>
      <Suspense fallback={<div>Waiting for Login...</div>}>
        <UserData />
      </Suspense>
    </div>
  );
};

export default Main;
