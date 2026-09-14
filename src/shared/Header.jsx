import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";
import SunIcon from "../assets/icons/SunIcon";
import MoonIcon from "../assets/icons/MoonIcon";
import styles from "./Header.module.css";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>TiMo ToDo</h1>
        <div className={styles.navRow}>
          <Navigation />
          <div className={styles.actions}>
            <button
              onClick={toggle}
              className={styles.themeToggle}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            {isAuthenticated && <Logoff />}
          </div>
        </div>
      </div>
    </header>
  );
}
