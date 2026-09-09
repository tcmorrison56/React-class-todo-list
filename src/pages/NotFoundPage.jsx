import { Link } from "react-router";

function NotFoundPage() {
  return (
    <>
      <p>404 page not found</p>
      <Link to="/">Back Home</Link>
      <Link to="/about">About</Link>
      <Link to="/todos">Todo list</Link>
      <Link to="/profile">Profile</Link>
    </>
  );
}

export default NotFoundPage;
