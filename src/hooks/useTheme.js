import {useCallback, useEffect, useState} from "react";

const STORAGE_KEY = "dp-theme";
const LIGHT = "light";
const DARK = "dark";

const readStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === LIGHT || stored === DARK ? stored : null;
  } catch {
    // Private browsing or disabled storage: fall back to the media query.
    return null;
  }
};

const systemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;

const useTheme = () => {
  const [theme, setTheme] = useState(() => readStoredTheme() ?? systemTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort only.
    }
  }, [theme]);

  // Follow the OS only while the user has not made an explicit choice.
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return undefined;

    const onChange = (event) => {
      if (readStoredTheme()) return;
      setTheme(event.matches ? DARK : LIGHT);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === DARK ? LIGHT : DARK));
  }, []);

  return {theme, isDark: theme === DARK, toggleTheme};
};

export default useTheme;
