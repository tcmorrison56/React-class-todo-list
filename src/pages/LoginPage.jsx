import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./LoginPage.module.css";

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
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Log In</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChangeEmail}
            required
            maxLength={254}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChangePassword}
            required
            maxLength={128}
            className={styles.input}
          />
        </div>
        <button disabled={isLoggingOn} className={styles.button}>
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
