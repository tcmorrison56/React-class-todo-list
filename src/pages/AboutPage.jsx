import { Link } from "react-router";
import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>About Todo App</h2>
      <p className={styles.intro}>
        This is a todo list application built as a learning project to practice
        modern React patterns and full-stack development concepts
      </p>

      <div>
        <h3 className={styles.subheading}>Features</h3>
        <ul className={styles.list}>
          <li>User authentication with secure session handling</li>
          <li>Create, complete, edit, and delete todos</li>
          <li>Sort todos by creation date or title</li>
          <li>Filter and search todos by title</li>
          <li>Filter todos by status: all, active, completed</li>
          <li>Optimistic UI updates with error rollback</li>
        </ul>
      </div>

      <div>
        <h3 className={styles.subheading}>Built with</h3>
        <ul className={styles.list}>
          <li>React</li>
          <li>React Router</li>
          <li>Vite</li>
        </ul>
      </div>

      <Link to="/" className={styles.link}>
        Back to Home
      </Link>
    </div>
  );
}

export default AboutPage;
