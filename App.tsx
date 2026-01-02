
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import AuditBars from './components/AuditBars';
import AuditCard from './components/AuditCard';
import AuditTimeline from './components/AuditTimeline';
import DetailedAudit from './components/DetailedAudit';
import URAnalysis from './components/URAnalysis';
import {
  PatientMetadata,
  PatientDataComplete
} from './types';
import { Icons, COLORS } from './constants';
import { discoverPatients, loadPatientData } from './utils/dataLoader';

type ViewTab = 'summary' | 'detailed' | 'ur';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('summary');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New state for dynamic patient loading
  const [patients, setPatients] = useState<PatientMetadata[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientMetadata | null>(null);
  const [patientData, setPatientData] = useState<PatientDataComplete | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync theme with document class for Tailwind dark: prefix
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load all patients on mount
  useEffect(() => {
    const initializePatients = async () => {
      setLoadingPatients(true);
      const discoveredPatients = await discoverPatients();
      setPatients(discoveredPatients);

      if (discoveredPatients.length > 0) {
        const firstPatient = discoveredPatients[0];
        setSelectedPatient(firstPatient);
        await loadPatientDataForSelection(firstPatient);
      } else {
        setDataError('No patient data found. Please add patient folders to /patient-data/');
      }

      setLoadingPatients(false);
    };

    initializePatients();
  }, []);

  // Load patient data for a selected patient
  const loadPatientDataForSelection = async (patient: PatientMetadata) => {
    setLoadingData(true);
    setDataError(null);

    const data = await loadPatientData(patient.patientId, patient.folderPath);

    if (data) {
      setPatientData(data);
      fetchExecutiveSummary(data.executiveSummary.rings);
    } else {
      setDataError(`Failed to load data for ${patient.name}`);
    }

    setLoadingData(false);
  };

  const fetchExecutiveSummary = async (rings: { compliance: number; process: number; data: number }) => {
    setLoadingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze: Compliance ${rings.compliance}%, Process ${rings.process}%, Data ${rings.data}%. Generate a 2-sentence medical director action plan.`,
      });
      setInsight(response.text || "Immediate intervention required for MTP.");
    } catch (error) {
      setInsight("Critical: Immediate intervention required for missing Master Treatment Plan and VOB documentation.");
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  const scrollToSection = (id: string) => {
    if (activeTab !== 'summary') {
      setActiveTab('summary');
      setTimeout(() => {
        const element = sectionRefs.current[id];
        if (element) {
          const yOffset = -220; // Account for sticky header
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = sectionRefs.current[id];
      if (element) {
        const yOffset = -220;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const filteredPatients = searchQuery.length > 0
    ? patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const selectPatient = (patient: PatientMetadata) => {
    setSelectedPatient(patient);
    loadPatientDataForSelection(patient);
    setIsSearching(false);
    setSearchQuery('');
  };

  // Show loading state while patients are being discovered
  if (loadingPatients) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-black dark:text-white font-bold">Loading patients...</p>
        </div>
      </div>
    );
  }

  // Show error state if no patients or data failed to load
  if (patients.length === 0 || !patientData) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">No Patient Data Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {dataError || 'Please add patient folders to /patient-data/'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">
            Expected structure: /patient-data/[patientId]-[name]/
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black text-black dark:text-white px-4 pb-24 max-w-[1400px] mx-auto select-none relative transition-colors duration-500">

      {/* Sticky Navigation & Header */}
      <div className="sticky top-0 z-[100] bg-[#F2F2F7]/80 dark:bg-black/80 backdrop-blur-3xl pt-6 pb-3 -mx-4 px-4 border-b border-black/5 dark:border-white/5 transition-colors duration-500">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-[1000] tracking-tight leading-none" style={{ fontVariationSettings: '"wght" 1000' }}>
                {patientData.executiveSummary.name}
              </h1>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 hover:scale-110 transition-all shadow-sm"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px] font-bold text-[#8E8E93] uppercase tracking-widest mt-3">
              <span>MR# {patientData.executiveSummary.mrNumber}</span>
              <span>•</span>
              <span>{patientData.executiveSummary.careType}</span>
              <span>•</span>
              <span>Admit: {patientData.executiveSummary.admitDate}</span>
            </div>
          </div>

          <div className="relative flex items-end justify-end">
            <div 
              className={`flex items-center bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden h-14 ${
                isSearching 
                  ? 'w-full md:w-[400px] px-6 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/20' 
                  : 'w-14 justify-center rounded-full hover:bg-white dark:hover:bg-[#2C2C2E] cursor-pointer'
              }`}
              onClick={() => !isSearching && setIsSearching(true)}
            >
              <div className={`flex items-center transition-all duration-300 ${isSearching ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                {isSearching && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                    placeholder="Search record..."
                    className="bg-transparent border-none outline-none text-black dark:text-white text-lg w-full font-bold placeholder:text-black/30 dark:placeholder:text-white/20 ml-0"
                  />
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearching(!isSearching);
                  if (isSearching) setSearchQuery('');
                }} 
                className={`shrink-0 transition-colors duration-200 flex items-center justify-center ${isSearching ? 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white ml-2' : 'text-[#8E8E93] hover:text-black dark:hover:text-white w-full h-full'}`}
              >
                {isSearching ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <Icons.Search />
                )}
              </button>
            </div>

            {isSearching && (
              <div className="absolute top-full mt-3 right-0 w-full md:w-[400px] z-[60] bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p, idx) => (
                    <button 
                      key={idx}
                      onClick={() => selectPatient(p)}
                      className="w-full text-left px-5 py-4 border-b border-black/5 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <p className="text-black dark:text-white font-bold text-lg">{p.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1">Patient ID: {p.patientId}</p>
                    </button>
                  ))
                ) : searchQuery.length > 0 ? (
                  <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-500 font-bold">No records found for "{searchQuery}"</div>
                ) : (
                  <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-500 font-bold">All patients shown above</div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === 'summary' 
                ? 'bg-white dark:bg-white text-black dark:text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-black/5 dark:bg-[#1C1C1E] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5'
            }`}
          >
            Executive Summary
          </button>
          <button 
            onClick={() => setActiveTab('detailed')}
            className={`px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === 'detailed' 
                ? 'bg-white dark:bg-white text-black dark:text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-black/5 dark:bg-[#1C1C1E] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5'
            }`}
          >
            Audit Details
          </button>
          <button 
            onClick={() => setActiveTab('ur')}
            className={`px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === 'ur' 
                ? 'bg-white dark:bg-white text-black dark:text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-black/5 dark:bg-[#1C1C1E] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5'
            }`}
          >
            UR Analysis
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'summary' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {/* Item 1: Perspectives Reclaim */}
              <div className="bg-white dark:bg-[#1c1c1e] border border-black/10 dark:border-white/5 rounded-[40px] p-10 shadow-xl dark:shadow-2xl relative overflow-hidden group min-h-[340px] flex flex-col justify-center transition-all duration-500">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/10 blur-[100px]" />
                <h3 className="text-[12px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  Perspectives Reclaim
                </h3>
                {patientData.executiveSummary.perspectives_reclaim ? (
                  <div className="space-y-4">
                    {patientData.executiveSummary.perspectives_reclaim.Clinical_Justification?.The_Golden_Thread && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.Clinical_Justification.The_Golden_Thread}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.Clinical_Justification?.Medical_Necessity_Narrative && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.Clinical_Justification.Medical_Necessity_Narrative}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.clinical_insight && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.clinical_insight}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.level_of_care_justification && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.level_of_care_justification}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.the_struggle?.primary_conflict && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.the_struggle.primary_conflict}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.the_struggle?.physical_toll && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.the_struggle.physical_toll}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.auditor_summary && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.auditor_summary}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.the_narrative?.original_state && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.the_narrative.original_state}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.the_narrative?.reclaimed_state && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.the_narrative.reclaimed_state}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.patient_voice?.key_quote_1 && (
                      <p className="text-base italic font-normal text-sky-700 dark:text-blue-400 leading-relaxed">"{patientData.executiveSummary.perspectives_reclaim.patient_voice.key_quote_1}"</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim?.severityOfIllness?.usePatterns && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim.severityOfIllness.usePatterns}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim?.severityOfIllness?.functionalDeficits && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim.severityOfIllness.functionalDeficits}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim?.psychosocialReclaim?.traumaLens && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.ClinicalReclaim.psychosocialReclaim.traumaLens}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.UtilizationReview?.clinicalRationale && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.UtilizationReview.clinicalRationale}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.clinical_journey_insights?.narrative_arc && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.clinical_journey_insights.narrative_arc}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.clinical_journey_insights?.core_clinical_dynamic && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.clinical_journey_insights.core_clinical_dynamic}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.patient_voice?.admission_vulnerability && (
                      <p className="text-base italic font-normal text-sky-700 dark:text-blue-400 leading-relaxed">"{patientData.executiveSummary.perspectives_reclaim.patient_voice.admission_vulnerability}"</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.patient_voice?.self_affirmation && (
                      <p className="text-base italic font-normal text-sky-700 dark:text-blue-400 leading-relaxed">"{patientData.executiveSummary.perspectives_reclaim.patient_voice.self_affirmation}"</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.clinical_insights?.journey_summary && (
                      <p className="text-lg font-normal text-black dark:text-white/95 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.clinical_insights.journey_summary}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.clinical_insights?.behavioral_patterns && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.clinical_insights.behavioral_patterns}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.reclamation_narrative?.core_shift && (
                      <p className="text-base font-normal text-black/70 dark:text-white/70 leading-relaxed">{patientData.executiveSummary.perspectives_reclaim.reclamation_narrative.core_shift}</p>
                    )}
                    {patientData.executiveSummary.perspectives_reclaim.patient_voice?.on_home_life && (
                      <p className="text-base italic font-normal text-sky-700 dark:text-blue-400 leading-relaxed">"{patientData.executiveSummary.perspectives_reclaim.patient_voice.on_home_life}"</p>
                    )}
                  </div>
                ) : loadingInsight ? (
                  <div className="space-y-4">
                    <div className="h-6 w-full bg-black/5 dark:bg-white/5 rounded-full animate-pulse" />
                    <div className="h-6 w-3/4 bg-black/5 dark:bg-white/5 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <p className="text-2xl font-normal text-black dark:text-white/95 leading-tight tracking-tight">{insight}</p>
                )}
              </div>

              {/* Item 2: Overall Scores */}
              <div className="min-h-[340px]">
                <AuditBars
                  compliance={patientData.executiveSummary.rings.compliance}
                  process={patientData.executiveSummary.rings.process}
                  data={patientData.executiveSummary.rings.data}
                  onCategoryClick={(id) => scrollToSection(id)}
                />
              </div>

              {patientData.executiveSummary.categories.map(category => (
                <div key={category.id} ref={el => sectionRefs.current[category.id] = el} className="scroll-mt-[240px]">
                  <AuditCard category={category} />
                </div>
              ))}
            </div>

            <div ref={el => sectionRefs.current['timeline'] = el} className="mt-24 pt-16 border-t border-black/10 dark:border-white/5 scroll-mt-[240px]">
              <AuditTimeline groups={patientData.executiveSummary.timeline} />
            </div>
          </>
        ) : activeTab === 'detailed' ? (
          <DetailedAudit
            onBack={() => setActiveTab('summary')}
            selectedPatient={selectedPatient!}
            auditData={patientData.auditDetails}
            pdfPath={patientData.pdfPath}
          />
        ) : (
          <URAnalysis urData={patientData.urAnalysis} />
        )}
      </div>

      {/* Floating Bottom Navigation (only on Summary) */}
      {activeTab === 'summary' && (
        <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] h-24 bg-white/90 dark:bg-[rgba(28,28,30,0.8)] backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-[40px] flex items-center justify-around px-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <button onClick={() => scrollToSection('critical')} className="text-[#FA114F] hover:scale-125 transition-transform" aria-label="Go to Critical"><Icons.Alert /></button>
          <button onClick={() => scrollToSection('process')} className="text-[#FF9500] hover:scale-125 transition-transform" aria-label="Go to Process"><Icons.Clock /></button>
          <button onClick={() => scrollToSection('good')} className="text-[#A8FF2E] hover:scale-125 transition-transform" aria-label="Go to Compliant"><Icons.Check /></button>
          <button onClick={() => scrollToSection('timeline')} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors font-black text-[10px] tracking-widest uppercase">Timeline</button>
        </nav>
      )}
    </div>
  );
};

export default App;
