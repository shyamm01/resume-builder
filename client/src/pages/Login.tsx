import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useApi } from "../lib/api";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const api = useApi();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;

      login(user, token);
      toast.success("Logged in successfully!");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/resume");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 shadow rounded transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-2 rounded transition-colors"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-2 rounded transition-colors"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
