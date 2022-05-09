import React, { useState, useTransition } from 'react';

import { fetchUserData } from './UserPage.data';

const UserPage = React.lazy(() => import('./UserPage'));

const urlParams = new URLSearchParams(window.location.search);
const initialId = urlParams.get('id');
const initialPage = initialId ? <UserPage getUser={fetchUserData(initialId)} /> : null;

const Main = () => {
  const [isPending, startTransition] = useTransition();
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
