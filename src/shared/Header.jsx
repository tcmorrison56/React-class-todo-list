import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";
import styles from "./Header.module.css";

export default function Header() {
  const { isAuthenticated, email } = useAuth();
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Todo List</h1>
      <Navigation />
      {isAuthenticated && (
        <div className={styles.userRow}>
          <p className={styles.welcome}>Welcome {email}</p>
          <Logoff />
        </div>
      )}
    </header>
  );
}
