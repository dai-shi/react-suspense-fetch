export const fetchUser = async (userId: string) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();

export default null;
