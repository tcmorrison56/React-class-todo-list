import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, email } = useAuth();
  return (
    <>
      <h1>Todo List</h1>
      {isAuthenticated && <p>Welcome {email}</p>}
    </>
  );
}
