import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/* eslint-disable-next-line react-refresh/only-export-components */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () =>
    theme === "light" ? setTheme("dark") : setTheme("light");

  const value = { theme, toggle };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
