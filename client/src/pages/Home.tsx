// src/pages/Home.tsx
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-4xl text-center bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-10 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-6">
          Welcome to ResumeBuilder
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Create, upload, and showcase your professional resume with themes.
          Admins can manage users and resumes effortlessly.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-800 dark:text-white px-6 py-3 rounded-lg text-lg shadow transition-all"
          >
            Login
          </Link>
        </div>
        <div className="mt-10">
          <img
            src="./resume.svg"
            alt="Resume illustration"
            className="mx-auto w-80 md:w-96"
          />
        </div>
      </div>
    </div>
  );
}
