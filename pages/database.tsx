/* eslint-disable @typescript-eslint/explicit-function-return-type */
import useSWR from "swr";

export default function App() {
  const { data, error } = useSWR("/api/users", fetch);
  if (error) return <div>An error occured.</div>;
  if (!data) return <div>Loading ...</div>;
  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
