import React, { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, Calendar, Clock, ChevronUp, ChevronDown, X } from 'lucide-react';
import { getVisitorStats, subscribeVisitorStats, VisitorStats } from '@/src/lib/visitorTracker';

interface FloatingVisitorBadgeProps {
  isEn?: boolean;
}

export const FloatingVisitorBadge: React.FC<FloatingVisitorBadgeProps> = ({ isEn = false }) => {
  const [stats, setStats] = useState<VisitorStats>(getVisitorStats());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeVisitorStats((newStats) => {
      setStats(newStats);
    });
    return unsubscribe;
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 z-40 select-none animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto"
      aria-label={isEn ? "Visitor Counter" : "Thống kê lượt truy cập"}
    >
      {!isExpanded ? (
        /* Compact Neat Pill in the corner */
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/85 hover:bg-neutral-900 border border-amber-400/40 hover:border-amber-400/70 text-amber-200 text-xs font-medium shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-102 active:scale-98"
          title={isEn ? "Click to view visitor details" : "Bấm để xem chi tiết lượt truy cập"}
        >
          {/* Live pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="font-semibold text-emerald-400 text-[11px] sm:text-xs">
            {stats.online} {isEn ? "online" : "đang xem"}
          </span>

          <span className="text-amber-500/50 text-[10px]">•</span>

          <span className="text-[11px] sm:text-xs font-mono text-amber-100/90">
            {stats.total.toLocaleString()} {isEn ? "views" : "lượt xem"}
          </span>

          <ChevronUp className="size-3 text-amber-400/70 group-hover:text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      ) : (
        /* Expanded Neat Detail Card */
        <div className="w-64 sm:w-72 rounded-2xl bg-neutral-950/95 border-2 border-amber-400/50 p-3.5 shadow-2xl backdrop-blur-lg text-white space-y-2.5 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
            <div className="flex items-center gap-1.5 text-amber-300 font-circus text-xs tracking-wider">
              <Eye className="size-3.5 text-amber-400" />
              <span>{isEn ? "PUBLIC VISITOR STATS" : "THỐNG KÊ LƯỢT TRUY CẬP"}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isEn ? "Minimize" : "Thu gọn"}
              >
                <ChevronDown className="size-3.5" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                title={isEn ? "Close" : "Đóng"}
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Stats 2x2 Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {/* Online */}
            <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isEn ? "Online Now" : "Đang trực tuyến"}</span>
              </div>
              <div className="font-bold text-sm text-emerald-300 font-mono mt-1">
                {stats.online}
              </div>
            </div>

            {/* Today */}
            <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] text-amber-200/80 font-medium">
                <Clock className="size-2.5 text-amber-400" />
                <span>{isEn ? "Today" : "Hôm nay"}</span>
              </div>
              <div className="font-bold text-sm text-amber-200 font-mono mt-1">
                {stats.today.toLocaleString()}
              </div>
            </div>

            {/* Yesterday */}
            <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] text-amber-200/80 font-medium">
                <Calendar className="size-2.5 text-amber-400" />
                <span>{isEn ? "Yesterday" : "Hôm qua"}</span>
              </div>
              <div className="font-bold text-sm text-amber-200 font-mono mt-1">
                {stats.yesterday.toLocaleString()}
              </div>
            </div>

            {/* Total */}
            <div className="bg-white/5 rounded-xl p-2 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                <TrendingUp className="size-2.5 text-amber-400" />
                <span>{isEn ? "Total Visits" : "Tổng lượt xem"}</span>
              </div>
              <div className="font-bold text-sm text-amber-300 font-mono mt-1">
                {stats.total.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[10px] text-neutral-400 text-center pt-1 border-t border-white/5 flex items-center justify-between">
            <span className="text-amber-300/80">🎪 rapxiecbotui.com</span>
            <span className="text-emerald-400/90 font-medium">● {isEn ? "Live update" : "Cập nhật liên tục"}</span>
          </div>
        </div>
      )}
    </div>
  );
};
