import React from 'react';

import { run, FetchResult } from 'react-suspense-fetch';

type Props = {
  id: string;
  result: FetchResult<{ data: { first_name: string } }, string>;
};

const DisplayData: React.FC<Props> = ({ id, result }) => {
  run(result, id);
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
    </div>
  );
};

export default DisplayData;
