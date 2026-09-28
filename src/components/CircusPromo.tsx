import React from "react";
import { Button } from "@/src/components/ui/button";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { CircusBrochure360 } from "@/src/components/CircusBrochure360";

interface CircusPromoProps {
  onBack: () => void;
  onNavigateTo?: (act: 'about' | 'history' | 'ticket' | 'stage') => void;
  logoUrl?: string;
}

export const CircusPromo: React.FC<CircusPromoProps> = ({
  onBack,
}) => {
  const { isEn } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 pb-12 animate-in fade-in-50 duration-300">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-amber-300/80">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            circusAudio.playBambooStep();
            onBack();
          }}
          className="bg-white/80 border-amber-400 text-amber-950 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="size-4 text-red-700" />
          <span>{isEn ? "Back to Stage" : "Quay Lại Sân Khấu"}</span>
        </Button>
      </div>

      {/* ONLY 360-DEGREE BROCHURE */}
      <CircusBrochure360 />
    </div>
  );
};
