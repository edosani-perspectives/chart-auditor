
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';
import { URAnalysisData } from '../types';

interface URAnalysisProps {
  urData: URAnalysisData;
}

const URAnalysis: React.FC<URAnalysisProps> = ({ urData }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const { clinicalCycle, reviews, assessment } = urData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-[#A8FF2E]/20 text-[#A8FF2E]';
      case 'Denied': return 'bg-[#FA114F]/20 text-[#FA114F]';
      case 'Pending': return 'bg-[#FF9500]/20 text-[#FF9500]';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const DataField = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
    <div className="mb-4 last:mb-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <div className="text-sm font-medium text-black dark:text-white leading-relaxed">{value}</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* MOVED TO TOP: Insurance Details Card (Payer Information) */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[30px] p-6 border border-black/5 dark:border-white/5 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500">
               <Icons.File />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payer Information</p>
              <p className="text-lg font-bold text-black dark:text-white">{urData.payer} <span className="text-gray-400 font-normal mx-2">•</span> {urData.planType}</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-xl">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Deductible</p>
               <p className="text-sm font-black text-black dark:text-white">{urData.deductibleMet}</p>
            </div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-xl">
               <p className="text-[10px] font-bold text-gray-400 uppercase">OOP Max</p>
               <p className="text-sm font-black text-black dark:text-white">{urData.oopMax}</p>
            </div>
         </div>
      </div>

      {/* UR Cycle Dashboard (Clinical Review Prep) */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[40px] border border-black/5 dark:border-white/5 shadow-xl overflow-hidden">
        {/* Header Strip */}
        <div className="bg-[#F2F2F7] dark:bg-black/30 border-b border-black/5 dark:border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30">
               <Icons.Activity />
             </div>
             <div>
               <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Current UR Cycle</p>
               <h2 className="text-2xl font-black text-black dark:text-white sf-rounded tracking-tight">
                 {clinicalCycle.currentCycle}
               </h2>
             </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-[#2C2C2E] px-5 py-3 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
             <span className="text-[11px] font-black uppercase tracking-widest text-[#FF9500]">Next UR Date</span>
             <span className="text-xl font-bold text-black dark:text-white">{clinicalCycle.nextReviewDate}</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Section 1: Progress Notes Summary */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Summary of last 3 progress notes
            </h3>
            <ul className="space-y-4">
              {clinicalCycle.notesSummary.map((note, index) => (
                <li key={index} className="flex gap-4 items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[11px] font-black text-black dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </span>
                  <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                    {note}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Clinical Analysis (Barriers, Reasons, Remedies) */}
          <div className="space-y-8 relative">
            {/* Vertical divider on large screens */}
            <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-[1px] bg-black/5 dark:bg-white/5"></div>
            
            <div className="bg-[#FA114F]/5 dark:bg-[#FA114F]/10 p-5 rounded-2xl border border-[#FA114F]/10">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#FA114F] mb-2">Barriers to step down</h3>
              <p className="text-sm font-medium text-black dark:text-white leading-relaxed opacity-90">
                {clinicalCycle.barriersToStepDown}
              </p>
            </div>

            <div className="bg-[#A8FF2E]/10 dark:bg-[#A8FF2E]/10 p-5 rounded-2xl border border-[#A8FF2E]/10">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7BB824] dark:text-[#A8FF2E] mb-2">Potential reasons for step down</h3>
               <p className="text-sm font-medium text-black dark:text-white leading-relaxed opacity-90">
                 {clinicalCycle.reasonsForStepDown}
               </p>
            </div>

            <div className="bg-[#00F5EA]/5 dark:bg-[#00F5EA]/10 p-5 rounded-2xl border border-[#00F5EA]/10">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#009C95] dark:text-[#00F5EA] mb-2">Remedies</h3>
               <p className="text-sm font-medium text-black dark:text-white leading-relaxed opacity-90">
                 {clinicalCycle.remedies}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Assessment Data (UR Questions) */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[40px] border border-black/5 dark:border-white/5 shadow-xl p-8">
        <h3 className="text-lg font-black text-black dark:text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          Clinical Assessment Data
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          
          {/* Column 1 */}
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
              <h4 className="text-sm font-bold text-black dark:text-white mb-4 border-b border-black/5 dark:border-white/5 pb-2">Diagnostic & Event</h4>
              <DataField label="Diagnoses" value={assessment.diagnoses.join(", ")} />
              <DataField label="Precipitating Event" value={assessment.precipitatingEvent} />
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
              <h4 className="text-sm font-bold text-black dark:text-white mb-4 border-b border-black/5 dark:border-white/5 pb-2">Mental Status Exam (MSE)</h4>
              <div className="grid grid-cols-2 gap-4">
                <DataField label="Appearance" value={assessment.mentalStatus.appearance} />
                <DataField label="Mood" value={assessment.mentalStatus.mood} />
                <DataField label="Affect" value={assessment.mentalStatus.affect} />
                <DataField label="Risk of Harm" value={assessment.mentalStatus.risk} />
                <DataField label="Judgement/Insight" value={assessment.mentalStatus.judgement} />
                <DataField label="Orientation" value={assessment.mentalStatus.orientation} />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
              <h4 className="text-sm font-bold text-black dark:text-white mb-4 border-b border-black/5 dark:border-white/5 pb-2">History & Medical</h4>
              <DataField label="Biomedical Conditions" value={assessment.biomedicalConditions} />
              <DataField label="Medications" value={assessment.medications} />
              <DataField label="Substance Use History" value={assessment.substanceUseHistory} />
              <DataField label="Treatment History" value={assessment.treatmentHistory} />
              <DataField label="Trauma History" value={
                <div className="flex gap-4">
                  <span className={assessment.traumaHistory.physical ? "text-red-500 font-bold" : "text-gray-400"}>Physical: {assessment.traumaHistory.physical ? "Yes" : "No"}</span>
                  <span className={assessment.traumaHistory.sexual ? "text-red-500 font-bold" : "text-gray-400"}>Sexual: {assessment.traumaHistory.sexual ? "Yes" : "No"}</span>
                  <span className={assessment.traumaHistory.emotional ? "text-red-500 font-bold" : "text-gray-400"}>Emotional: {assessment.traumaHistory.emotional ? "Yes" : "No"}</span>
                </div>
              } />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
              <h4 className="text-sm font-bold text-black dark:text-white mb-4 border-b border-black/5 dark:border-white/5 pb-2">Psychosocial Stressors</h4>
              <DataField label="Housing" value={assessment.psychosocialStressors.housing} />
              <DataField label="Financial" value={assessment.psychosocialStressors.financial} />
              <DataField label="Employment/School" value={assessment.psychosocialStressors.employment} />
              <DataField label="Relationships" value={assessment.psychosocialStressors.relationships} />
              <DataField label="Legal" value={assessment.psychosocialStressors.legal} />
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
               <h4 className="text-sm font-bold text-black dark:text-white mb-4 border-b border-black/5 dark:border-white/5 pb-2">Clinical Presentation</h4>
               <DataField label="Mood Disorder Symptoms" value={assessment.moodSymptoms} />
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-500/10">
              <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 border-b border-blue-500/10 pb-2">Planning & Discharge</h4>
              <DataField label="Barriers to Discharge to LLOC" value={assessment.barriersToDischarge} />
              <DataField label="Treatment Plan (Measurable Goals)" value={assessment.treatmentPlanGoals} />
              <DataField label="Discharge Plan" value={assessment.dischargePlan} />
            </div>
          </div>

        </div>
      </div>

      {/* Utilization History Accordion */}
      <div>
        <h3 className="text-lg font-black text-black dark:text-white mb-4 ml-2 flex items-center gap-2">
          Utilization History 
          <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500 font-bold uppercase tracking-widest">
            {reviews.length} Records
          </span>
        </h3>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[40px] border border-black/5 dark:border-white/5 shadow-xl overflow-hidden">
          {reviews.map((review) => (
            <div key={review.id} className={`border-b border-black/5 dark:border-white/5 last:border-none transition-colors ${
              expandedId === review.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
            }`}>
              <button 
                onClick={() => toggleExpand(review.id)}
                className="w-full flex items-center justify-between p-6 text-left outline-none group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${
                    review.status === 'Approved' ? 'bg-[#A8FF2E] text-black' : 'bg-[#FA114F] text-white'
                  }`}>
                    {review.days}D
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {review.type} Review
                    </h4>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {review.date} • {review.reviewer}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`hidden md:inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                  <div className={`text-gray-400 transition-transform duration-300 ${expandedId === review.id ? 'rotate-180' : ''}`}>
                    <Icons.ChevronDown />
                  </div>
                </div>
              </button>

              {expandedId === review.id && (
                <div className="px-6 pb-8 pt-2 pl-[96px] pr-8 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="space-y-6">
                    <div>
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Clinical Narrative</h5>
                       <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                         {review.clinicalNotes}
                       </p>
                    </div>
                    
                    <div>
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Criteria Met</h5>
                       <div className="flex flex-wrap gap-2">
                         {review.criteriaMet.map((crit, i) => (
                           <span key={i} className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-white text-sm font-bold border border-black/5 dark:border-white/5">
                             {crit}
                           </span>
                         ))}
                       </div>
                    </div>

                    <div className="flex gap-8 pt-4 border-t border-black/5 dark:border-white/5 opacity-70">
                       <div>
                         <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Authorized Dates</span>
                         <span className="text-sm font-bold text-black dark:text-white">{review.datesAuthorized}</span>
                       </div>
                       <div>
                         <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Auth Reference</span>
                         <span className="text-sm font-bold text-black dark:text-white font-mono">{review.authNumber}</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default URAnalysis;
