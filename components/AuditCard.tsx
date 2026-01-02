
import React from 'react';
import { AuditCategory, AuditStatus, CategorySeverity } from '../types';
import { COLORS } from '../constants';

interface AuditCardProps {
  category: AuditCategory;
}

const getBadgeStyles = (status: AuditStatus) => {
  switch (status) {
    case AuditStatus.MISSING: return "bg-[#FA114F]/20 text-[#FA114F]";
    case AuditStatus.LATE:
    case AuditStatus.INCOMPLETE: return "bg-[#FF9500]/20 text-[#FF9500]";
    case AuditStatus.EMPTY:
    case AuditStatus.UPLOAD: return "bg-[#00F5EA]/20 text-[#00F5EA]";
    default: return "bg-[#A8FF2E]/20 text-[#A8FF2E]";
  }
};

const getBorderColor = (severity: CategorySeverity) => {
  switch (severity) {
    case CategorySeverity.CRITICAL: return COLORS.neonRed;
    case CategorySeverity.WARNING: return COLORS.neonOrange;
    case CategorySeverity.ADMIN: return COLORS.neonBlue;
    case CategorySeverity.GOOD: return COLORS.neonGreen;
    default: return '#333';
  }
};

const AuditCard: React.FC<AuditCardProps> = ({ category }) => {
  const borderColor = getBorderColor(category.severity);

  return (
    <div className="flex flex-col h-full transition-all duration-500">
      <div className="flex items-center gap-4 mb-6 px-2" style={{ color: borderColor }}>
        <div className="scale-125 shrink-0">{category.icon}</div>
        <h2 className="text-2xl font-black tracking-tight sf-rounded uppercase tracking-wider">{category.title}</h2>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-[40px] p-10 shadow-xl dark:shadow-2xl border border-black/5 dark:border-white/5 flex-1 flex flex-col justify-center transition-all duration-500">
        <div className="space-y-10">
          {category.items.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex justify-between items-start pb-8 last:pb-0 ${
                index !== category.items.length - 1 ? 'border-b border-black/[0.05] dark:border-white/5' : ''
              }`}
            >
              <div className="flex-1 pr-8">
                <h3 className="text-[20px] font-black text-black dark:text-white mb-2 leading-tight tracking-tight">{item.title}</h3>
                <p className="text-[16px] leading-relaxed text-gray-500 dark:text-[#8E8E93] font-medium">{item.description}</p>
              </div>
              {item.status && (
                <span className={`text-[11px] font-black px-4 py-2 rounded-xl uppercase shrink-0 tracking-widest ${getBadgeStyles(item.status)}`}>
                  {item.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
