import React, { useState, useEffect } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { circusAudio } from "@/src/utils/audio";
import { Button } from "@/src/components/ui/button";
import { 
  ArrowLeft, 
  HelpCircle, 
  Ticket, 
  Sparkles,
  Milestone
} from "lucide-react";
import { CircusQuiz } from "@/src/components/CircusQuiz";
import { CircusTicket } from "@/src/components/CircusTicket";
import { CircusBadge } from "@/src/types";

interface CircusJourneyProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
  initialSubTab?: 'quiz' | 'ticket';
  badges: CircusBadge[];
  logoUrl?: string;
  onUploadLogo?: (file: File) => void;
  onResetLogo?: () => void;
  onNavigateToAct?: (act: string) => void;
  onOpenMediaArchive?: () => void;
}

export const CircusJourney: React.FC<CircusJourneyProps> = ({
  onBack,
  onUnlockBadge,
  initialSubTab = 'quiz',
  badges,
  logoUrl,
  onUploadLogo,
  onResetLogo,
  onNavigateToAct,
  onOpenMediaArchive,
}) => {
  const { isEn } = useLanguage();
  const [subTab, setSubTab] = useState<'quiz' | 'ticket'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: 'quiz' | 'ticket') => {
    circusAudio.playBambooStep();
    setSubTab(tab);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in-50 duration-300">
      {/* Top Header & Sub-Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b-2 border-amber-300/80">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            circusAudio.playBambooStep();
            onBack();
          }}
          className="bg-white/90 border-amber-400 text-amber-950 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <ArrowLeft className="size-4 text-red-700" />
          <span>{isEn ? "Back to Stage" : "Quay Lại Sân Khấu"}</span>
        </Button>

        {/* 2 Sub-Tabs Selector */}
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-red-950/20 border-2 border-amber-400/50 shadow-inner gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'quiz'
                ? 'bg-gradient-to-r from-red-700 to-red-800 text-amber-300 shadow-md border border-amber-400/60 scale-102'
                : 'text-neutral-700 hover:text-red-900 hover:bg-amber-100/60 font-semibold'
            }`}
          >
            <HelpCircle className="size-4" />
            <span>{isEn ? "Circus Quiz" : "Quiz Kiến Thức"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('ticket')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'ticket'
                ? 'bg-gradient-to-r from-red-700 to-red-800 text-amber-300 shadow-md border border-amber-400/60 scale-102'
                : 'text-neutral-700 hover:text-red-900 hover:bg-amber-100/60 font-semibold'
            }`}
          >
            <Ticket className="size-4" />
            <span>{isEn ? "Collector’s Ticket" : "Vé Kỷ Niệm"}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-xs shrink-0">
          <Milestone className="size-3.5 text-amber-700" />
          <span>{isEn ? "Journey Milestones" : "Dấu Ấn Hành Trình"}</span>
        </div>
      </div>

      {/* Sub-Tab Content */}
      {subTab === 'quiz' ? (
        <div className="animate-in fade-in-50 duration-200">
          <CircusQuiz
            onBack={onBack}
            onUnlockBadge={onUnlockBadge}
          />
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-200">
          <CircusTicket
            onBack={onBack}
            badges={badges}
            onUnlockBadge={onUnlockBadge}
            logoUrl={logoUrl}
            onUploadLogo={onUploadLogo}
            onResetLogo={onResetLogo}
            onNavigateToAct={onNavigateToAct}
            onOpenMediaArchive={onOpenMediaArchive}
          />
        </div>
      )}
    </div>
  );
};
