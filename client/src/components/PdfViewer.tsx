import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport,
          };
          await page.render(renderContext).promise;
        }
      } catch (error) {
        console.error("Error rendering PDF:", error);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div className="border dark:border-gray-600 rounded shadow dark:shadow-md bg-white dark:bg-gray-800 p-4 overflow-auto transition-colors duration-300">
      <canvas ref={canvasRef} className="mx-auto block" />
    </div>
  );
};

export default PdfViewer;
