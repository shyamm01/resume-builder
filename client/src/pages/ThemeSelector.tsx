import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useApi } from "../lib/api";
import { toast } from "sonner";

export default function ThemeSelector() {
  const [themeVal, setThemeVal] = useState<"light" | "dark">("light");
  const [saving, setSaving] = useState(false);
  const { user, theme, setTheme } = useAuth();
  const api = useApi();

  useEffect(() => {
    // Sync local themeVal with current theme on mount or theme change
    if (theme) {
      setThemeVal(theme);
    }
  }, [theme]);
  console.log("Current theme:", user);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/user/theme`, { theme: themeVal });

      setTheme(themeVal);
      toast.success("Theme updated!");
    } catch (err) {
      toast.error("Failed to update theme.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-8 shadow rounded text-gray-900 dark:text-white transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Theme</h2>

      <select
        className="w-full border p-2 rounded mb-4 text-gray-900 disabled:opacity-50"
        value={themeVal}
        disabled={saving}
        onChange={(e) => setThemeVal(e.target.value as "light" | "dark")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <div
        className={`p-4 rounded shadow mb-4 transition-all ${
          themeVal === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        <p>This is how your resume will look in {themeVal} mode.</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 ${
          saving ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}
