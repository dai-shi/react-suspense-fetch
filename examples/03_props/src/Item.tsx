import React from 'react';

import { run, FetchResult } from 'react-suspense-fetch';

import DisplayData from './DisplayData';

type Props = {
  id: string;
  result: FetchResult<{ data: { first_name: string } }, string>;
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
