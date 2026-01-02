
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';

interface AuditBarsProps {
  compliance: number;
  process: number;
  data: number;
  onCategoryClick: (id: string) => void;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ||
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

const ProgressBar = ({
  id,
  value,
  color,
  trackColor,
  label,
  onClick,
  isDark
}: {
  id: string,
  value: number,
  color: string,
  trackColor: string,
  label: string,
  onClick: (id: string) => void,
  isDark: boolean
}) => (
  <button 
    onClick={() => onClick(id)}
    className="w-full text-left mb-6 last:mb-0 group outline-none transition-all active:scale-[0.98]"
  >
    <div className="flex justify-between items-end mb-2 px-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] transition-colors group-hover:text-black dark:group-hover:text-white" style={{ color }}>{label}</span>
      </div>
      <span className="text-3xl font-black sf-rounded group-hover:scale-110 transition-transform" style={{ color }}>{value}%</span>
    </div>
    <div className="h-4 w-full rounded-full overflow-hidden relative bg-black/[0.05] dark:bg-white/[0.05]" style={{ backgroundColor: undefined }}>
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${value}%`, 
          backgroundColor: color,
          boxShadow: `0 0 15px ${color}44`
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] dark:group-hover:bg-white/5 transition-colors" />
    </div>
  </button>
);

const AuditBars: React.FC<AuditBarsProps> = ({ compliance, process, data, onCategoryClick }) => {
  const isDark = useDarkMode();

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 rounded-[40px] p-10 shadow-xl dark:shadow-2xl h-full flex flex-col justify-center transition-all duration-500">
      <h3 className="text-[12px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.3em] mb-8 flex items-center gap-3">
        Overall Compliance
      </h3>

      <div className="space-y-4">
        <ProgressBar
          id="critical"
          label="Adherence"
          value={compliance}
          color={isDark ? COLORS.neonRed : COLORS.lightRed}
          trackColor={COLORS.trackRed}
          onClick={onCategoryClick}
          isDark={isDark}
        />
        <ProgressBar
          id="process"
          label="Timeliness"
          value={process}
          color={isDark ? COLORS.neonOrange : COLORS.lightOrange}
          trackColor={COLORS.trackOrange}
          onClick={onCategoryClick}
          isDark={isDark}
        />
        <ProgressBar
          id="hygiene"
          label="Integrity"
          value={data}
          color={isDark ? COLORS.neonBlue : COLORS.lightBlue}
          trackColor={COLORS.trackBlue}
          onClick={onCategoryClick}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default AuditBars;
