import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { baseUrl, useApi } from "../../lib/api";
import PdfViewer from "../../components/PdfViewer";

const UserResumeView = () => {
  const { userId, resumeId } = useParams<{
    userId: string;
    resumeId: string;
  }>();

  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const api = useApi();

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/admin/resumes/${userId}/${resumeId}`);
      console.log("Fetched resume data:", `${baseUrl}/${data.resume.path}`);

      setResumeUrl(`${baseUrl}/${data.resume.path}`);
      setUserInfo(data.user);
      setStatus(data.status); // 'pending' | 'approved' | 'rejected'
    } catch (error: any) {
      toast.error("Error fetching resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject") => {
    setProcessing(true);
    try {
      await api.put(`/admin/resumes/${userId}/${resumeId}/${action}`);
      setStatus(action === "approve" ? "approved" : "rejected");
      toast.success(`Resume ${action}d successfully.`);
    } catch (error: any) {
      toast.error(`Failed to ${action} resume: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (userId && resumeId) {
      fetchResume();
    }
  }, [userId, resumeId]);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(`/admin/resumes/${userId}`)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">User's Resume</h2>

      {loading ? (
        <p>Loading resume...</p>
      ) : (
        <>
          {resumeUrl ? (
            <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800">
              <PdfViewer url={resumeUrl} />
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-blue-600 dark:text-blue-400 underline text-sm"
              >
                View full resume in new tab
              </a>
            </div>
          ) : (
            <p className="text-red-500">Resume not found.</p>
          )}

          <div className="mt-6 flex gap-4">
            <button
              disabled={processing || status === "approved"}
              onClick={() => handleAction("approve")}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
            >
              {status === "approved" ? "Approved" : "Approve"}
            </button>
            <button
              disabled={processing || status === "rejected"}
              onClick={() => handleAction("reject")}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 cursor-pointer"
            >
              {status === "rejected" ? "Rejected" : "Reject"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserResumeView;
