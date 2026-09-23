import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  Download, 
  BookOpen, 
  Heart, 
  Compass, 
  CheckCircle2, 
  Globe2, 
  Ticket,
  ChevronRight,
  ExternalLink,
  Copy,
  Printer
} from "lucide-react";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";

interface CircusPromoProps {
  onBack: () => void;
  onNavigateTo: (act: 'about' | 'history' | 'ticket' | 'stage') => void;
  logoUrl?: string;
}

export const CircusPromo: React.FC<CircusPromoProps> = ({
  onBack,
  onNavigateTo,
  logoUrl,
}) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'contemporary' | 'shows' | 'guide'>('overview');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    circusAudio.playApplause();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.2 },
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    circusAudio.playBambooStep();
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in-50 duration-300">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-amber-300/80">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            circusAudio.playBambooStep();
            onBack();
          }}
          className="bg-white/80 border-amber-400 text-amber-950 hover:bg-amber-100 flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4 text-red-700" />
          <span>{isEn ? "Back to Stage" : "Quay Lại Sân Khấu"}</span>
        </Button>

        <div className="flex items-center gap-2">
          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
            title={isEn ? "Open Brochure on Canva" : "Mở Brochure trên Canva"}
          >
            <span>{isEn ? "Open on Canva" : "Mở Trên Canva"}</span>
            <ExternalLink className="size-3.5" />
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-white text-amber-950 border-amber-300 hover:bg-amber-50 text-xs flex items-center gap-1.5"
          >
            <Share2 className="size-3.5 text-red-600" />
            <span>{copied ? (isEn ? 'Link Copied!' : 'Đã Sao Chép Liên Kết!') : (isEn ? 'Share Brochure' : 'Chia Sẻ Brochure')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="bg-white text-amber-950 border-amber-300 hover:bg-amber-50 text-xs flex items-center gap-1.5"
          >
            <Printer className="size-3.5 text-amber-700" />
            <span>{isEn ? "Print / PDF" : "In / Lưu PDF"}</span>
          </Button>
        </div>
      </div>

      {/* Hero Header for Quảng Bá */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-400 bg-gradient-to-br from-[#801414] via-[#520909] to-[#240404] p-5 sm:px-[1.25cm] sm:py-8 text-white text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-circus-tent" />
        
        <div className="relative z-10 w-full mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <img src={logoUrl || OFFICIAL_CIRCUS_LOGO} alt="Logo" className="size-4.5 rounded-full object-cover border border-amber-400/70" />
            <span>{isEn ? "Cultural Publication • E-Brochure" : "Ấn Phẩm Văn Hóa • E-Brochure"}</span>
          </div>

          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="group/h1 inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
            title={isEn ? "Click to open brochure on Canva" : "Nhấn để mở Brochure trên Canva"}
          >
            <h1 className="font-circus text-3xl sm:text-5xl text-amber-300 tracking-wide drop-shadow-md group-hover/h1:underline decoration-amber-400 underline-offset-4">
              {isEn ? "VIETNAMESE CIRCUS PROMOTION" : "QUẢNG BÁ XIẾC VIỆT NAM"}
            </h1>
            <ExternalLink className="size-6 text-amber-300 group-hover/h1:scale-110 transition-transform" />
          </a>

          {/* BIO SECTION - Required exact sentence - Clickable to Canva link (1.25cm from outer ends) */}
          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="block bg-gradient-to-b from-amber-950/70 via-amber-950/85 to-black/80 hover:from-amber-950/90 hover:to-black/95 border-2 border-amber-400/80 hover:border-amber-300 rounded-2xl py-3.5 sm:py-4 px-4 sm:px-8 w-full mx-auto backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all group cursor-pointer text-center"
            title={isEn ? "Click this banner to open brochure on Canva" : "Nhấn vào dòng này để mở Brochure trên Canva"}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
              <span>{isEn ? "★ INTRODUCTION • BIO ★" : "★ LỜI GIỚI THIỆU • BIO ★"}</span>
              <ExternalLink className="size-3 text-amber-300 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-amber-100 group-hover:text-white font-medium italic leading-normal sm:leading-relaxed tracking-wide text-balance max-w-4xl mx-auto transition-colors">
              {isEn
                ? '"A small brochure dedicated to you and guests eager to discover the beauty of Vietnamese circus art."'
                : '"Một brochure nhỏ dành cho bạn và những vị khách muốn khám phá vẻ đẹp của nghệ thuật xiếc Việt Nam."'
              }
            </p>
            <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-circus font-normal text-amber-300 group-hover:text-yellow-200 tracking-wide transition-colors">
              <span>{isEn ? "✨ Click here to open publication on Canva" : "✨ Nhấn vào đây để mở ấn phẩm trên Canva"}</span>
              <ExternalLink className="size-4 sm:size-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://canva.link/t1yoszd541vjc3z"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => circusAudio.playBambooStep()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 text-xs sm:text-sm font-circus font-normal tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>{isEn ? "View E-Brochure Live On Canva" : "Xem E-Brochure Trực Tiếp Trên Canva"}</span>
              <ExternalLink className="size-4" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl mx-auto pt-1">
            {isEn ? (
              <>Curated and designed by <strong>Pocket Circus</strong> to share the passion of circus art with students, youth, and cultural travelers.</>
            ) : (
              <>Được biên soạn và thiết kế bởi <strong>Rạp Xiếc Bỏ Túi</strong> nhằm lan tỏa tình yêu nghệ thuật xiếc đến học sinh, sinh viên và du khách bốn phương.</>
            )}
          </p>
        </div>
      </div>

      {/* Brochure Navigation Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: isEn ? '1. Unique Identity' : '1. Nét Độc Bản Xiếc Việt', icon: '🇻🇳' },
          { id: 'contemporary', label: isEn ? '2. Contemporary Bamboo' : '2. Xiếc Đương Đại & Cây Tre', icon: '🎋' },
          { id: 'shows', label: isEn ? '3. Acclaimed Masterpieces' : '3. Tác Phẩm Vang Danh', icon: '🌟' },
          { id: 'guide', label: isEn ? '4. Audience Guide' : '4. Cẩm Nang Khán Giả Trẻ', icon: '🎓' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                circusAudio.playBambooStep();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md scale-105'
                  : 'bg-white text-neutral-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview / Nét độc bản */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
            <div className="size-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
              🇻🇳
            </div>
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Phần 1 • Khởi Nguồn & Bản Sắc
              </span>
              <h2 className="font-circus text-2xl text-neutral-900">
                Nghệ Thuật Xiếc Việt Nam — Tinh Hoa Trăm Năm
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                Khởi nguồn từ những trò bách hý dân gian tại hội làng ngàn xưa và chính thức được khai sinh hiện đại vào năm 1921 bởi <strong>cụ Tạ Duy Hiển</strong>, xiếc Việt Nam đã trải qua hơn một thế kỷ thăng trầm để trở thành niềm tự hào của nền nghệ thuật biểu diễn dân tộc.
              </p>
              <p>
                Khác biệt với xiếc cơ giới phương Tây hay sự hào nhoáng của xiếc hiện đại quy mô lớn, xiếc Việt Nam mang linh hồn đậm đà bản sắc phương Đông: sự dẻo dai, nhịp điệu uyển chuyển, tinh thần đồng đội keo sơn và chất thơ mộc mạc của làng quê đồng bằng Bắc Bộ cũng như miền sông nước Nam Bộ.
              </p>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/80 space-y-3">
              <h4 className="font-circus text-base text-red-900 flex items-center gap-2">
                <span>★</span>
                <span>Những Điểm Nhấn Tự Hào</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Kỷ lục Guinness thế giới:</strong> Hai anh em nghệ sĩ Quốc Cơ - Quốc Nghiệp với màn chồng đầu đi bậc thang ngoạn mục vang danh toàn cầu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Huy chương Vàng quốc tế:</strong> Hàng chục giải thưởng cao quý tại Nga, Pháp, Monaco, Ý, Trung Quốc và Cuba.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Không gian diễn phong phú:</strong> Từ rạp mái bạt tròn truyền thống, nhà hát opera hoa lệ đến các sân khấu quảng trường ngoài trời.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contemporary Circus / Xiếc Đương Đại */}
      {activeTab === 'contemporary' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
            <div className="size-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl">
              🎋
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Phần 2 • Làn Gió Đương Đại
              </span>
              <h2 className="font-circus text-2xl text-neutral-900">
                Khi Cây Tre Hóa Thân Thành Ngôn Ngữ Nghệ Thuật
              </h2>
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed">
            Xiếc đương đại (Contemporary Circus) Việt Nam là cuộc cách mạng nghệ thuật độc đáo: gạt bỏ những con thú hoang dã hay phục trang kim sa lấp lánh, các nghệ sĩ đưa <strong>cây tre</strong> — biểu tượng bất khuất của dân tộc — trở thành linh hồn sân khấu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-2xl">🎍</span>
              <h4 className="font-circus text-base text-emerald-950">Chất Liệu Thuần Việt</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Những thân tre dài, thúng tròn, gậy mây, rơm rạ được biến hóa thành cầu thăng bằng, đu bay, mái nhà, con thuyền một cách tài tình.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="text-2xl">🎵</span>
              <h4 className="font-circus text-base text-amber-950">Âm Nhạc Ngũ Cung Trực Tiếp</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Các nghệ sĩ biểu diễn cùng dàn nhạc sống: đàn bầu, đàn tranh, sáo trúc, cồng chiêng tạo nên bản hòa ca mộc mạc lay động lòng người.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <span className="text-2xl">🎭</span>
              <h4 className="font-circus text-base text-rose-950">Kịch Hình Thể & Cảm Xúc</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Mỗi động tác nhào lộn, uốn dẻo không đơn thuần phô diễn kỹ xảo mà kể một câu chuyện cảm xúc về con người và đất nước Việt Nam.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Famous Shows / Tác Phẩm Vang Danh */}
      {activeTab === 'shows' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
            <div className="size-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-2xl">
              🌟
            </div>
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Phần 3 • Di Sản Trên Sân Khấu Toàn Cầu
              </span>
              <h2 className="font-circus text-2xl text-neutral-900">
                Những Tác Phẩm Xiếc Đương Đại Chinh Phục Thế Giới
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded-full">
                  Biểu tượng văn hóa • Xiếc Tre
                </span>
                <h3 className="font-circus text-lg text-neutral-900">
                  Làng Tôi (My Village)
                </h3>
                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                  Tái hiện không gian làng quê êm đềm của vùng đồng bằng Bắc Bộ với tiếng gà gáy, phiên chợ sớm, trăng rằm và lũy tre xanh. Đã biểu diễn hơn 800 suất diễn tại Pháp, Đức, Hà Lan, Bỉ, Anh, Mỹ...
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-lg">
                  Lưu diễn quốc tế
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/40 border border-sky-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-700 uppercase bg-sky-100 px-2 py-0.5 rounded-full">
                  Nhịp Thở Đô Thị & Thuyền Thúng
                </span>
                <h3 className="font-circus text-lg text-neutral-900">
                  À Ố Show (A O Show)
                </h3>
                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                  Đối thoại hấp dẫn giữa sự bình dị miền quê phương Nam và nhịp sống đô thị nhộn nhịp thời hiện đại, kết hợp độc đáo giữa xiếc tre, hip-hop, hò Nam Bộ và beatbox.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-sky-800 bg-sky-200/70 px-3 py-1 rounded-lg">
                  Nhà hát TP.HCM
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50/40 border border-red-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded-full">
                  Sử Thi Tây Nguyên Huyền Bí
                </span>
                <h3 className="font-circus text-lg text-neutral-900">
                  Teh Dar (Vòng Tròn Cuộc Sống)
                </h3>
                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                  Tái hiện không gian rừng thiêng, tiếng cồng chiêng gầm vang bên lửa trại và bản trường ca bất tận của các dân tộc anh em Tây Nguyên bằng kỹ thuật nhào lộn trên không ngoạn mục.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-red-800 bg-red-200/70 px-3 py-1 rounded-lg">
                  Châu Âu & Úc
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Guide for students & guests / Cẩm nang khán giả trẻ */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
            <div className="size-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Phần 4 • Dành Cho Học Sinh - Sinh Viên & Khách Khám Phá
              </span>
              <h2 className="font-circus text-2xl text-neutral-900">
                Cẩm Nang Trải Nghiệm & Thưởng Thức Xiếc
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-700">
            <div className="space-y-3">
              <h4 className="font-circus text-base text-red-900 flex items-center gap-1.5">
                <span>🎪</span>
                <span>Địa Chỉ Các Rạp Xiếc Tiêu Biểu</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-600">
                <li className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900 block">Rạp Xiếc Trung Ương (Liên đoàn Xiếc Việt Nam)</strong>
                  <span>67-69 Trần Nhân Tông, Q. Hai Bà Trưng, Hà Nội • Biểu diễn định kỳ cuối tuần.</span>
                </li>
                <li className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900 block">Nhà Hát Nghệ Thuật Phương Nam</strong>
                  <span>Công viên Gia Định, Q. Gò Vấp, TP. Hồ Chí Minh • Rạp bạt xiếc hiện đại lớn nhất miền Nam.</span>
                </li>
                <li className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900 block">Nhà Hát Lớn TP. Hồ Chí Minh & Lune Production</strong>
                  <span>07 Công Trường Lam Sơn, Q. 1, TP.HCM • Nơi diễn các vở xiếc tre À Ố Show, Làng Tôi.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-circus text-base text-red-900 flex items-center gap-1.5">
                <span>💡</span>
                <span>Mẹo Nhỏ Khi Đi Xem Xiếc</span>
              </h4>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5 text-xs text-neutral-700">
                <p>
                  <strong>• Đừng ngại vỗ tay hoan hô:</strong> Tiếng vỗ tay và lời cổ vũ là nguồn năng lượng quý giá nhất giúp nghệ sĩ giữ vững thăng bằng và tự tin vượt qua các khoảnh khắc nguy hiểm.
                </p>
                <p>
                  <strong>• Vé ưu đãi học sinh - sinh viên:</strong> Hãy luôn mang theo thẻ học sinh/sinh viên để nhận mức giảm giá từ 20% - 50% tại hầu hết các rạp xiếc công lập trên toàn quốc.
                </p>
                <p>
                  <strong>• Tắt đèn flash máy ảnh:</strong> Ánh đèn flash bất ngờ có thể làm chói mắt nghệ sĩ đang biểu diễn trên cao, gây nguy hiểm khôn lường.
                </p>
                <p>
                  <strong>• Đến sớm 15 phút:</strong> Để cảm nhận không khí háo hức dưới ánh đèn sân khấu và chọn được vị trí quan sát góc nhìn toàn cảnh đẹp nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Call to Action banner */}
      <div className="bg-gradient-to-r from-red-800 via-red-900 to-[#1e0707] text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 font-circus text-sm">
            <span>★</span>
            <span>{isEn ? "POCKET CIRCUS VIETNAM" : "RẠP XIẾC BỎ TÚI VIỆT NAM"}</span>
            <span>★</span>
          </div>
          <h3 className="font-circus text-xl sm:text-2xl text-amber-300">
            {isEn ? "Join Us in Spreading Vietnamese Circus Heritage" : "Cùng Chúng Mình Lan Tỏa Tinh Hoa Xiếc Việt"}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
            {isEn ? (
              <>
                Please share this{" "}
                <a
                  href="https://canva.link/t1yoszd541vjc3z"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => circusAudio.playBambooStep()}
                  className="text-amber-300 font-bold underline hover:text-white inline-flex items-center gap-1"
                  title="Open brochure on Canva"
                >
                  promotional brochure
                  <ExternalLink className="size-3" />
                </a>{" "}
                with friends, classmates, and your community to foster appreciation for national performing arts!
              </>
            ) : (
              <>
                Hãy chia sẻ{' '}
                <a
                  href="https://canva.link/t1yoszd541vjc3z"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => circusAudio.playBambooStep()}
                  className="text-amber-300 font-bold underline hover:text-white inline-flex items-center gap-1"
                  title="Mở brochure trên Canva"
                >
                  brochure quảng bá này
                  <ExternalLink className="size-3" />
                </a>{' '}
                tới bạn bè trong lớp, trong trường và cộng đồng để cùng chung tay giữ gìn và phát huy vẻ đẹp nghệ thuật dân tộc!
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://canva.link/t1yoszd541vjc3z"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-circus font-normal tracking-wide shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
            title={isEn ? "Open Brochure on Canva" : "Mở Brochure trên Canva"}
          >
            <span>{isEn ? "Open Brochure" : "Mở Brochure Canva"}</span>
            <ExternalLink className="size-4" />
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-amber-300/40"
          >
            <Share2 className="size-4" />
            <span>{copied ? (isEn ? 'Link Copied!' : 'Đã Sao Chép Link!') : (isEn ? 'Share' : 'Chia Sẻ')}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              circusAudio.playBambooStep();
              onNavigateTo('about');
            }}
            className="bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/50"
          >
            <span>{isEn ? "About Us" : "Về Chúng Tôi"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
