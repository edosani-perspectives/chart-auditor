
import React from 'react';
import { TimelineGroup } from '../types';

interface AuditTimelineProps {
  groups: TimelineGroup[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ groups }) => {
  return (
    <section className="transition-all duration-500">
      <div className="flex items-center justify-between mb-16 px-4">
        <h2 className="text-4xl font-black text-black dark:text-white sf-rounded tracking-tight">Audit History</h2>
        <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Longitudinal Record</span>
      </div>
      
      <div className="relative ml-12 border-l-[6px] border-black/[0.05] dark:border-[#1C1C1E] pl-16 space-y-20">
        {groups.map((group, idx) => (
          <div key={idx} className="relative">
            {/* Larger Timeline Node */}
            <div className="absolute -left-[84px] top-2 w-10 h-10 bg-[#F2F2F7] dark:bg-black border-[6px] border-black/[0.05] dark:border-[#1C1C1E] rounded-full flex items-center justify-center shadow-sm dark:shadow-2xl transition-all duration-500">
              <div className="w-3 h-3 rounded-full bg-black dark:bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
            </div>

            <h3 className="text-[15px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] mb-10 bg-white/50 dark:bg-black/50 inline-block px-4 py-2 rounded-lg border border-black/5 dark:border-white/5 transition-all duration-500">
              {group.label}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {group.events.map((event, eventIdx) => (
                <div 
                  key={eventIdx} 
                  className={`p-10 rounded-[40px] border transition-all hover:scale-[1.02] duration-300 ${
                    event.status === 'success' 
                      ? 'bg-white dark:bg-[#1C1C1E]/40 border-black/5 dark:border-white/5 shadow-sm dark:shadow-none' 
                      : 'bg-[#FA114F]/5 border-[#FA114F]/10 shadow-xl dark:shadow-2xl'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-4 h-4 rounded-full ${
                      event.status === 'success' ? 'bg-[#A8FF2E] shadow-[0_0_12px_#A8FF2E]' : 'bg-[#FA114F] shadow-[0_0_12px_#FA114F]'
                    }`} />
                    <h4 className={`text-2xl font-black tracking-tight ${
                      event.status === 'success' ? 'text-black dark:text-white' : 'text-[#FA114F]'
                    }`}>
                      {event.title}
                    </h4>
                  </div>
                  {event.description && (
                    <p className={`text-[18px] leading-relaxed font-medium ${
                      event.status === 'success' ? 'text-gray-500 dark:text-[#8E8E93]' : 'text-[#FA114F]/70'
                    }`}>
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuditTimeline;
