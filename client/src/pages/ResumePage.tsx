import { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../components/PdfViewer";
import ThemeToggle from "../components/ThemeToggle";

const ResumePage: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ user: { resumeUrl?: string } }>(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resumePath = response.data.user.resumeUrl;
        if (resumePath) {
          setResumeUrl(`http://localhost:5000/${resumePath}`);
        }
      } catch (error) {
        console.error("Error loading resume:", error);
      }
    };

    fetchResume();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Resume</h1>
      <ThemeToggle />
      {resumeUrl ? (
        <>
          <PdfViewer url={resumeUrl} />
          <a
            href={resumeUrl}
            download
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Resume
          </a>
        </>
      ) : (
        <p>No resume uploaded yet.</p>
      )}
    </div>
  );
};

export default ResumePage;
