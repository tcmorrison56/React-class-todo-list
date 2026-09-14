import { useState, useEffect } from "react";
import { useLocation } from "react-router";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () =>
    isMenuOpen === false ? setIsMenuOpen(true) : setIsMenuOpen(false);

  useEffect(() => {
    // This only fires on real route changes (location.pathname), and setting
    // isMenuOpen to false when it's already false is a no-op, so this doesn't
    // risk the cascading re-renders the rule is generally guarding against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <button
            onClick={toggle}
            className={styles.themeToggle}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          <h1 className={styles.title}>TiMo ToDo</h1>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMenuOpen}
            className={styles.menuToggle}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        <div
          className={`${styles.navRow} ${isMenuOpen ? styles.navRowOpen : ""}`}
        >
          <Navigation />
          {isAuthenticated && <Logoff />}
        </div>
      </div>
    </header>
  );
}
