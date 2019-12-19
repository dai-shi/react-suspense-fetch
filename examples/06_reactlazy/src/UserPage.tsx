import React from 'react';

import { UserData } from './UserPage.data';

type Props = {
  user: UserData;
};

const UserPage: React.FC<Props> = ({ user }) => (
  <div>
    <div>User ID: {user.data.id}</div>
    <div>First Name: {user.data.first_name}</div>
  </div>
);

export default UserPage;
