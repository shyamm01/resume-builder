import { useEffect, useState } from "react";
import { baseUrl, useApi } from "../lib/api";
import { toast } from "sonner";
import PdfViewer from "../components/PdfViewer";

export default function ResumeEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const api = useApi();

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/resume`);
      const url = `${baseUrl}/${data.resumeUrl}`;
      setResumeUrl(url);
    } catch (err) {
      toast.error("Failed to load existing resume." + err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("resume", selectedFile);
    setUploading(true);

    try {
      const { data } = await api.post("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeUrl(`${baseUrl}/${data.resumeUrl}`);
      toast.success("Resume uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded transition-colors">
      <h2 className="text-2xl font-bold mb-6">Resume Editor</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        aria-label="Upload resume"
        className="block mb-4"
      />

      {previewUrl && (
        <div className="border rounded p-4 mt-4 bg-gray-50 dark:bg-gray-800">
          <p className="font-medium mb-2">Preview (not yet uploaded):</p>
          <PdfViewer url={previewUrl} />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {resumeUrl && (
        <div className="mt-8">
          <p className="font-medium mb-2">Your uploaded resume:</p>
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
        </div>
      )}
    </div>
  );
}
