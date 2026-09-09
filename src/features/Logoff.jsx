import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Logoff() {
  const { logout } = useAuth();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setError(null);
    setIsLoggingOff(true);
    const res = await logout();
    if (!res.success) {
      setError(res.error);
    }
    setIsLoggingOff(false);
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={handleClick} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging Off..." : "Log Off"}
      </button>
    </div>
  );
}
