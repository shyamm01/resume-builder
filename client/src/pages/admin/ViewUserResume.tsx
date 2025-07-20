import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useApi } from "../../lib/api";

interface Resume {
  _id: string;
  url: string;
  status: "Pending" | "Approved" | "Rejected";
  uploadedAt: string;
}

interface User {
  name: string;
  email: string;
}

const ViewUserResume = () => {
  const { userId } = useParams<{ userId: string }>();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const api = useApi();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/admin/resumes/${userId}`);
      setResumes(data.resumes);
      setUserInfo(data.user);
    } catch (error: any) {
      toast.error("Error fetching resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchResume();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded">
      <div className="mb-4">
        <button
          onClick={() => navigate(`/admin/resumes`)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className=" bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">User Resume List</h2>

        {userInfo && (
          <div className="mb-6">
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
          </div>
        )}

        {loading ? (
          <p>Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gray-500">No resumes uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3 border dark:border-gray-700 text-left">
                    #
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-left">
                    Resume
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-left">
                    Status
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-left">
                    Uploaded At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {resumes.map((res, index) => (
                  <tr
                    key={res._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-3 border dark:border-gray-700">
                      {index + 1}
                    </td>
                    <td className="p-3 border dark:border-gray-700">
                      <Link
                        to={`${location.pathname}/${res._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        View Resume
                      </Link>
                    </td>
                    <td className="p-3 border dark:border-gray-700">
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          res.resumeStatus === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : res.resumeStatus === "Rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }`}
                      >
                        {res.resumeStatus || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 border dark:border-gray-700">
                      {new Date(res.uploadedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUserResume;
