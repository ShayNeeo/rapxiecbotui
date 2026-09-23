import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { circusAudio } from "@/src/utils/audio";
import { CircusActId } from "@/src/types";
import { useLanguage } from "@/src/context/LanguageContext";
import { TRANSLATIONS } from "@/src/i18n/translations";
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Ticket, 
  PartyPopper,
  Award, 
  BookOpen, 
  Box, 
  HelpCircle, 
  MapPin, 
  Compass,
  ExternalLink,
  MessageSquareText,
  Users,
  Megaphone,
  Film,
  Languages
} from "lucide-react";
import confetti from "canvas-confetti";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";
import { CHATBOT_AI_URL } from "@/src/lib/constants";

interface CircusHeaderProps {
  currentAct: CircusActId;
  onSelectAct: (act: CircusActId) => void;
  unlockedCount: number;
  totalBadges?: number;
  logoUrl?: string;
  onUploadLogo?: (file: File) => void;
  onOpenMediaArchive?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const CircusHeader: React.FC<CircusHeaderProps> = ({
  currentAct,
  onSelectAct,
  unlockedCount,
  totalBadges = 9,
  logoUrl,
  onUploadLogo,
  onOpenMediaArchive,
  onUnlockBadge,
}) => {
  const { language, setLanguage, isEn } = useLanguage();
  const t = TRANSLATIONS[language];
  const [isMuted, setIsMuted] = useState(circusAudio.getMuted());
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);
  const headerFileRef = React.useRef<HTMLInputElement>(null);

  const toggleSound = () => {
    const muted = circusAudio.toggleMute();
    setIsMuted(muted);
    setIsPlayingBgm(circusAudio.isBgmActive());
  };

  const toggleBgm = () => {
    if (isPlayingBgm) {
      circusAudio.stopBgm();
      setIsPlayingBgm(false);
    } else {
      circusAudio.startCircusBgm();
      setIsPlayingBgm(true);
    }
  };

