// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, { useState, unstable_useTransition as useTransition } from 'react';

import { fetchUserData } from './UserPage.data';

const UserPage = React.lazy(() => import('./UserPage'));

const urlParams = new URLSearchParams(window.location.search);
const initialId = urlParams.get('id');
const initialPage = initialId ? <UserPage user={fetchUserData(initialId)} /> : null;

const Main: React.FC = () => {
  const [startTransition, isPending] = useTransition();
  const [userId, setUserId] = useState(initialId);
  const [page, setPage] = useState(initialPage);
  const onClick = () => {
    startTransition(() => {
      const nextId = userId ? String(Number(userId) + 1) : '1';
      setUserId(nextId);
      setPage(<UserPage user={fetchUserData(nextId)} />);
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
