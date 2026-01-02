
import React from 'react';
import { COLORS } from '../constants';

interface AuditRingsProps {
  compliance: number;
  process: number;
  data: number;
  size?: number;
}

const AuditRings: React.FC<AuditRingsProps> = ({ compliance, process, data, size = 200 }) => {
  const center = size / 2;
  const strokeWidth = size * 0.1;
  
  // Adaptive radii based on size
  const r1 = size * 0.42;
  const r2 = size * 0.31;
  const r3 = size * 0.20;

  const circumferences = [2 * Math.PI * r1, 2 * Math.PI * r2, 2 * Math.PI * r3];

  const calculateOffset = (percentage: number, index: number) => {
    return circumferences[index] - (percentage / 100) * circumferences[index];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group cursor-pointer" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Tracks */}
          <circle cx={center} cy={center} r={r1} fill="none" stroke={COLORS.trackRed} strokeWidth={strokeWidth} />
          <circle cx={center} cy={center} r={r2} fill="none" stroke={COLORS.trackOrange} strokeWidth={strokeWidth} />
          <circle cx={center} cy={center} r={r3} fill="none" stroke={COLORS.trackBlue} strokeWidth={strokeWidth} />

          {/* Compliance Ring */}
          <circle
            cx={center} cy={center} r={r1} fill="none" stroke={COLORS.neonRed} strokeWidth={strokeWidth}
            strokeDasharray={circumferences[0]} strokeDashoffset={calculateOffset(compliance, 0)}
            strokeLinecap="round" className="transition-all duration-1000 ease-out origin-center -rotate-90"
          />

          {/* Process Ring */}
          <circle
            cx={center} cy={center} r={r2} fill="none" stroke={COLORS.neonOrange} strokeWidth={strokeWidth}
            strokeDasharray={circumferences[1]} strokeDashoffset={calculateOffset(process, 1)}
            strokeLinecap="round" className="transition-all duration-1000 ease-out origin-center -rotate-90"
          />

          {/* Data Ring */}
          <circle
            cx={center} cy={center} r={r3} fill="none" stroke={COLORS.neonBlue} strokeWidth={strokeWidth}
            strokeDasharray={circumferences[2]} strokeDashoffset={calculateOffset(data, 2)}
            strokeLinecap="round" className="transition-all duration-1000 ease-out origin-center -rotate-90"
          />
        </svg>
      </div>

      <div className="flex gap-10 mt-10">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FA114F] mb-2">Compliance</p>
          <p className="text-3xl font-black text-[#FA114F] sf-rounded">{compliance}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9500] mb-2">Process</p>
          <p className="text-3xl font-black text-[#FF9500] sf-rounded">{process}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#00F5EA] mb-2">Data</p>
          <p className="text-3xl font-black text-[#00F5EA] sf-rounded">{data}%</p>
        </div>
      </div>
    </div>
  );
};

export default AuditRings;
