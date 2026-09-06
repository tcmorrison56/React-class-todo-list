import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { email } = useAuth();
  return (
    <>
      <h1>Todo List</h1>
      {email && <p>Welcome {email}</p>}
    </>
  );
}
