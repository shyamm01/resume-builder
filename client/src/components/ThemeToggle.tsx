import { Moon, Sun } from "lucide-react";

import useAuth from "../hooks/useAuth";

const FloatingThemeToggle = () => {
  const { user, theme, setTheme } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      title="Toggle Theme"
      className="fixed bottom-5 right-5 z-50 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg hover:scale-105 transition-all"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default FloatingThemeToggle;
