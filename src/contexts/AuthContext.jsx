import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  // state for authentication
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // login and logout functions
  const login = async (userEmail, password) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: "include",
      };

      const res = await fetch("/api/users/logon", options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: `Authentication failed: ${data?.message}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Network error during login: ${error}`,
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail("");
      setToken("");
      return { success: true };
    }

    const options = {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-TOKEN": token },
    };

    try {
      const res = await fetch("api/users/logoff", options);
      const data = await res.json();

      if (res.status === 200) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: `Failed to logout: ${data?.message}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to logout: ${error}`,
      };
    } finally {
      setEmail("");
      setToken("");
    }
  };

  // context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
