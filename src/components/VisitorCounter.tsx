import React, { useEffect, useState } from 'react';
import { Users, Eye, TrendingUp, Calendar, Clock } from 'lucide-react';
import { getVisitorStats, subscribeVisitorStats, VisitorStats } from '@/src/lib/visitorTracker';

interface VisitorCounterProps {
  isEn?: boolean;
  className?: string;
  variant?: 'footer' | 'card' | 'compact';
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  isEn = false,
  className = '',
  variant = 'footer',
}) => {
  const [stats, setStats] = useState<VisitorStats>(getVisitorStats());

  useEffect(() => {
    const unsubscribe = subscribeVisitorStats((newStats) => {
      setStats(newStats);
    });
    return unsubscribe;
  }, []);

  return (
    <div
      className={`rounded-2xl border border-amber-400/30 bg-black/40 backdrop-blur-md p-3.5 sm:p-4 text-amber-100 shadow-md ${className}`}
      aria-label={isEn ? 'Public Visitor Statistics' : 'Thống kê lượng truy cập công khai'}
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-400/20 text-xs font-semibold text-amber-300">
        <div className="flex items-center gap-2">
          <Eye className="size-3.5 text-amber-400" />
          <span className="uppercase tracking-wider font-circus text-[11px] sm:text-xs">
            {isEn ? 'Public Visitor Statistics' : 'Thống Kê Lượt Xem Công Khai'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] text-emerald-300 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isEn ? 'Live' : 'Trực tiếp'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {/* Online Now */}
        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-2 border border-white/10 transition-colors">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-emerald-300/90 font-medium mb-0.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>{isEn ? 'Online Now' : 'Đang online'}</span>
          </div>
          <div className="font-bold text-sm sm:text-base text-emerald-300 font-mono">
            {stats.online}
          </div>
        </div>

        {/* Today */}
        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-2 border border-white/10 transition-colors">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-amber-200/80 font-medium mb-0.5">
            <Clock className="size-2.5 text-amber-400" />
            <span>{isEn ? 'Today' : 'Hôm nay'}</span>
          </div>
          <div className="font-bold text-sm sm:text-base text-amber-200 font-mono">
            {stats.today.toLocaleString()}
          </div>
        </div>

        {/* Yesterday */}
        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-2 border border-white/10 transition-colors">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-amber-200/80 font-medium mb-0.5">
            <Calendar className="size-2.5 text-amber-400" />
            <span>{isEn ? 'Yesterday' : 'Hôm qua'}</span>
          </div>
          <div className="font-bold text-sm sm:text-base text-amber-200 font-mono">
            {stats.yesterday.toLocaleString()}
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-2 border border-white/10 transition-colors">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-amber-300/90 font-medium mb-0.5">
            <TrendingUp className="size-2.5 text-amber-400" />
            <span>{isEn ? 'Total Visits' : 'Tổng lượt xem'}</span>
          </div>
          <div className="font-bold text-sm sm:text-base text-amber-300 font-mono">
            {stats.total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
