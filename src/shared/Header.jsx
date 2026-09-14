import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";
import styles from "./Header.module.css";

export default function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>TiMo ToDo</h1>
        <div className={styles.navRow}>
          <Navigation />
          {isAuthenticated && <Logoff />}
        </div>
      </div>
    </header>
  );
}
