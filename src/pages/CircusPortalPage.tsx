import React, { useState, useEffect, useCallback, useRef } from "react";
import { CircusActId, CircusBadge } from "@/src/types";
import { CircusHeader } from "@/src/components/CircusHeader";
import { CircusStage } from "@/src/components/CircusStage";
import { CircusTicket } from "@/src/components/CircusTicket";
import { CircusAbout } from "@/src/components/CircusAbout";
import { CircusPromo } from "@/src/components/CircusPromo";
import { CircusHistory } from "@/src/components/CircusHistory";
import { Circus3D } from "@/src/components/Circus3D";
import { CircusQuiz } from "@/src/components/CircusQuiz";
import { CircusMap } from "@/src/components/CircusMap";
import { CircusChat } from "@/src/components/CircusChat";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import { Mail, ExternalLink, Film } from "lucide-react";
import { Facebook } from "@/src/components/icons/Facebook";
import { useNavigate } from "react-router-dom";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";
import { OFFICIAL_CIRCUS_MAP } from "@/src/lib/map";
import { CHATBOT_AI_URL } from "@/src/lib/constants";
import { CircusMediaArchive } from "@/src/components/CircusMediaArchive";

const INITIAL_BADGES: CircusBadge[] = [
  {
    id: 'circus-scholar',
    name: 'Circus Scholar',
    vietnameseName: 'Sử Học Rạp Xiếc',
    icon: '📜',
    description: 'Khám phá trọn vẹn 4 cột mốc tư liệu lịch sử từ cổ đại, cổ điển đến 100 năm xiếc Việt Nam',
    descriptionEn: 'Explore all 4 historical document milestones from ancient, classical to 100 years of Vietnamese circus',
    unlocked: false,
  },
  {
    id: 'circus-3d-explorer',
    name: '3D Circus Explorer',
    vietnameseName: 'Khám Phá Rạp Xiếc 3D',
    icon: '🎪',
    description: 'Bấm vào mô hình rạp xiếc 3D để trải nghiệm không gian 360 độ',
    descriptionEn: 'Click the 3D circus model to explore the 360° arena',
    unlocked: false,
  },
  {
    id: 'circus-ai-chatbot',
    name: 'AI Chatbot Companion',
    vietnameseName: 'Bạn Đồng Hành Chatbot AI',
    icon: '🤖',
    description: 'Bấm vào Chatbot AI để trò chuyện cùng Nghệ sĩ xiếc trên Poe',
    descriptionEn: 'Click the AI Chatbot to chat with the Circus Artist on Poe',
    unlocked: false,
  },
  {
    id: 'circus-digital-archive',
    name: 'Digital Archive Explorer',
    vietnameseName: 'Khám Phá Kho Tư Liệu Số',
    icon: '🎞️',
    description: 'Bấm vào kho tư liệu số để thưởng thức video, ảnh và thước phim quý',
    descriptionEn: 'Click the digital archive to enjoy videos, photos and footage',
    unlocked: false,
  },
  {
    id: 'circus-map-explorer',
    name: 'Heritage Map Explorer',
    vietnameseName: 'Hành Trình Di Sản Bản Đồ',
    icon: '🗺️',
    description: 'Khám phá và xem trọn vẹn toàn bộ các địa điểm rạp xiếc trên bản đồ',
    descriptionEn: 'Explore and finish viewing all circus venues on the map',
    unlocked: false,
  },
  {
    id: 'circus-quiz-master',
    name: 'Quiz Master 20/20',
    vietnameseName: 'Bậc Thầy 20 Câu Hỏi Quiz',
    icon: '🧠',
    description: 'Hoàn thành trọn vẹn 20 câu hỏi thử tài kiến thức rạp xiếc',
    descriptionEn: 'Complete all 20 circus trivia quiz questions',
    unlocked: false,
  },
  {
    id: 'circus-vip',
    name: 'Honorary VIP Guest',
    vietnameseName: 'Khán Giả Danh Dự VIP',
    icon: '🎟️',
    description: 'Nhận tấm vé danh dự chính thức của Rạp Xiếc Bỏ Túi',
    descriptionEn: 'Claim your official honorary guest ticket of Pocket Circus',
    unlocked: false,
  },
];

