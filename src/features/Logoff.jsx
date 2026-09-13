import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Logoff.module.css";

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setError(null);
    setIsLoggingOff(true);
    const result = await logout();
    if (!result.success) {
      setError(result.error);
    }
    setIsLoggingOff(false);
    navigate("/login");
  }

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}
      <button
        onClick={handleClick}
        disabled={isLoggingOff}
        className={styles.button}
      >
        {isLoggingOff ? "Logging Off..." : "Log Off"}
      </button>
    </div>
  );
}
