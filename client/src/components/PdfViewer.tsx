import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface PPdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PPdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.PDFRenderTask | null>(null);

  useEffect(() => {
    const renderPDF = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Cancel previous render task if running
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // Start new render
        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") {
          toast.error("Failed to render PDF: " + error.message);
        }
      }
    };

    renderPDF();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [url]);

  return <canvas ref={canvasRef} className="w-full border" />;
}
