import React, { useTransition } from 'react';

import { UserData } from './fetchFuncs';

type Props = {
  id: string;
  result: UserData;
  update: (id: string) => void;
};

const DisplayData = ({ id, result, update }: Props) => {
  const [isPending, startTransition] = useTransition();
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
