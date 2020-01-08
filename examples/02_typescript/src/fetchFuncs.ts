export type UserData = {
  data: {
    first_name: string;
  };
};

export const fetchUser = async (userId: string) => {
  const res = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
  const data = await res.json();
  return data as UserData;
};
