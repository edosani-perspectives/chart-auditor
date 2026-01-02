
import React, { useState, useRef } from 'react';
import { DetailedAuditItem, DetailedStatus, PatientMetadata, AuditDetailsData } from '../types';

interface DetailedAuditProps {
  onBack: () => void;
  selectedPatient: PatientMetadata;
  auditData: AuditDetailsData;
  pdfPath: string;
}

const DetailedAudit: React.FC<DetailedAuditProps> = ({ onBack, selectedPatient, auditData, pdfPath }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-load patient PDF when component mounts or patient changes
  React.useEffect(() => {
    const loadPatientPDF = async () => {
      try {
        setPdfError(null);
        const response = await fetch(pdfPath);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setCurrentPage(1);
        } else {
          setPdfError(`Chart not available for ${selectedPatient.name}`);
        }
      } catch (error) {
        setPdfError(`Unable to load chart for ${selectedPatient.name}`);
      }
    };

    loadPatientPDF();
  }, [selectedPatient, pdfPath]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setCurrentPage(1);
    }
  };

  const jumpToPage = (item: DetailedAuditItem) => {
    setActiveItem(item.id);
    setCurrentPage(item.page);
    // The iframe will automatically reload due to key={currentPage} prop
  };

  const getStatusColor = (status: DetailedStatus) => {
    switch (status) {
      case 'YES': return 'bg-[#30D158]/20 text-[#30D158]';
      case 'NO': return 'bg-[#FF453A]/20 text-[#FF453A]';
      default: return 'bg-black/5 dark:bg-white/10 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white dark:bg-[#1C1C1E] rounded-[40px] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500 transition-all">
      {/* Top Section Header */}
      <div className="px-8 py-5 bg-gray-50/50 dark:bg-black/40 border-b border-black/5 dark:border-white/5 backdrop-blur-xl flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-700 dark:text-gray-200">
            {selectedPatient.name} • MR# {selectedPatient.patientId}
          </h3>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            ref={fileInputRef}
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-2.5 rounded-xl transition-all shadow-xl active:scale-95"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[500px] border-r border-black/5 dark:border-white/5 overflow-y-auto bg-gray-50 dark:bg-black/20 custom-scrollbar transition-colors">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {auditData.categories.map((category, catIdx) => (
              <div key={catIdx} className="bg-transparent">
                <div className="px-6 py-3 bg-white/40 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 sticky top-0 z-10 backdrop-blur-sm">
                  {category.title}
                </div>
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => jumpToPage(item)}
                    className={`w-full text-left p-6 flex items-start gap-4 transition-all hover:bg-white dark:hover:bg-white/5 relative group ${
                      activeItem === item.id ? 'bg-blue-600/[0.05] dark:bg-blue-600/10 active-audit-item' : ''
                    }`}
                  >
                    {activeItem === item.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                    )}
                    <div className="flex-1">
                      <p className={`text-[15px] font-bold leading-snug transition-colors ${
                        activeItem === item.id ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
                      }`}>
                        {item.question}
                      </p>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2 block">
                        Ref: Page {item.page}
                      </span>
                    </div>
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider shrink-0 ${getStatusColor(item.answer)}`}>
                      {item.answer}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PDF Viewport */}
        <div className="flex-1 bg-gray-100 dark:bg-[#2C2C2E] relative flex flex-col transition-colors">
          {pdfUrl ? (
            <>
              <div className="h-10 bg-white/40 dark:bg-black/40 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 backdrop-blur-md">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Viewing Document
                </span>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-600/10 dark:bg-blue-400/10 px-2 py-1 rounded">
                  Page {currentPage}
                </span>
              </div>
              <iframe
                key={currentPage}
                ref={iframeRef}
                src={`${pdfUrl}#page=${currentPage}`}
                className="flex-1 w-full"
                title="PDF Viewer"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 ring-1 ring-black/10 dark:ring-white/10 transition-all">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-black/20 dark:text-white/50 mb-2">
                {pdfError ? 'Chart Not Available' : 'No Record Loaded'}
              </h2>
              <p className="text-gray-400 dark:text-gray-500 max-w-sm font-medium">
                {pdfError || 'Upload the medical record PDF using the button above to begin line-by-line verification.'}
              </p>
              {pdfError && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-[11px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all"
                >
                  Upload Manual PDF
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedAudit;
