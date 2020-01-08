import React from 'react';

import { run, Suspendable } from 'react-suspense-fetch';

import { FetchResult } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  id: string;
  result: Suspendable<FetchResult, string>;
};

const Item: React.FC<Props> = ({ id, result }) => {
  run(result, id); // only effective for the first render
  return (
    <div>
      User ID: {id}
      <DisplayData result={result} />
    </div>
  );
};

export default Item;
