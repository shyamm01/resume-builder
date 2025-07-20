import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { baseUrl, useApi } from "../lib/api";
import { toast } from "sonner";
import "pdfjs-dist/web/pdf_viewer.css";
import PdfViewer from "../components/PdfViewer";

// Set the correct PDF.js worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ResumeViewer() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useApi();

  const fetchResume = async () => {
    try {
      const { data } = await api.get("/resume");

      // Make sure resumeUrl is absolute and valid
      const resumePath = data.resumeUrl.startsWith("/")
        ? data.resumeUrl.slice(1)
        : data.resumeUrl;

      const url = `${baseUrl}/${resumePath}`;
      console.log("Resume URL:", url);
      setResumeUrl(url);
    } catch (err) {
      toast.error("Failed to load resume.");
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  useEffect(() => {
    if (!resumeUrl) return;

    const renderPDF = async () => {
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: resumeUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (error: any) {
        console.error("PDF render error:", error);
        toast.error("PDF render failed: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    renderPDF();
  }, [resumeUrl]);

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded shadow transition-colors">
      <h2 className="text-2xl font-bold mb-4">Your Uploaded Resume</h2>
      {loading && <p>Loading PDF...</p>}
      {!loading && resumeUrl && <PdfViewer url={resumeUrl} />}
      {!loading && !resumeUrl && (
        <p className="text-red-500">No resume found. Please upload one.</p>
      )}
    </div>
  );
}
