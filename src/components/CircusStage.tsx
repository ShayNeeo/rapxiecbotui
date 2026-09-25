import React, { useState } from "react";
import { CircusActId } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { 
  Play, 
  Sparkles, 
  Heart, 
  Compass, 
  Ticket, 
  ArrowRight,
  BookOpen,
  Box,
  HelpCircle,
  MapPin,
  Upload,
  ExternalLink,
  Users,
  Megaphone,
  GraduationCap,
  FileText,
  CheckCircle2,
  Film,
  Camera,
  Video
} from "lucide-react";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";
import { CHATBOT_AI_URL, CIRCUS_3D_URL } from "@/src/lib/constants";
import { Link } from "react-router-dom";
import { CircusMediaArchive } from "@/src/components/CircusMediaArchive";

interface CircusStageProps {
  onSelectAct: (act: CircusActId) => void;
  unlockedBadges: string[];
  logoUrl?: string;
  onUploadLogo?: (file: File) => void;
  onResetLogo?: () => void;
  onOpenMediaArchive?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const CircusStage: React.FC<CircusStageProps> = ({
  onSelectAct,
  unlockedBadges,
  logoUrl,
  onUploadLogo,
  onResetLogo,
  onOpenMediaArchive,
  onUnlockBadge,
}) => {
  const { isEn } = useLanguage();
  const [applauseCount, setApplauseCount] = useState(1280);
  const [hasCheered, setHasCheered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMediaArchiveOpen, setIsMediaArchiveOpen] = useState(false);

  const handleOpenMedia = () => {
    circusAudio.playBambooStep();
    onUnlockBadge?.('circus-digital-archive');
    if (onOpenMediaArchive) {
      onOpenMediaArchive();
    } else {
      setIsMediaArchiveOpen(true);
    }
  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onUploadLogo) {
      onUploadLogo(file);
    }
  };

