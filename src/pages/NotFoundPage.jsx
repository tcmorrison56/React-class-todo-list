import { Link } from "react-router";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <p className={styles.message}>
        404: Sorry the page you were looking for doesn't exist
      </p>
      <ul className={styles.links}>
        <li>
          <Link to="/" className={styles.link}>
            Back Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={styles.link}>
            About
          </Link>
        </li>
        <li>
          <Link to="/todos" className={styles.link}>
            Todo list
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.link}>
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
