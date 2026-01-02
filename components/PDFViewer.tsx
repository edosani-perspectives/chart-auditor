import React, { useState, useEffect, useRef } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  patientName: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath, patientName }) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const workerScript = document.createElement('script');
      workerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      document.head.appendChild(workerScript);
      
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      loadPDF();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [pdfPath]);

  const loadPDF = async () => {
    if (!window.pdfjsLib) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to load the PDF from the public folder
      const fullPath = `/${pdfPath}`;
      const pdf = await window.pdfjsLib.getDocument(fullPath).promise;
      setPdfDoc(pdf);
      setPageNum(1);
      setLoading(false);
    } catch (err) {
      setError(`Chart not available for ${patientName}. Please ensure the PDF file is uploaded to the system.`);
      setLoading(false);
    }
  };

  const renderPage = async (num: number) => {
    if (!pdfDoc) return;

    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale });
    
    const canvas = canvasRefs.current[num];
    if (!canvas) return;

    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pageNum, scale]);

  const goToPrevPage = () => {
    if (pageNum <= 1) return;
    setPageNum(pageNum - 1);
  };

  const goToNextPage = () => {
    if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
    setPageNum(pageNum + 1);
  };

  const zoomIn = () => {
    setScale(Math.min(scale + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#1c1c1e] rounded-[40px] border border-black/10 dark:border-white/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">Loading Chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#1c1c1e] rounded-[40px] border border-black/10 dark:border-white/5">
        <div className="text-center p-8">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">Chart Not Available</h3>
          <p className="text-gray-500 dark:text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-[#1c1c1e] rounded-[40px] border border-black/10 dark:border-white/5 overflow-hidden">
      {/* PDF Controls */}
      <div className="bg-gray-50 dark:bg-[#2c2c2e] p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-lg">{patientName} - Medical Chart</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevPage}
            disabled={pageNum <= 1}
            className="px-4 py-2 bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
          >
            Previous
          </button>
          
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
            Page {pageNum} of {pdfDoc?.numPages || 0}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={!pdfDoc || pageNum >= pdfDoc.numPages}
            className="px-4 py-2 bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
          >
            Next
          </button>
          
          <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-2"></div>
          
          <button
            onClick={zoomOut}
            className="p-2 bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="6"/>
              <line x1="5" y1="8" x2="11" y2="8"/>
              <line x1="13" y1="13" x2="18" y2="18"/>
            </svg>
          </button>
          
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className="p-2 bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="6"/>
              <line x1="5" y1="8" x2="11" y2="8"/>
              <line x1="8" y1="5" x2="8" y2="11"/>
              <line x1="13" y1="13" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="p-8 overflow-auto h-[calc(100vh-400px)] bg-gray-100 dark:bg-[#0d0d0f]">
        <div className="flex justify-center">
          <canvas
            ref={(el) => canvasRefs.current[pageNum] = el}
            className="shadow-2xl bg-white rounded-lg max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;