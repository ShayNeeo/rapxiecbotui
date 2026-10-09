import React, { useState, useEffect } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { circusAudio } from "@/src/utils/audio";
import { Button } from "@/src/components/ui/button";
import { 
  ArrowLeft, 
  BookOpen, 
  Film, 
  Sparkles,
  Landmark
} from "lucide-react";
import { CircusHistory } from "@/src/components/CircusHistory";
import { CircusMediaArchive } from "@/src/components/CircusMediaArchive";

interface CircusHeritageProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
  initialSubTab?: 'history' | 'archive';
  onNavigateTo?: (act: string) => void;
}

export const CircusHeritage: React.FC<CircusHeritageProps> = ({
  onBack,
  onUnlockBadge,
  initialSubTab = 'history',
  onNavigateTo,
}) => {
  const { isEn } = useLanguage();
  const [subTab, setSubTab] = useState<'history' | 'archive'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: 'history' | 'archive') => {
    circusAudio.playBambooStep();
    setSubTab(tab);
    if (tab === 'archive') {
      onUnlockBadge('circus-digital-archive');
    }
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
            onClick={() => handleSwitchTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'history'
                ? 'bg-gradient-to-r from-red-700 to-red-800 text-amber-300 shadow-md border border-amber-400/60 scale-102'
                : 'text-neutral-700 hover:text-red-900 hover:bg-amber-100/60 font-semibold'
            }`}
          >
            <BookOpen className="size-4" />
            <span>{isEn ? "Circus History" : "Lịch Sử Xiếc"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'archive'
                ? 'bg-gradient-to-r from-red-700 to-red-800 text-amber-300 shadow-md border border-amber-400/60 scale-102'
                : 'text-neutral-700 hover:text-red-900 hover:bg-amber-100/60 font-semibold'
            }`}
          >
            <Film className="size-4" />
            <span>{isEn ? "Media Archive" : "Kho Tư Liệu Số"}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full shadow-xs shrink-0">
          <Landmark className="size-3.5 text-amber-700" />
          <span>{isEn ? "Vietnamese Circus Heritage" : "Di Sản Xiếc Việt"}</span>
        </div>
      </div>

      {/* Sub-Tab Content */}
      {subTab === 'history' ? (
        <div className="animate-in fade-in-50 duration-200">
          <CircusHistory
            onBack={onBack}
            onUnlockBadge={onUnlockBadge}
          />
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-200">
          <CircusMediaArchive
            isOpen={true}
            isFullPage={true}
            hideTopHeader={true}
            onClose={onBack}
            onNavigateTo={onNavigateTo}
            onUnlockBadge={onUnlockBadge}
          />
        </div>
      )}
    </div>
  );
};
