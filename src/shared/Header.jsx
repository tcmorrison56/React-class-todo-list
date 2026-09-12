import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";

export default function Header() {
  const { isAuthenticated, email } = useAuth();
  return (
    <>
      <h1>Todo List</h1>
      <Navigation />
      {isAuthenticated && (
        <>
          <p>Welcome {email}</p>
          <Logoff />
        </>
      )}
    </>
  );
}
