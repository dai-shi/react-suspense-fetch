import React from 'react';

import { UserData } from './UserPage.data';

type Props = {
  getUser: () => UserData;
};

const UserPage: React.FC<Props> = ({ getUser }) => (
  <div>
    <div>User ID: {getUser().data.id}</div>
    <div>First Name: {getUser().data.first_name}</div>
  </div>
);

export default UserPage;
