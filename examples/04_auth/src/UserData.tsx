import React from 'react';

import { createFetchStore } from 'react-suspense-fetch';

import { useAuthContext } from './AuthContext';

const fetchUserDataFunc = async (token: string) => {
  const res = await fetch('https://reqres.in/api/items?delay=2', {
    headers: {
      Token: token,
    },
  });
  const data = await res.json();
  return data as { data: { id: number; name: string }[] };
};

const userDataStore = createFetchStore(fetchUserDataFunc);

const UserData = () => {
  const [authState] = useAuthContext();
  if (!authState) throw new Error('no authState');
  const result = userDataStore.get(authState.getToken());
  return (
    <ul>
      {result.data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default UserData;
