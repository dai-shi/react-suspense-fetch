import React, { useContext } from 'react';

import { prepare, run } from 'react-suspense-fetch';

import { AuthContext } from './App';

const fetchUserDataFunc = async (token: string) => {
  const res = await fetch('https://reqres.in/api/items?delay=2', {
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
  const [authState] = useContext(AuthContext);
  if (!authState) throw new Error('no authState');
  run(UserItems, authState);
  return (
    <ul>
      {UserItems.data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default UserData;