  const triggerFanfare = () => {
    circusAudio.playFanfare();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#dc2626', '#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
    });
  };

  return (
    <header className="relative w-full bg-gradient-to-b from-red-700 via-red-800 to-red-900 text-white shadow-xl border-b-4 border-amber-400 select-none overflow-hidden">
      {/* Decorative Bunting Pennants Banner */}
      <div className="flex w-full justify-between items-start overflow-hidden pointer-events-none absolute top-0 left-0 right-0 h-7 z-10">
        {[
          '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', 
          '#eab308', '#06b6d4', '#f97316', '#ef4444', '#f59e0b', '#10b981',
          '#3b82f6', '#8b5cf6', '#ec4899', '#eab308', '#06b6d4', '#f97316'
        ].map((color, idx) => (
          <div
            key={idx}
            className="w-8 sm:w-10 h-6 shrink-0 transform -translate-y-1 transition-transform animate-pulse"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backgroundColor: color,
              animationDelay: `${idx * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Main Top Header Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-7 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onUploadLogo ? headerFileRef.current?.click() : onSelectAct('stage')}
            title="Logo Rạp Xiếc Bỏ Túi - Bấm để tải lên/đổi ảnh logo gốc"
            className="relative size-13 sm:size-14 rounded-full border-2 border-amber-300 bg-amber-950/40 shadow-md shadow-amber-500/20 shrink-0 hover:scale-105 transition-transform overflow-hidden cursor-pointer"
          >
            <img
              src={logoUrl || OFFICIAL_CIRCUS_LOGO}
              alt="Rạp Xiếc Bỏ Túi"
              className="size-full rounded-full object-cover scale-[1.06]"
              onError={(e) => {
                // Fallback icon if not loaded
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {onUploadLogo && (
              <input
                ref={headerFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadLogo(file);
                  }
                }}
              />
            )}
          </div>

          <div 
            onClick={() => onSelectAct('stage')}
            className="cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="font-circus text-xl sm:text-2xl tracking-wider text-amber-300 drop-shadow-md group-hover:text-yellow-200 transition-colors">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-red-950 px-2 py-0.5 rounded-full shadow-xs">
                {t.appSubname}
              </span>
            </div>
            <p className="text-xs text-amber-100/90 font-medium hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Action Controls, Language Toggle & Sound Player */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Language Switcher Mode */}
          <div 
            className="flex items-center rounded-lg bg-red-950/80 p-0.5 border border-amber-400/60 shadow-xs"
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => {
                if (language !== 'vi') {
                  circusAudio.playBambooStep();
                  setLanguage('vi');
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs font-bold cursor-pointer ${
                language === 'vi'
                  ? 'bg-amber-400 text-amber-950 shadow-xs scale-102'
                  : 'text-amber-200 hover:text-white hover:bg-white/10'
              }`}
              title="Tiếng Việt (Mặc định)"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (language !== 'en') {
                  circusAudio.playBambooStep();
                  setLanguage('en');
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs font-bold cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-400 text-amber-950 shadow-xs scale-102'
                  : 'text-amber-200 hover:text-white hover:bg-white/10'
              }`}
              title="English mode"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Fanfare Trigger */}
          <button
            onClick={triggerFanfare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 hover:bg-amber-300 active:scale-95 transition-all text-xs font-bold rounded-lg shadow-sm border border-amber-300 cursor-pointer"
            title={t.actions.fanfareTitle}
          >
            <PartyPopper className="size-3.5 text-red-700 animate-bounce" />
            <span>{t.actions.fanfare}</span>
          </button>

          {/* BGM Toggle */}
          <button
            onClick={toggleBgm}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer active:scale-95 ${
              isPlayingBgm 
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-700/50 shadow-sm' 
                : 'bg-red-850 border-red-700/80 text-amber-200 hover:bg-red-800'
            }`}
            title={t.actions.bgmTitle}
          >
            <Music className={`size-3.5 ${isPlayingBgm ? 'animate-spin' : ''}`} />
            <span>{isPlayingBgm ? t.actions.bgmOff : t.actions.bgmOn}</span>
          </button>

          {/* Mute SFX Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-red-850 hover:bg-red-800 text-amber-200 border border-red-700/80 cursor-pointer transition-colors"
            title={isMuted ? t.actions.unmuteSfx : t.actions.muteSfx}
          >
            {isMuted ? <VolumeX className="size-4 text-red-300" /> : <Volume2 className="size-4 text-amber-300" />}
          </button>

          {/* Badge Counter */}
          <button
            onClick={() => onSelectAct('ticket')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title={t.actions.badgesTitle}
          >
            <Award className="size-3.5 text-amber-300" />
            <span>{t.actions.badges}: {unlockedCount}/{totalBadges}</span>
          </button>
        </div>
      </div>

      {/* Navigation Act Tabs */}
      <div className="bg-red-950/60 border-t border-red-800/80 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-2 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: 'stage' as CircusActId, label: t.nav.stage, icon: Sparkles },
            { id: 'about' as CircusActId, label: t.nav.about, icon: Users },
            { 
              id: 'promo' as CircusActId, 
              label: t.nav.promo, 
              icon: Megaphone,
              href: 'https://canva.link/t1yoszd541vjc3z' 
            },
            { 
              id: 'archive' as CircusActId, 
              label: isEn ? 'Media Archive' : 'Kho Tư Liệu Số', 
              icon: Film,
            },
            { id: 'history' as CircusActId, label: t.nav.history, icon: BookOpen },
            { 
              id: 'circus3d' as CircusActId, 
              label: t.nav.circus3d, 
              icon: Box, 
              href: '/3d' 
            },
            { id: 'quiz' as CircusActId, label: t.nav.quiz, icon: HelpCircle },
            { id: 'map' as CircusActId, label: t.nav.map, icon: MapPin },
            { 
              id: 'chat' as CircusActId, 
              label: t.nav.chat, 
              icon: MessageSquareText,
              href: CHATBOT_AI_URL,
            },
            { id: 'ticket' as CircusActId, label: t.nav.ticket, icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentAct === tab.id;

            if (tab.href) {
              const isInternal = tab.href.startsWith('/');
              if (isInternal) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    onClick={() => {
                      circusAudio.playBambooStep();
                      if (tab.id === 'chat') {
                        onUnlockBadge?.('circus-ai-chatbot');
                      }
                      if (tab.id === 'circus3d') {
                        onUnlockBadge?.('circus-3d-explorer');
                      }
                    }}
                    title={tab.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-sm border border-amber-300 group"
                  >
                    <Icon className="size-3.5 text-amber-950 group-hover:scale-110 transition-transform" />
                    <span>{tab.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    circusAudio.playBambooStep();
                    if (tab.id === 'circus3d') {
                      onUnlockBadge?.('circus-3d-explorer');
                    }
                  }}
                  title={tab.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-amber-200 hover:text-white hover:bg-white/10 group border border-amber-400/30 hover:border-amber-400/60"
                >
                  <Icon className="size-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>{tab.label}</span>
                  <ExternalLink className="size-3 text-amber-300/80 group-hover:text-white" />
                </a>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'archive') {
                    onUnlockBadge?.('circus-digital-archive');
                  }
                  onSelectAct(tab.id);
                  circusAudio.playBambooStep();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 font-bold shadow-md shadow-amber-400/30 scale-105'
                    : 'text-amber-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? 'text-red-700' : 'text-amber-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
