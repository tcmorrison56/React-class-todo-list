import { Link } from "react-router";

function NotFound() {
  return (
    <>
      <p>404 page not found</p>
      <Link path="/">Back Home</Link>
    </>
  );
}

export default NotFound;
