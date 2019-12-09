import React, { Suspense, useContext } from 'react';

import { prepare, run } from 'react-suspense-fetch';

import { AuthContext } from './App';

const fetchUserDataFunc = async (token: string) => {
  const res = await fetch('https://reqres.in/api/items?delay=1', {
    headers: {
      Token: token,
    },
  });
  const data = await res.json();
  return data as { data: { id: number; name: string }[] };
};

const extractToken = (authState: { token: string }) => authState.token;

const UserItems = prepare(fetchUserDataFunc, extractToken);

const UserData: React.FC = () => {
  const AuthState = useContext(AuthContext);
  if (!AuthState) throw new Error('Missing AuthContext.Provider');
  run(UserItems, AuthState);
  return (
    <Suspense fallback={<div>Fetching data...</div>}>
      <ul>
        {UserItems.data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </Suspense>
  );
};

export default UserData;