  const handleApplause = () => {
    setApplauseCount((prev) => prev + 1);
    setHasCheered(true);
    circusAudio.playApplause();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#f59e0b', '#ec4899', '#eab308'],
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
      {/* Big Top Arena Canvas */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-gradient-to-b from-[#991b1b] via-[#5c0e0e] to-[#260505] p-4 sm:p-8 text-center text-white">
        
        {/* Striped Circus Tent Ceiling Vibe */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-circus-tent" />

        {/* Dynamic Theatrical Spotlight Beam on Stage */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 36%, rgba(254, 240, 138, 0.35) 0%, rgba(251, 191, 36, 0.16) 38%, transparent 68%)`
          }}
        />

        {/* Theatrical Curtains Framing Stage */}
        <div 
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-red-950 via-red-800 to-red-900 border-r-2 border-amber-400/50 shadow-2xl transition-transform duration-1000 ease-in-out z-20 flex items-center justify-start pl-4 -translate-x-[92%]"
        >
          <div className="w-4 h-full border-r border-amber-300/30" />
        </div>
        <div 
          className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-red-950 via-red-800 to-red-900 border-l-2 border-amber-400/50 shadow-2xl transition-transform duration-1000 ease-in-out z-20 flex items-center justify-end pr-4 translate-x-[92%]"
        >
          <div className="w-4 h-full border-l border-amber-300/30" />
        </div>

        {/* Stage Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          
          {/* Vietnam Lotus Badge & Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-xs">
            <span className="text-red-400 font-bold">★</span>
            <span>{isEn ? "Contemporary Vietnamese Circus Arts" : "Nghệ Thuật Xiếc Đương Đại Việt Nam"}</span>
            <span className="text-red-400 font-bold">★</span>
          </div>

          {/* Center Medallion - Original Circus Hero Artwork */}
          <div className="relative group my-2 flex flex-col items-center">
            {/* Natural Theatrical Light Streak Radiating from the Logo */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-yellow-300/30 via-amber-400/15 to-transparent blur-2xl pointer-events-none z-0" />
            <div 
              className="absolute -top-12 inset-x-4 h-52 bg-gradient-to-t from-yellow-100/25 via-amber-300/10 to-transparent pointer-events-none blur-lg"
              style={{ clipPath: 'polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%)' }}
            />

            {/* The circular image container - tight fit with gold border to eliminate white borders */}
            <div 
              title={isEn ? "Pocket Circus Official Logo" : "Logo chính thức Rạp Xiếc Bỏ Túi"}
              className="relative size-64 sm:size-76 md:size-84 rounded-full overflow-hidden mx-auto border-4 border-amber-400/90 shadow-[0_0_24px_rgba(251,191,36,0.35)] bg-amber-950/40 transition-transform duration-300 hover:scale-[1.01]"
            >
              <img
                src={OFFICIAL_CIRCUS_LOGO}
                alt={isEn ? "Pocket Circus - Official Logo" : "Rạp Xiếc Bỏ Túi - Logo Gốc Chính Thức"}
                style={{ transform: "scale(1.06)" }}
                className="size-full rounded-full object-cover origin-center transition-transform duration-300"
              />
            </div>
          </div>

          {/* Main Title & Slogan */}
          <h1 className="font-circus text-3xl sm:text-5xl text-amber-300 tracking-wide mt-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {isEn ? "POCKET CIRCUS" : "RẠP XIẾC BỎ TÚI"}
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-amber-100/90 font-medium mt-2 leading-relaxed font-sans">
            {isEn ? (
              <>
                Online Vietnamese circus cultural showcase:{" "}
                <span className="text-amber-300 font-semibold">100+ Years History</span>,{" "}
                <Link
                  to={CIRCUS_3D_URL}
                  className="text-amber-300 font-semibold hover:text-white underline decoration-amber-400 decoration-2 underline-offset-4 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                  title="Open 3D Circus"
                >
                  <span>Interactive 3D Circus</span>
                  <ExternalLink className="size-3 inline ml-0.5 opacity-80" />
                </Link> 360°,{" "}
                <span className="text-amber-300 font-semibold">Trivia Quiz</span>, and{" "}
                <span className="text-amber-300 font-semibold">Venues Map</span> across Vietnam!
              </>
            ) : (
              <>
                Không gian văn hóa xiếc Việt Nam trực tuyến:
                <span className="text-amber-300 font-semibold"> Lịch Sử</span> trăm năm hào hùng,{" "}
                <Link
                  to={CIRCUS_3D_URL}
                  className="text-amber-300 font-semibold hover:text-white underline decoration-amber-400 decoration-2 underline-offset-4 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
                  title="Mở Rạp Xiếc 3D"
                >
                  <span> Rạp Xiếc 3D</span>
                  <ExternalLink className="size-3 inline ml-0.5 opacity-80" />
                </Link> sống động 360°,{" "}
                <span className="text-amber-300 font-semibold"> Quiz Kiến Thức</span> lý thú và{" "}
                <span className="text-amber-300 font-semibold"> Bản Đồ Rạp Xiếc</span> ba miền!
              </>
            )}
          </p>

          {/* Stage Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              to={CIRCUS_3D_URL}
              onClick={() => {
                onUnlockBadge?.('circus-3d-explorer');
                circusAudio.playFanfare();
              }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-circus text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl border-2 border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <Play className="size-5 fill-current transition-transform group-hover:scale-110" />
              <span>{isEn ? "Enter 3D Circus" : "Vào Rạp Xiếc 3D"}</span>
              <ExternalLink className="size-4 opacity-80 group-hover:opacity-100 ml-0.5" />
            </Link>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => onSelectAct('history')}
              className="bg-amber-100 hover:bg-amber-200 text-red-950 font-bold border-amber-300 cursor-pointer"
            >
              <BookOpen className="size-5 text-red-700" />
              <span>{isEn ? "Explore History" : "Khám Phá Lịch Sử"}</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleApplause}
              className="bg-amber-100 hover:bg-amber-200 text-red-950 font-bold border-amber-300 cursor-pointer"
            >
              <Heart className={`size-5 text-red-600 ${hasCheered ? 'scale-125 transition-transform' : ''}`} />
              <span>{isEn ? `Applaud & Cheer (${applauseCount})` : `Vỗ Tay Hoan Hô (${applauseCount})`}</span>
            </Button>
          </div>

          {/* Cultural Base Decoration */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-red-800/60 text-xs text-amber-200/80">
            <div className="flex items-center gap-1">
              <span className="text-pink-400 text-base">🪷</span>
              <span>{isEn ? "Contemporary Circus Arts" : "Nghệ Thuật Xiếc Đương Đại"}</span>
            </div>
            <span>•</span>
            <Link
              to={CIRCUS_3D_URL}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <span className="text-yellow-400 text-base">🎪</span>
              <span className="underline underline-offset-2">{isEn ? "3D Circus 360°" : "Rạp Xiếc 3D 360°"}</span>
              <ExternalLink className="size-3 opacity-70 group-hover:opacity-100" />
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="text-amber-400 text-base">🗺️</span>
              <span>{isEn ? "Three Regions Venues Map" : "Bản Đồ Rạp Xiếc Ba Miền"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: ABOUT US (VỀ CHÚNG TÔI) - First section before Lịch Sử Xiếc Việt */}
      <section 
        id="about-us-section" 
        className="relative bg-gradient-to-br from-amber-50 via-white to-red-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Users className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full border border-red-200">
                  {isEn ? "Mission & Vision" : "Mục Tiêu & Sứ Mệnh"}
                </span>
                <span className="text-xs text-amber-800 font-semibold">About Us</span>
              </div>
              <h2 className="font-circus text-2xl text-neutral-900 mt-0.5">
                {isEn ? "About Us • Pocket Circus" : "Về Chúng Tôi • Rạp Xiếc Bỏ Túi"}
              </h2>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              circusAudio.playBambooStep();
              onSelectAct('about');
            }}
            className="border-amber-400 text-amber-950 bg-amber-100/70 hover:bg-amber-200 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isEn ? "Detailed About Us" : "Chi Tiết Về Chúng Tôi"}</span>
            <ArrowRight className="size-3.5 text-red-700" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3.5 text-neutral-700 text-xs sm:text-sm leading-relaxed">
            {isEn ? (
              <>
                <p>
                  Hello! We are the founding team of the <strong>"Pocket Circus"</strong> project - where young people with a deep passion for contemporary circus connect to raise awareness and spread the beauty of this performing art through digital storytelling.
                </p>
                <p>
                  Amidst the fast pace of modern life and countless entertainment options, circus can sometimes feel unfamiliar or overlooked in its true value. We believe that contemporary circus is not just entertainment, but a magnificent treasure of performing arts - crystallized from sweat, courage, and the extraordinary perseverance of artists.
                </p>
              </>
            ) : (
              <>
                <p>
                  Chào bạn! Chúng mình là nhóm sáng lập dự án <strong>"Rạp Xiếc Bỏ Túi"</strong> - nơi những người trẻ mang niềm đam mê sâu sắc với xiếc đương đại cùng kết nối để nâng cao nhận thức và lan tỏa vẻ đẹp của bộ môn nghệ thuật này qua ngôn ngữ số.
                </p>
                <p>
                  Giữa nhịp sống hối hả và vô vàn lựa chọn giải trí hiện đại, xiếc đôi khi trở nên xa lạ hoặc bị nhìn nhận chưa đúng với giá trị vốn có. Chúng mình tin rằng, xiếc đương đại không chỉ là những màn trình diễn giải trí, mà là một kho tàng nghệ thuật rực rỡ - nơi kết tinh từ mồ hôi, lòng dũng cảm và tinh thần khổ luyện phi thường của các nghệ sĩ.
                </p>
              </>
            )}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-800 border border-red-200 px-3 py-1 rounded-full">
                <GraduationCap className="size-3.5 text-red-600" />
                {isEn ? "Youth Awareness & Schools" : "Học Đường & Nhận Thức Giới Trẻ"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                <Sparkles className="size-3.5 text-amber-600" />
                {isEn ? "Promoting Contemporary Circus" : "Lan Tỏa Xiếc Đương Đại"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-300/80 shadow-xs space-y-3">
            <h4 className="font-circus text-sm text-red-900 flex items-center gap-1.5">
              <span>★</span>
              <span>{isEn ? "Pocket Circus Commitments" : "Cam Kết Của Dự Án Rạp Xiếc Bỏ Túi"}</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Digitizing official historical archives since 1921 into intuitive, engaging learning resources."
                    : "Số hóa tư liệu chính thống từ năm 1921 đến nay dễ hiểu, sinh động cho học tập."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Celebrating flagship contemporary circus productions (À Ố Show, Làng Tôi, Teh Dar...)."
                    : "Tôn vinh các tác phẩm xiếc đương đại đỉnh cao (À Ố Show, Làng Tôi, Teh Dar...)."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? "Offering practical guides and student-friendly ticket recommendations for live shows."
                    : "Cung cấp cẩm nang và gợi ý vé trải nghiệm thực tế thân thiện cho học sinh, sinh viên."}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUẢNG BÁ (BROCHURE SECTION) */}
      <section 
        id="quang-ba-section" 
        className="relative bg-gradient-to-r from-[#2c0909] via-[#4d0c0c] to-[#1e0404] text-white rounded-3xl p-5 sm:px-[1.25cm] sm:py-7 border-4 border-amber-400 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md shrink-0">
              <Megaphone className="size-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                {isEn ? "Cultural Publication" : "Ấn Phẩm Văn Hóa"}
              </span>
              <a
                href="https://canva.link/t1yoszd541vjc3z"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => circusAudio.playBambooStep()}
                className="group/title flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer"
                title={isEn ? "Open Promotional Brochure on Canva" : "Nhấn để mở Brochure Quảng bá xiếc Việt Nam trên Canva"}
              >
                <h2 className="font-circus text-2xl text-amber-300 mt-0.5 group-hover/title:underline decoration-amber-400 underline-offset-4">
                  {isEn ? "Promoting Vietnamese Circus" : "Quảng Bá Xiếc Việt Nam"}
                </h2>
                <ExternalLink className="size-4 text-amber-300 group-hover/title:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 text-xs font-bold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
            title={isEn ? "Open Brochure on Canva" : "Mở Brochure Quảng Bá trên Canva"}
          >
            <FileText className="size-4" />
            <span>{isEn ? "Open Brochure (Canva)" : "Mở Brochure Quảng Bá (Canva)"}</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* BIO SECTION REQUIRED - CLICKABLE TO CANVA LINK (1.25CM AT BOTH ENDS, LARGER CANVA PROMPT) */}
        <a
          href="https://canva.link/t1yoszd541vjc3z"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => circusAudio.playBambooStep()}
          className="block bg-gradient-to-b from-black/50 via-black/60 to-black/75 hover:from-black/65 hover:to-black/85 border-2 border-amber-400/80 hover:border-amber-300 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-8 backdrop-blur-sm text-center w-full shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all group cursor-pointer"
          title={isEn ? "Click here to open brochure on Canva" : "Nhấn vào dòng này để mở Brochure trên Canva"}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
            <span>{isEn ? "★ INTRODUCTION • BIO ★" : "★ LỜI GIỚI THIỆU • BIO ★"}</span>
            <ExternalLink className="size-3 text-amber-300 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-amber-100 group-hover:text-white font-medium italic leading-normal sm:leading-relaxed tracking-wide text-balance max-w-4xl mx-auto transition-colors">
            {isEn
              ? '"A special brochure for you and every guest who wishes to discover the beauty of Vietnamese circus arts."'
              : '"Một brochure nhỏ dành cho bạn và những vị khách muốn khám phá vẻ đẹp của nghệ thuật xiếc Việt Nam."'}
          </p>
          <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-circus font-normal text-amber-300 group-hover:text-yellow-200 tracking-wide transition-colors">
            <span>{isEn ? "✨ Click here to view the publication on Canva" : "✨ Nhấn vào đây để mở ấn phẩm trên Canva"}</span>
            <ExternalLink className="size-4 sm:size-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      </section>

      {/* Cultural Exploration Modules Grid: Về Chúng Tôi, Quảng Bá, Kho tư liệu số, Lịch sử, Rạp xiếc 3D, Quiz kiến thức, Bản đồ, Góc Giải Đáp */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-circus text-2xl text-red-900 flex items-center gap-2">
              <BookOpen className="size-6 text-amber-600" />
              <span>{isEn ? "EXPLORE & EXPERIENCE" : "KHÁM PHÁ & TRẢI NGHIỆM ĐẶC SẮC"}</span>
            </h2>
            <p className="text-sm text-neutral-600">
              {isEn
                ? "About us, digital brochure, digital media archives, century of history, 3D interaction, trivia quiz, nationwide map, and Chatbot AI"
                : "Về chúng tôi, brochure quảng bá, kho tư liệu số, lịch sử trăm năm, tương tác 3D, thử tài kiến thức, tra cứu bản đồ và Chatbot AI"}
            </p>
          </div>
        </div>

        {/* Featured Bullet Point: Kho Tư Liệu Số */}
        <div 
          onClick={handleOpenMedia}
          className="bg-gradient-to-r from-amber-950 via-red-950 to-neutral-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-amber-400 shadow-md hover:shadow-2xl hover:border-amber-300 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
          title={isEn ? "Open Modern Circus Digital Media Archive & Blank Templates" : "Mở Kho Tư Liệu Số & Mẫu Tự Thêm Ảnh / Tiêu Đề"}
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="size-12 sm:size-13 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 flex items-center justify-center font-bold shadow-lg shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <Film className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/50">
                  ★ {isEn ? "NEW HIGHLIGHT • MEDIA ARCHIVES" : "ĐIỂM NHẤN MỚI • KHO TƯ LIỆU SỐ"} ★
                </span>
                <span className="text-xs text-amber-200/90 font-medium flex items-center gap-1">
                  {isEn ? "Photos & Videos" : "Hình Ảnh & Video Sắc Nét"}
                </span>
              </div>
              <h3 className="font-circus text-lg sm:text-xl text-amber-300 group-hover:text-yellow-200 transition-colors flex items-center gap-2">
                <span>{isEn ? "Digital Media Archive: Modern Circus Vietnam" : "Kho Tư Liệu Số: Xiếc Việt Nam Hiện Đại"}</span>
                <Sparkles className="size-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-3xl">
                {isEn ? (
                  <>
                    <strong>Digital Media Archive:</strong> Where viewers can admire vivid pictures and dynamic short videos.
                  </>
                ) : (
                  <>
                    <strong>Kho tư liệu số:</strong> Nơi người xem có thể chiêm ngưỡng nhiều hình ảnh sắc nét và video ngắn sống động.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 group-hover:from-amber-300 group-hover:to-yellow-300 text-amber-950 font-circus font-normal text-xs sm:text-sm tracking-wide shadow-md group-hover:shadow-lg transition-all">
            <span>{isEn ? "Explore Media Archive" : "Khám Phá Kho Tư Liệu"}</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Module 1: Về Chúng Tôi (About Us) - Placed first before Lịch Sử */}
          <div
            onClick={() => {
              onSelectAct('about');
              circusAudio.playBambooStep();
            }}
            className="group relative bg-gradient-to-b from-white to-amber-50/70 rounded-2xl p-5 border-2 border-amber-300 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎪
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  About Us
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">
                  {isEn ? "School Mission" : "Sứ Mệnh Học Đường"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-red-700 transition-colors">
                {isEn ? "About Us" : "Về Chúng Tôi"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "Meet the Pocket Circus team, our mission to raise student awareness, and celebrate contemporary circus."
                  : "Giới thiệu đội ngũ Rạp Xiếc Bỏ Túi, mục đích nâng cao nhận thức học sinh - sinh viên và quảng bá xiếc đương đại."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Read About Us" : "Đọc Về Chúng Tôi"}</span>
              <ArrowRight className="size-4" />
            </div>
          </div>

          {/* Module 2: Quảng Bá (Brochure) */}
          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="group relative bg-gradient-to-b from-white to-rose-50/60 rounded-2xl p-5 border-2 border-amber-300 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            title={isEn ? "Open Promotional Brochure on Canva" : "Nhấn để mở Brochure Quảng Bá trên Canva"}
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📢
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  E-Brochure
                </span>
                <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                  Canva <ExternalLink className="size-3" />
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
                <span>{isEn ? "Digital Brochure" : "Quảng Bá"}</span>
                <ExternalLink className="size-4 opacity-70 group-hover:opacity-100" />
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed group-hover:text-neutral-800">
                {isEn
                  ? "A special brochure for you and every guest who wishes to discover the beauty of Vietnamese circus arts."
                  : "Một brochure nhỏ dành cho bạn và những vị khách muốn khám phá vẻ đẹp của nghệ thuật xiếc Việt Nam."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Open Brochure" : "Mở Brochure Quảng Bá"}</span>
              <ExternalLink className="size-4" />
            </div>
          </a>

          {/* Module 3: Kho Tư Liệu Số (Digital Media Archive) */}
          <div
            onClick={handleOpenMedia}
            className="group relative bg-gradient-to-b from-white to-amber-50/90 rounded-2xl p-5 border-2 border-amber-400 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ring-1 ring-amber-400/40"
            title={isEn ? "Open Modern Circus Digital Media Archive & Templates" : "Nhấn để mở Kho Tư Liệu Số & Mẫu Bỏ Ảnh/Tiêu Đề"}
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎬
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  {isEn ? "Media Archive" : "Kho Tư Liệu Số"}
                </span>
                <span className="text-[11px] text-red-700 font-semibold flex items-center gap-1">
                  <Film className="size-3" />
                  {isEn ? "Photos & Templates" : "Ảnh, Video & Mẫu"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-red-700 transition-colors flex items-center gap-1.5">
                <span>{isEn ? "Kho Tư Liệu Số" : "Kho Tư Liệu Số"}</span>
                <Sparkles className="size-4 text-amber-500 opacity-80 group-hover:opacity-100" />
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed group-hover:text-neutral-800">
                {isEn
                  ? "Where viewers can admire vivid pictures, dynamic short videos, and use templates to insert custom photos and titles."
                  : "Nơi người xem có thể chiêm ngưỡng nhiều hình ảnh sắc nét, video ngắn sống động và dùng phần mẫu để bỏ ảnh và tiêu đề vào."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Open Media Archive" : "Xem Kho Tư Liệu"}</span>
              <ArrowRight className="size-4" />
            </div>
          </div>

          {/* Module 3: Lịch Sử Xiếc Việt */}
          <div
            onClick={() => {
              onSelectAct('history');
              circusAudio.playBambooStep();
            }}
            className="group relative bg-gradient-to-b from-white to-amber-50/50 rounded-2xl p-5 border-2 border-amber-300 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📜
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {isEn ? "Historical Documents" : "Tư Liệu Lịch Sử"}
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">
                  2000 TCN - 2026
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-red-700 transition-colors">
                {isEn ? "Discovering Historical Documents" : "Khám Phá Tư Liệu Lịch Sử"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "From Ancient Rome, Egypt & Chinese Hundred Games, Philip Astley's 1768 Classical Circus to 100 years of Vietnamese circus and proud Guinness records."
                  : "Hành trình từ xiếc Cổ đại (La Mã, Ai Cập, Bách Hý), Xiếc Cổ điển Philip Astley 1768, Xiếc Đương đại thế giới đến 100 năm Xiếc Việt (1922) và Kỷ lục Guinness."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Discover Historical Documents" : "Khám Phá Tư Liệu Lịch Sử"}</span>
              <ArrowRight className="size-4" />
            </div>
          </div>

          {/* Module 4: Rạp Xiếc 3D */}
          <Link
            to={CIRCUS_3D_URL}
            onClick={() => {
              circusAudio.playBambooStep();
              onUnlockBadge?.('circus-3d-explorer');
            }}
            className="group relative bg-gradient-to-b from-white to-sky-50/40 rounded-2xl p-5 border-2 border-amber-300 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎪
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  WebGL 3D
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {isEn ? "Rotate 360°" : "Xoay 360°"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-sky-700 transition-colors flex items-center justify-between">
                <span>{isEn ? "3D Circus Tent" : "Rạp Xiếc 3D"}</span>
                <ExternalLink className="size-4 text-sky-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "Interact in 3D with the circular sand ring, sweeping stage spotlights, trapeze, and red-yellow big top tent."
                  : "Tương tác trực tiếp với mô hình sân khấu cát tròn, đèn rọi xoay chuyển, đu bay và mái lều đỏ vàng sống động."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Enter 3D Circus" : "Vào Rạp Xiếc 3D"}</span>
              <ArrowRight className="size-4" />
            </div>
          </Link>

          {/* Module 5: Quiz Kiến Thức */}
          <div
            onClick={() => {
              onSelectAct('quiz');
              circusAudio.playBambooStep();
            }}
            className="group relative bg-gradient-to-b from-white to-emerald-50/40 rounded-2xl p-5 border-2 border-amber-300 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧠
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {isEn ? "Knowledge Test" : "Thử Tài Trí Tuệ"}
                </span>
                <span className="text-[11px] text-amber-700 font-semibold">
                  {isEn ? "20 Questions" : "20 Câu Hỏi"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-emerald-700 transition-colors">
                {isEn ? "Circus Quiz" : "Quiz Kiến Thức"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "Test your knowledge of Vietnamese circus art, legendary artists, and fascinating cultural anecdotes."
                  : "Kiểm tra độ am hiểu về nghệ thuật xiếc, các nhân vật huyền thoại và các câu chuyện văn hóa thú vị."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Start Quiz Challenge" : "Bắt Đầu Thử Thách"}</span>
              <ArrowRight className="size-4" />
            </div>
          </div>

          {/* Module 6: Bản Đồ */}
          <div
            onClick={() => {
              onSelectAct('map');
              circusAudio.playBambooStep();
            }}
            className="group relative bg-gradient-to-b from-white to-amber-50/60 rounded-2xl p-5 border-2 border-amber-300 hover:border-amber-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🗺️
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {isEn ? "North - Central - South" : "Bắc - Trung - Nam"}
                </span>
                <span className="text-[11px] text-red-700 font-semibold">
                  {isEn ? "8 Venues & Villages" : "8 Rạp & Làng Nghề"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-amber-800 transition-colors">
                {isEn ? "Venues Map" : "Bản Đồ Rạp Xiếc"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "Discover locations, performance schedules, and contact details of circus venues and troupes nationwide."
                  : "Khám phá vị trí, lịch biểu diễn và thông tin liên hệ của các rạp xiếc, đoàn nghệ thuật trên toàn quốc."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "View Venues Map" : "Xem Bản Đồ"}</span>
              <ArrowRight className="size-4" />
            </div>
          </div>

          {/* Module 7: Chatbot AI */}
          <a
            href={CHATBOT_AI_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              circusAudio.playBambooStep();
              onUnlockBadge?.('circus-ai-chatbot');
            }}
            className="group relative bg-gradient-to-b from-white to-red-50/50 rounded-2xl p-5 border-2 border-amber-300 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {isEn ? "Chatbot AI" : "Chatbot AI"}
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">
                  {isEn ? "Poe Assistant" : "Nghệ sĩ xiếc đương đại"}
                </span>
              </div>
              <h3 className="font-circus text-lg text-neutral-900 group-hover:text-red-700 transition-colors flex items-center justify-between">
                <span>{isEn ? "CHATBOT AI" : "CHATBOT AI"}</span>
                <ExternalLink className="size-4 text-red-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn
                  ? "Chat with the Contemporary Circus Artist AI on Poe to explore circus history, acrobatics, and behind-the-scenes stories."
                  : "Trò chuyện trực tiếp cùng Chatbot AI 'Nghệ sĩ xiếc đương đại' trên Poe để khám phá câu chuyện nghề, lịch sử và kỹ thuật biểu diễn."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>{isEn ? "Open Chatbot AI" : "Trò Chuyện Cùng Chatbot AI"}</span>
              <ArrowRight className="size-4" />
            </div>
          </a>
        </div>
      </div>

      {/* Cultural Heritage Note Box */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-6 border border-amber-300/80 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="size-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-md">
          <Compass className="size-8" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-circus text-lg text-red-900">
            {isEn ? "The Quintessence of Vietnamese Circus" : "Tinh Hoa Xiếc Việt"}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            {isEn
              ? "Vietnamese circus is the crystallization of talent, perseverance, and boundless creativity spanning generations of artists. These heritage values are cherished, cultivated, and passed forward through time, while constantly being rejuvenated in performing arts philosophy. From its traditional roots, today's Vietnamese circus steadily expands its theatrical language, blending with modern expressions to forge a vibrant, dynamic, and ever-evolving identity."
              : "Xiếc Việt Nam là sự kết tinh của tài năng, lòng bền bỉ và sức sáng tạo qua nhiều thế hệ nghệ sĩ. Những giá trị ấy được gìn giữ, vun đắp và tiếp nối theo thời gian, đồng thời không ngừng được làm mới trong tư duy biểu diễn. Từ nền tảng truyền thống, xiếc Việt hôm nay từng bước mở rộng ngôn ngữ sân khấu, hòa quyện cùng những cách thể hiện hiện đại để tạo nên một diện mạo đa dạng, giàu sức sống và luôn chuyển động."}
          </p>
        </div>
        <div className="shrink-0">
          <Button
            variant="gold"
            onClick={() => onSelectAct('ticket')}
            className="text-xs cursor-pointer"
          >
            {isEn ? "Get Ticket & Badges" : "Nhận Vé & Huy Hiệu"}
          </Button>
        </div>
      </div>

      {/* Digital Media Archive Modal Viewer (fallback if not managed by parent) */}
      {!onOpenMediaArchive && (
        <CircusMediaArchive
          isOpen={isMediaArchiveOpen}
          onClose={() => setIsMediaArchiveOpen(false)}
        />
      )}

    </div>
  );
};
