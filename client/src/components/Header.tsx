import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-700 dark:bg-gray-900 text-white dark:text-gray-100 px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <Link
        to="/"
        className="text-lg font-bold hover:text-blue-200 dark:hover:text-blue-400 transition-colors"
      >
        Resume Builder
      </Link>

      {user ? (
        <nav className="flex items-center space-x-4">
          {user.role === "admin" ? (
            <>
              <Link
                to="/admin/dashboard"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                Users
              </Link>
              <Link
                to="/admin/resumes"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                Resumes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/resume"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                Edit Resume
              </Link>
              <Link
                to="/viewer"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                View Resume
              </Link>
              <Link
                to="/theme"
                className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
              >
                Themes
              </Link>
            </>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </nav>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:underline hover:text-blue-200 dark:hover:text-blue-400"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
