import { createFetchStore } from 'react-suspense-fetch';

export type FetchResult = { data: { first_name: string } };

const fetchFunc = async (userId: string) => {
  const res = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
  const data = await res.json();
  return data as FetchResult;
};

export const store = createFetchStore(fetchFunc);
