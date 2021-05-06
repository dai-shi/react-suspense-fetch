// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, { unstable_useTransition as useTransition } from 'react';

import { UserData } from './fetchFuncs';

type Props = {
  id: string;
  result: UserData;
  update: (id: string) => void;
};

const DisplayData: React.FC<Props> = ({ id, result, update }) => {
  const [isPending, startTransition] = useTransition() as any; // FIXME
  const onClick = () => {
    startTransition(() => {
      update(id);
    });
  };
  return (
    <div>
      <div>First Name: {result.data.first_name}</div>
      <button type="button" onClick={onClick}>Update</button>
      {isPending && 'Pending...'}
    </div>
  );
};

export default DisplayData;
