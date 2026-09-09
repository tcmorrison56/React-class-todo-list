import { Link } from "react-router";

function NotFoundPage() {
  return (
    <>
      <p>404 page not found</p>
      <Link to="/">Back Home</Link>
    </>
  );
}

export default NotFoundPage;
