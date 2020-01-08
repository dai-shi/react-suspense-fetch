import React, { useState } from 'react';

import { refetch, Suspendable } from 'react-suspense-fetch';

import { UserData } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  initialId: string;
  initialResult: Suspendable<UserData, string>;
};

const Item: React.FC<Props> = ({ initialId, initialResult }) => {
  const [id, setId] = useState(initialId);
  const [result, setResult] = useState(initialResult);
  const update = (nextId: string) => {
    setResult(refetch(result, nextId));
  };
  return (
    <div>
      User ID: <input value={id} onChange={(e) => setId(e.target.value)} />
      <DisplayData id={id} result={result} update={update} />
    </div>
  );
};

export default Item;
