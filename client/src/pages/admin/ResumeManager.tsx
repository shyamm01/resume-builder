import { useEffect, useState } from "react";
import { toast } from "sonner";
import { baseUrl, useApi } from "../../lib/api";
import { Link } from "react-router";

export default function ResumeManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const api = useApi();
  console.log(users);

  const fetchUsersWithResumes = async () => {
    try {
      const { data } = await api.get("/admin/users-with-resumes");
      setUsers(data.usersWithResumes);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (userId: string, theme: string) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/api/admin/user/${userId}/theme`, { theme });
      toast.success("Theme updated");
      await fetchUsersWithResumes();
    } catch (err) {
      toast.error("Failed to update theme");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const confirmed = confirm(
        "Are you sure you want to approve this resume?"
      );
      if (!confirmed) return;
      const user = users.find((user) => user._id === userId);
      console.log("User:", user);
      const resumeId = user?.resumeData?.resumeId;
      if (!resumeId) {
        toast.error("Resume ID not found for this user");
        return;
      }
      setUpdatingUserId(userId);
      await api.put(`/admin/resumes/${userId}/${resumeId}/approve`);
      toast.success("Resume approved");
      await fetchUsersWithResumes();
    } catch (err) {
      toast.error("Failed to approve resume");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleReject = async (userId: string) => {
    const confirmed = confirm("Are you sure you want to reject this resume?");
    if (!confirmed) return;

    try {
      setUpdatingUserId(userId);
      await api.put(`/api/admin/user/${userId}/resume/reject`);
      toast.success("Resume rejected");
      await fetchUsersWithResumes();
    } catch (err) {
      toast.error("Failed to reject resume");
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsersWithResumes();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Resumes</h2>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No users with resumes yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="p-3 border dark:border-gray-700">Name</th>
                <th className="p-3 border dark:border-gray-700">Resume</th>
                <th className="p-3 border dark:border-gray-700">Status</th>
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
                  <td className="p-3 border dark:border-gray-700">
                    {user.name}
                  </td>
                  <td className="p-3 border dark:border-gray-700">
                    {user.resumeData?.length}
                  </td>
                  <td className="p-3 border dark:border-gray-700">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        user.resumeData?.resumeStatus === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : user.resumeData?.resumeStatus === "Rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                      }`}
                    >
                      {user.resumeData?.resumeStatus || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 border dark:border-gray-700">
                    <select
                      value={user.theme || "light"}
                      onChange={(e) =>
                        e.target.value !== user.theme &&
                        updateTheme(user._id, e.target.value)
                      }
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                      disabled={updatingUserId === user._id}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </td>
                  <td className="p-3 border dark:border-gray-700 space-x-2">
                    <Link
                      to={`/admin/resumes/${user._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </Link>
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
