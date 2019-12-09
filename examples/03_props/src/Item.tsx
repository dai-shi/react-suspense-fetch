// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import React, { useState, useTransition } from 'react';

import { run, prepare, FetchResult } from 'react-suspense-fetch';

import { fetchFunc } from './App';
import DisplayData from './DisplayData';

type Props = {
  initialResult: FetchResult<{ data: { first_name: string } }, string>;
};

const Item: React.FC<Props> = ({ initialResult }) => {
  const [id, setId] = useState(() => String(Math.ceil(Math.random() * 10)));
  const [result, setResult] = useState(initialResult);
  run(result, id); // only effective for the first render
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
