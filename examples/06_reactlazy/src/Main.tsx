// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, { useState, unstable_useTransition as useTransition } from 'react';

import { fetchUserData } from './UserPage.data';

const UserPage = React.lazy(() => import('./UserPage'));

const urlParams = new URLSearchParams(window.location.search);
const initialId = urlParams.get('id');
const initialPage = initialId ? <UserPage getUser={fetchUserData(initialId)} /> : null;

const Main: React.FC = () => {
  const [isPending, startTransition] = useTransition() as any; // FIXME
  const [userId, setUserId] = useState(initialId);
  const [page, setPage] = useState(initialPage);
  const onClick = () => {
    startTransition(() => {
      const nextId = userId ? String(Number(userId) + 1) : '1';
      setUserId(nextId);
      setPage(<UserPage getUser={fetchUserData(nextId)} />);
    });
  };
  return (
    <div>
      <button type="button" onClick={onClick}>Next User</button>
      {isPending && <span>Pending...</span>}
      {page}
    </div>
  );
};

export default Main;
