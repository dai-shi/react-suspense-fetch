// eslint-disable-next-line spaced-comment
/// <reference types="react/experimental" />

import React, {
  unstable_useTransition as useTransition,
  useState,
} from 'react';

import { UserData } from './fetchFuncs';

type Props = {
  result: UserData;
  update: (first_name: string) => void;
};

const DisplayData: React.FC<Props> = ({ result, update }) => {
  const [startTransition, isPending] = useTransition();
  const [first_name, setFirstName] = useState(result.data.first_name);
  const onClick = () => {
    startTransition(() => {
      update(first_name);
    });
  };
  return (
    <div>
      <div>
        First Name:{' '}
        <input
          type='text'
          value={first_name}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
      </div>
      <button type='button' onClick={onClick}>
        Update
      </button>
      {isPending && 'Pending...'}
    </div>
  );
};

export default DisplayData;
