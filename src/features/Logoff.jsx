import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setError(null);
    setIsLoggingOff(true);
    const res = await logout();
    if (res.success) {
      navigate("/login");
    } else {
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