export default function App() {
  const { isEn } = useLanguage();
  const [currentAct, setCurrentAct] = useState<CircusActId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/moc-') || hash === '#/') {
        return 'history';
      }
    }
    return 'stage';
  });
  const [badges, setBadges] = useState<CircusBadge[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('circus_unlocked_badges');
        if (saved) {
          const unlockedIds: string[] = JSON.parse(saved);
          return INITIAL_BADGES.map((b) => ({
            ...b,
            unlocked: unlockedIds.includes(b.id),
          }));
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_BADGES;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMediaArchiveOpen, setIsMediaArchiveOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const navigateToAct = (act: CircusActId) => {
    if (act === 'chat') {
      navigate('/chatbot');
      return;
    }
    setCurrentAct(act);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (typeof document !== 'undefined') {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (typeof document !== 'undefined') {
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [currentAct]);
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('circus_logo_version');
      if (version !== 'v3') {
        localStorage.removeItem('circus_logo_custom');
        localStorage.setItem('circus_logo_version', 'v3');
        return OFFICIAL_CIRCUS_LOGO;
      }
      const saved = localStorage.getItem('circus_logo_custom');
      if (saved && saved.startsWith('data:image')) {
        return saved;
      }
      return OFFICIAL_CIRCUS_LOGO;
    }
    return OFFICIAL_CIRCUS_LOGO;
  });

  const handleUploadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setLogoUrl(result);
        try {
          localStorage.setItem('circus_logo_custom', result);
          localStorage.setItem('circus_logo_version', 'v3');
        } catch (err) {
          console.warn('Could not save logo to localStorage', err);
        }

        // Also persist to server disk so /public/circus-logo.png is updated
        fetch('/api/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: result }),
        }).catch((err) => {
          console.warn('Server upload optional fallback', err);
        });

        setToastMessage(isEn ? '🎨 Custom logo loaded successfully!' : '🎨 Đã nạp thành công logo: Giữ trọn 100% nét vẽ và màu sắc!');
        setTimeout(() => setToastMessage(null), 4500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setLogoUrl(OFFICIAL_CIRCUS_LOGO);
    try {
      localStorage.removeItem('circus_logo_custom');
      localStorage.setItem('circus_logo_version', 'v3');
    } catch (err) {
      console.warn(err);
    }
    setToastMessage(isEn ? '✨ Restored circus logo!' : '✨ Đã khôi phục logo gốc!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [mapUrl, setMapUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('circus_map_custom');
      if (saved && (saved.startsWith('data:image') || saved.startsWith('/'))) {
        return saved;
      }
      return OFFICIAL_CIRCUS_MAP;
    }
    return OFFICIAL_CIRCUS_MAP;
  });

  const handleUploadMap = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setMapUrl(result);
        try {
          localStorage.setItem('circus_map_custom', result);
        } catch (err) {
          console.warn('Could not save custom map to localStorage', err);
        }

        // Persist to server disk
        fetch('/api/upload-map', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: result }),
        }).catch((err) => {
          console.warn('Server map upload fallback', err);
        });

        circusAudio.playFanfare();
        setToastMessage(isEn ? '🗺️ Custom map image loaded successfully!' : '🗺️ Đã nạp thành công ảnh bản đồ mới!');
        setTimeout(() => setToastMessage(null), 4500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetMap = () => {
    setMapUrl(OFFICIAL_CIRCUS_MAP);
    try {
      localStorage.removeItem('circus_map_custom');
    } catch (err) {
      console.warn(err);
    }
    circusAudio.playBambooStep();
    setToastMessage(isEn ? '🗺️ Restored original official circus map!' : '🗺️ Đã khôi phục lại ảnh bản đồ gốc ban đầu!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const badgesRef = useRef(badges);
  badgesRef.current = badges;
  const isEnRef = useRef(isEn);
  isEnRef.current = isEn;

  const handleUnlockBadge = useCallback((badgeId: string) => {
    const existing = badgesRef.current.find((b) => b.id === badgeId);
    if (!existing || existing.unlocked) {
      return;
    }

    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (!target || target.unlocked) {
        return prev;
      }
      const updated = prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true } : b
      );
      try {
        const unlockedIds = updated.filter((b) => b.unlocked).map((b) => b.id);
        localStorage.setItem('circus_unlocked_badges', JSON.stringify(unlockedIds));
      } catch {
        // ignore storage error
      }
      return updated;
    });

    try {
      circusAudio.playMagicChime();
    } catch {
      // ignore audio error
    }
    const badgeTitle = isEnRef.current
      ? (existing.name || existing.vietnameseName)
      : existing.vietnameseName;
    setToastMessage(
      isEnRef.current
        ? `🎉 You unlocked badge: ${badgeTitle}!`
        : `🎉 Bạn đã mở khóa huy hiệu: ${badgeTitle}!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-neutral-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-amber-400 text-amber-950 px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <span>🏆</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Circus Header Bar */}
      <CircusHeader
        currentAct={currentAct}
        onSelectAct={navigateToAct}
        unlockedCount={unlockedCount}
        totalBadges={badges.length}
        logoUrl={logoUrl}
        onUploadLogo={handleUploadLogo}
        onOpenMediaArchive={() => {
          handleUnlockBadge('circus-digital-archive');
          navigateToAct('archive');
        }}
        onUnlockBadge={handleUnlockBadge}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentAct === 'stage' && (
          <CircusStage
            onSelectAct={navigateToAct}
            unlockedBadges={badges.filter((b) => b.unlocked).map((b) => b.id)}
            logoUrl={logoUrl}
            onUploadLogo={handleUploadLogo}
            onResetLogo={handleResetLogo}
            onOpenMediaArchive={() => {
              handleUnlockBadge('circus-digital-archive');
              navigateToAct('archive');
            }}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'about' && (
          <CircusAbout
            onBack={() => navigateToAct('stage')}
            onNavigateTo={(act) => navigateToAct(act as CircusActId)}
          />
        )}

        {currentAct === 'promo' && (
          <CircusPromo
            onBack={() => navigateToAct('stage')}
            onNavigateTo={(act) => navigateToAct(act as CircusActId)}
            logoUrl={logoUrl}
          />
        )}

        {currentAct === 'archive' && (
          <CircusMediaArchive
            isOpen={true}
            isFullPage={true}
            onClose={() => navigateToAct('stage')}
            onNavigateTo={(act) => navigateToAct(act as CircusActId)}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'history' && (
          <CircusHistory
            onBack={() => navigateToAct('stage')}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'circus3d' && (
          <Circus3D
            onBack={() => navigateToAct('stage')}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'quiz' && (
          <CircusQuiz
            onBack={() => navigateToAct('stage')}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'map' && (
          <CircusMap
            onBack={() => navigateToAct('stage')}
            onUnlockBadge={handleUnlockBadge}
            mapUrl={mapUrl}
            onUploadMap={handleUploadMap}
            onResetMap={handleResetMap}
          />
        )}

        {currentAct === 'chat' && (
          <CircusChat
            onBack={() => navigateToAct('stage')}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {currentAct === 'ticket' && (
          <CircusTicket
            onBack={() => navigateToAct('stage')}
            badges={badges}
            onUnlockBadge={handleUnlockBadge}
            logoUrl={logoUrl}
            onUploadLogo={handleUploadLogo}
            onResetLogo={handleResetLogo}
            onNavigateToAct={(act) => navigateToAct(act as CircusActId)}
            onOpenMediaArchive={() => {
              handleUnlockBadge('circus-digital-archive');
              navigateToAct('archive');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1e0707] text-amber-200/90 border-t-4 border-amber-400 py-7 sm:py-9 px-4 sm:px-6 text-center mt-auto">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
          <div className="flex items-center justify-center gap-2 font-circus text-base sm:text-lg text-amber-300 tracking-wider">
            <span className="text-amber-400 text-sm">★</span>
            <span>{isEn ? "POCKET CIRCUS VIETNAM" : "RẠP XIẾC BỎ TÚI VIỆT NAM"}</span>
            <span className="text-amber-400 text-sm">★</span>
          </div>

          <p className="text-amber-100 text-sm sm:text-[15px] font-medium leading-relaxed tracking-wide max-w-lg mx-auto">
            {isEn ? "Nurturing Heritage • Connecting the Digital Beat" : "Nuôi dưỡng tinh hoa - Hoà cầu nhịp số"}
          </p>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-1">
            <button
              onClick={() => {
                circusAudio.playBambooStep();
                navigateToAct('about');
              }}
              className="text-xs text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-amber-400/30 transition-colors cursor-pointer"
            >
              {isEn ? "About Us" : "Về Chúng Tôi (About Us)"}
            </button>
            <a
              href="https://canva.link/t1yoszd541vjc3z"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => circusAudio.playBambooStep()}
              className="text-xs text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-amber-400/30 transition-colors cursor-pointer inline-flex items-center gap-1"
              title={isEn ? "Open Brochure on Canva" : "Mở Brochure Quảng Bá trên Canva"}
            >
              <span>{isEn ? "Brochure (Canva)" : "Quảng Bá (Brochure)"}</span>
              <ExternalLink className="size-3 text-amber-300" />
            </a>
            <button
              onClick={() => {
                circusAudio.playBambooStep();
                navigateToAct('archive');
              }}
              className="text-xs text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-amber-400/30 transition-colors cursor-pointer inline-flex items-center gap-1"
              title={isEn ? "Open Media Archive" : "Mở Kho Tư Liệu Số"}
            >
              <span>{isEn ? "Media Archive" : "Kho Tư Liệu Số"}</span>
              <Film className="size-3 text-amber-300" />
            </button>
            <button
              onClick={() => {
                circusAudio.playBambooStep();
                navigateToAct('history');
              }}
              className="text-xs text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-amber-400/20 transition-colors cursor-pointer"
            >
              {isEn ? "Circus History" : "Lịch Sử Xiếc Việt"}
            </button>
            <a
              href={CHATBOT_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => circusAudio.playBambooStep()}
              className="text-xs text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-amber-400/30 transition-colors cursor-pointer inline-flex items-center gap-1"
              title={isEn ? "Open Chatbot AI on Poe" : "Mở Chatbot AI trên Poe"}
            >
              <span>Chatbot AI</span>
              <ExternalLink className="size-3 text-amber-300" />
            </a>
          </div>

          {/* Contact Information / Thông tin liên hệ */}
          <div className="pt-3.5 border-t border-amber-400/20 max-w-lg mx-auto text-center space-y-2.5">
            <h4 className="font-circus text-xs sm:text-sm text-amber-300 tracking-wider uppercase">
              {isEn ? "Contact Information" : "Thông tin liên hệ"}
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2 group">
                <span 
                  className="inline-flex items-center justify-center size-7 sm:size-7.5 rounded-lg bg-white/20 border-2 border-white text-white shadow-xs rotate-[-3deg] group-hover:rotate-0 transition-transform shrink-0"
                  title="Email sticker"
                >
                  <Mail className="size-4 text-white" strokeWidth={2.2} />
                </span>
                <a 
                  href="mailto:rapxiecbotui@gmail.com" 
                  className="text-white hover:text-amber-300 font-medium transition-colors underline-offset-4 hover:underline"
                >
                  rapxiecbotui@gmail.com
                </a>
              </div>
              <a 
                href="https://www.facebook.com/people/R%E1%BA%A1p-Xi%E1%BA%BFc-B%E1%BB%8F-T%C3%BAi/61591831813277/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group cursor-pointer"
              >
                <span 
                  className="inline-flex items-center justify-center size-7 sm:size-7.5 rounded-lg bg-white/20 border-2 border-white text-white shadow-xs rotate-[3deg] group-hover:rotate-0 group-hover:scale-105 transition-all shrink-0"
                  title="Facebook logo"
                >
                  <Facebook className="size-4 text-white fill-white" strokeWidth={0} />
                </span>
                <span className="text-white group-hover:text-amber-300 font-medium transition-colors underline-offset-4 group-hover:underline">
                  {isEn ? "Pocket Circus Vietnam" : "Rạp Xiếc Bỏ Túi"}
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-amber-200/80 pt-3.5 border-t border-amber-400/20 font-medium">
            <span>{isEn ? "🇻🇳 Folk Arts" : "🇻🇳 Nghệ Thuật Dân Gian"}</span>
            <span className="text-amber-500/60">•</span>
            <span>🎪 Pocket Circus Web</span>
            <span className="text-amber-500/60">•</span>
            <span>{isEn ? "✨ Interactive Web Audio" : "✨ Âm Thanh Tương Tác Web Audio"}</span>
          </div>
        </div>
      </footer>

      {/* Digital Media Archive Modal Viewer */}
      <CircusMediaArchive
        isOpen={isMediaArchiveOpen && currentAct !== 'archive'}
        onClose={() => setIsMediaArchiveOpen(false)}
      />
    </div>
  );
}
