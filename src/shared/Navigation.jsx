import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
  const { isAuthenticated } = useAuth();

  const linkClassName = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.activeLink}` : styles.link;

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <NavLink to="/about" className={linkClassName}>
            About
          </NavLink>
        </li>
        {!isAuthenticated && (
          <li>
            <NavLink to="/login" className={linkClassName}>
              Login
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/todos" className={linkClassName}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={linkClassName}>
                Profile
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
