import React, { useState } from 'react';

import { prefetch } from 'react-suspense-fetch';

import { fetchUser } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  initialId: string;
  initialResult: { data: { first_name: string } };
};

const Item: React.FC<Props> = ({ initialId, initialResult }) => {
  const [id, setId] = useState(initialId);
  const [result, setResult] = useState(initialResult);
  const refetch = (nextId: string) => {
    setResult(prefetch(fetchUser, nextId));
  };
  return (
    <div>
      User ID: <input value={id} onChange={(e) => setId(e.target.value)} />
      <DisplayData id={id} result={result} refetch={refetch} />
    </div>
  );
};

export default Item;
