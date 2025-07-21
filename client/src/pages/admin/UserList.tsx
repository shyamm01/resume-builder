import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "../../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  theme?: "light" | "dark";
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      // console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-100 p-8 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="p-3 border dark:border-gray-700">Name</th>
                <th className="p-3 border dark:border-gray-700">Email</th>
                <th className="p-3 border dark:border-gray-700">Role</th>
                <th className="p-3 border dark:border-gray-700">Theme</th>
                <th className="p-3 border dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="p-3 border dark:border-gray-700 text-center">
                    {user.name}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center">
                    {user.email}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center capitalize">
                    {user.role}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center capitalize">
                    {user.theme || "-"}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center">
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
