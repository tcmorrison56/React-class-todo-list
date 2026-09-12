import { Link } from "react-router";

function NotFoundPage() {
  return (
    <>
      <p>404: Sorry the page you were looking for doesn't exist</p>
      <ul>
        <li>
          <Link to="/">Back Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/todos">Todo list</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </>
  );
}

export default NotFoundPage;
