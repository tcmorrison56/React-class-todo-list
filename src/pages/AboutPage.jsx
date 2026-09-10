import { Link } from "react-router";

function AboutPage() {
  return (
    <div>
      <h2>About Todo App</h2>
      <p>
        This is a todo list application built as a learning project to practice
        modern React patterns and full-stack development concepts
      </p>

      <h3>Features</h3>
      <ul>
        <li>User authentication with secure session handling</li>
        <li>Create, complete, and edit todos</li>
        <li>Sort todos by creation date or title</li>
        <li>Filter and search todos by title</li>
        <li>Filter todos by status - all, active, completed</li>
        <li>Optimistic UI updates with error rollback</li>
      </ul>

      <h3>Built with</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>

      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default AboutPage;
