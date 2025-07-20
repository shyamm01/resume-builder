import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useApi } from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const api = useApi();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      const { user, token } = res.data;

      login(user, token);
      navigate("/resume");
    } catch (err: any) {
      // console.log("Registration error:", err);

      const message = err.response?.data?.msg || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 shadow rounded transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-2 rounded transition-colors"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-2 rounded transition-colors"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-2 rounded transition-colors"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}
