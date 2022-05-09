import React from 'react';

import { store } from './fetchFuncs';
import DisplayData from './DisplayData';

type Props = {
  id: string;
};

const Item = ({ id }: Props) => {
  const result = store.get(id);
  return (
    <div>
      User ID: {id}
      <DisplayData result={result} />
    </div>
  );
};

export default Item;
