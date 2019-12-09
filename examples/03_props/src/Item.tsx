// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import React, { useState, useTransition } from 'react';

import { prepare, FetchResult } from 'react-suspense-fetch';

import { fetchFunc } from './App';
import DisplayData from './DisplayData';

type Props = {
  initialId: string;
  initialResult: FetchResult<{ data: { first_name: string } }, string>;
};

const Item: React.FC<Props> = ({ initialId, initialResult }) => {
  const [id, setId] = useState(initialId);
  const [result, setResult] = useState(initialResult);
  const [startTransition, isPending] = useTransition({ timeoutMs: 1000 });
  const onClick = () => {
    startTransition(() => {
      setResult(prepare(fetchFunc));
    });
  };
  return (
    <div>
      User ID:
      <input value={id} onChange={e => setId(e.target.value)} />
      <button type="button" onClick={onClick}>Refetch</button>
      {isPending && 'Pending...'}
      <DisplayData id={id} result={result} />
    </div>
  );
};

export default Item;
