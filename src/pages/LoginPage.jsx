import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const [error, setError] = useState(null);

  // get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || "/todos";

  // redirect is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // handle login form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoggingOn(true);
    const result = await login(email, password);
    // useEffect handles redirect on success
    if (!result.success) {
      setError(result.error);
    }
    setIsLoggingOn(false);
  }

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={handleChangeEmail}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handleChangePassword}
        required
      />
      <button disabled={isLoggingOn}>
        {isLoggingOn ? "Logging in..." : "Log On"}
      </button>
    </form>
  );
}

export default LoginPage;
