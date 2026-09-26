import React, { useState, useRef } from "react";
import { CircusVenue } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { OFFICIAL_CIRCUS_MAP } from "@/src/lib/map";
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Building2,
  CheckCircle2,
  Bookmark,
  Compass,
  ExternalLink,
  Upload,
  RotateCcw,
  Image as ImageIcon
} from "lucide-react";

interface CircusMapProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
  mapUrl?: string;
  onUploadMap?: (file: File) => void;
  onResetMap?: () => void;
}

const CIRCUS_VENUES: CircusVenue[] = [
  {
    id: "rap-xiec-phu-tho",
    name: "Rạp Xiếc và Biểu diễn đa năng Phú Thọ",
    nameEn: "Phu Tho Circus & Multi-purpose Arena",
    region: "Nam",
    city: "TP. Hồ Chí Minh",
    cityEn: "Ho Chi Minh City",
    address: "Số 1 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh (Khu liên hợp TDTT Phú Thọ)",
    addressEn: "1 Lu Gia, Ward 15, District 11, HCMC (Phu Tho Sports Complex)",
    establishedYear: 2025,
    eraId: "contemporary",
    eraName: "Thời kỳ Xiếc Đương Đại & Hội Nhập",
    eraNameEn: "Contemporary Circus & Global Integration",
    highlights: [
      "Quy mô 2.000 chỗ ngồi hiện đại nhất Đông Nam Á",
      "Sân khấu tròn chuẩn quốc tế kết hợp sàn diễn chữ nhật đa năng",
      "Hệ thống cơ khí sàn nâng thủy lực và đu bay tự động hóa",
      "Trung tâm giao lưu và biểu diễn xiếc quốc tế hàng đầu"
    ],
    highlightsEn: [
      "2,000-seat capacity, one of Southeast Asia's most advanced arenas",
      "International standard circus ring combined with rectangular proscenium",
      "Automated aerial fly-systems & hydraulic stage elevators",
      "Premier international circus festival & cultural exchange hub"
    ],
    description: "Công trình rạp xiếc trọng điểm quốc gia quy mô lớn nhất TP. Hồ Chí Minh với tổng mức đầu tư gần 1.400 tỷ đồng, thiết kế mái vòm cong hiện đại mang tính biểu tượng, phục vụ nghệ thuật xiếc, thể thao và biểu diễn đa năng tầm cỡ thế giới.",
    descriptionEn: "A flagship national performing arts theater in Ho Chi Minh City with nearly 1,400 billion VND investment, featuring an iconic modern curved dome designed for world-class circus, acrobatics, sports, and multimedia theatricals.",
    icon: "🎪",
    latRatio: 0.81,
    lonRatio: 0.53,
    mapUrl: "https://maps.app.goo.gl/GFoJWHMCsHR8g4qT7?g_st=ipc",
  },
  {
    id: "rap-xiec-cong-vien-gia-dinh",
    name: "Rạp Xiếc Công Viên Gia Định",
    nameEn: "Gia Dinh Park Circus Big Top",
    region: "Nam",
    city: "TP. Hồ Chí Minh",
    cityEn: "Ho Chi Minh City",
    address: "Công viên Gia Định, Đường Hoàng Minh Giám, Phường 3, Quận Gò Vấp, TP. Hồ Chí Minh",
    addressEn: "Gia Dinh Park, Hoang Minh Giam St, Ward 3, Go Vap Dist, HCMC",
    establishedYear: 1978,
    eraId: "golden-age",
    eraName: "Thời kỳ Vươn Ra Năm Châu",
    eraNameEn: "Reunification & Global Tours",
    highlights: [
      "Rạp bạt tròn quy mô lớn quen thuộc với thiếu nhi thành phố",
      "Các vở kịch xiếc cổ tích Đất Phương Nam kinh điển",
      "Biểu diễn đu bay nghệ thuật, nhào lộn trên không",
      "Căn cứ biểu diễn thường kỳ của Nhà Hát Nghệ Thuật Phương Nam"
    ],
    highlightsEn: [
      "Beloved circular circus big top nestled within lush urban parkland",
      "Classic Southern fairy-tale acrobatic dramas & pantomimes",
      "Breathtaking artistic aerial trapeze and tumbling spectacles",
      "Regular home venue of Phuong Nam Art Theater"
    ],
    description: "Thánh đường xiếc bạt tròn thân thương giữa không gian xanh của Công viên Gia Định, nơi gắn liền với tuổi thơ của hàng triệu khán giả và là cái nôi nghệ thuật của các thế hệ nghệ sĩ Nhà Hát Nghệ Thuật Phương Nam.",
    descriptionEn: "An affectionate circus sanctuary enveloped by the green canopies of Gia Dinh Park, cherished by generations of children and home to artists of Phuong Nam Art Theater.",
    icon: "🎭",
    latRatio: 0.77,
    lonRatio: 0.57,
    mapUrl: "https://maps.app.goo.gl/A8933G8p7LjdwKXV8?g_st=ipc",
  },
  {
    id: "rap-xiec-trung-uong",
    name: "Rạp Xiếc Trung Ương (Hà Nội)",
    nameEn: "Vietnam National Circus Theater (Hanoi)",
    region: "Bắc",
    city: "Hà Nội",
    cityEn: "Hanoi",
    address: "67-69 Trần Nhân Tông, P. Lê Đại Hành, Q. Hai Bà Trưng, Hà Nội (Công viên Thống Nhất)",
    addressEn: "67-69 Tran Nhan Tong St, Hai Ba Trung Dist, Hanoi (Thong Nhat Park)",
    establishedYear: 1956,
    eraId: "wartime",
    eraName: "Thời kỳ Tiếng Cười Kháng Chiến",
    eraNameEn: "Frontline & Revolutionary Circus",
    highlights: [
      "Sân khấu vòm tròn chuẩn quốc tế 1.200 chỗ",
      "Đu bay nghệ thuật đỉnh cao",
      "Ảo thuật tương tác quốc tế",
      "Xiếc thú nhân đạo"
    ],
    highlightsEn: [
      "1,200-seat international standard domed circus ring",
      "Spectacular high-wire & flying trapeze showcases",
      "Award-winning international magic illusions",
      "Ethical, humane acrobatics and stagecraft"
    ],
    description: "Cơ quan đầu ngành của xiếc Việt Nam, thành lập năm 1956 theo quyết định của Bác Hồ, quy tụ các nghệ sĩ nhân dân, nghệ sĩ ưu tú với những vở xiếc lịch sử hào hùng.",
    descriptionEn: "The flagship institution of Vietnamese circus, established in 1956 by decree of President Ho Chi Minh, uniting People's Artists and national champions in celebrated productions.",
    icon: "⭐",
    latRatio: 0.17,
    lonRatio: 0.44,
    mapUrl: "https://maps.app.goo.gl/zi3RkNzbFGENHH737?g_st=ipc",
  },
  {
    id: "doan-xiec-ha-noi",
    name: "Nhà Hát Nghệ Thuật Xiếc & Tạp Kỹ Hà Nội",
    nameEn: "Hanoi Circus & Variety Arts Theater",
    region: "Bắc",
    city: "Hà Nội",
    cityEn: "Hanoi",
    address: "Khu liên hợp Thể thao & Nghệ thuật Thủ Đô, Hà Nội",
    addressEn: "Capital Sports & Arts Complex, Hanoi",
    establishedYear: 1968,
    eraId: "wartime",
    eraName: "Thời kỳ Tiếng Cười Kháng Chiến",
    eraNameEn: "Wartime Heritage Troupe",
    highlights: [
      "Xiếc hề dân gian truyền thống",
      "Nhào lộn trên cầu bật",
      "Thăng bằng kiếm trên thang lắc"
    ],
    highlightsEn: [
      "Traditional folk clowning & comedic theatre",
      "Teeterboard tumbling and springboard acrobatics",
      "Sword balancing on moving rola bola ladders"
    ],
    description: "Cái nôi đào tạo nhiều lứa nghệ sĩ trẻ năng động, tiền thân từ các đoàn văn công xung kích trong kháng chiến chống Mỹ cứu nước.",
    descriptionEn: "A cradle for vibrant youth talent, originally born from vanguard art brigades performing for troops during wartime struggles.",
    icon: "🤹",
    latRatio: 0.15,
    lonRatio: 0.41,
    mapUrl: "https://maps.app.goo.gl/MkSpPy2LpmKy2Zi5A?g_st=ipc",
  },
  {
    id: "nha-hat-thanh-pho",
    name: "Nhà hát Thành Phố Hồ Chí Minh",
    nameEn: "Saigon Opera House (HCMC Municipal Theater)",
    region: "Nam",
    city: "TP. Hồ Chí Minh",
    cityEn: "Ho Chi Minh City",
    address: "Số 7 Công Trường Lam Sơn, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    addressEn: "7 Lam Son Square, Ben Nghe, District 1, Ho Chi Minh City",
    establishedYear: 1898,
    eraId: "contemporary",
    eraName: "Thời kỳ Xiếc Đương Đại & Kỷ Lục",
    eraNameEn: "Contemporary Circus & World Records",
    highlights: [
      "À Ố Show được biểu diễn tại nhà hát này",
      "Xiếc Tre Việt Nam lưu diễn hơn 50 quốc gia",
      "Kiến trúc biểu tượng Nhà hát Thành phố",
      "Đạo cụ thuần Việt: tre nứa, thúng lượn"
    ],
    highlightsEn: [
      "Resident stage for the world-famous À Ố Show",
      "Vietnamese Bamboo Circus touring over 50 countries",
      "Iconic 1898 French colonial opera architecture",
      "Authentic Vietnamese props: bamboo stalks and woven basket boats"
    ],
    description: "À Ố Show được biểu diễn tại nhà hát này. Nhà hát Thành phố Hồ Chí Minh là công trình kiến trúc nghệ thuật cổ kính biểu tượng, nơi những vở xiếc tre đương đại đặc sắc như À Ố Show hòa quyện cùng âm nhạc dân tộc, tái hiện sinh động văn hóa làng quê và đời sống Việt Nam đến khán giả toàn cầu.",
    descriptionEn: "Home venue for the renowned À Ố Show. The historic Saigon Opera House pairs French Belle Époque architecture with poetic contemporary bamboo circus, bridging rural Vietnamese folklore with modern urban theater for global audiences.",
    icon: "🏛️",
    latRatio: 0.82,
    lonRatio: 0.59,
    mapUrl: "https://maps.app.goo.gl/WWLX2kTfvQx3e65L8?g_st=ip",
  },
  {
    id: "rap-xiec-dam-sen",
    name: "Rạp Xiếc Đầm Sen",
    nameEn: "Dam Sen Cultural Park Circus",
    region: "Nam",
    city: "TP. Hồ Chí Minh",
    cityEn: "Ho Chi Minh City",
    address: "Công viên Văn hóa Đầm Sen, Số 3 Hòa Bình, Phường 3, Quận 11, TP. Hồ Chí Minh",
    addressEn: "Dam Sen Park, 3 Hoa Binh St, Ward 3, Dist 11, Ho Chi Minh City",
    establishedYear: 1990,
    eraId: "golden-age",
    eraName: "Thời kỳ Vươn Ra Năm Châu",
    eraNameEn: "Modern Entertainment Era",
    highlights: [
      "Xiếc vui nhộn gia đình",
      "Tung hứng tương tác khán giả",
      "Hề xiếc bong bóng khổng lồ"
    ],
    highlightsEn: [
      "Family-friendly joy and holiday comedy",
      "Interactive audience juggling shows",
      "Giant bubble clowning & illusion acts"
    ],
    description: "Sân khấu xiếc quen thuộc gắn liền với tuổi thơ của hàng triệu thế hệ thiếu nhi Sài Gòn và du khách các tỉnh phương Nam tại Công viên Văn hóa Đầm Sen.",
    descriptionEn: "A popular family stage entwined with childhood memories of millions of Saigon children and visitors at Dam Sen Cultural Park.",
    icon: "🎈",
    latRatio: 0.83,
    lonRatio: 0.51,
    mapUrl: "https://maps.app.goo.gl/RAFRuHhQpeE1mLsQ7?g_st=ipc",
  },
];

interface VenueMapLayout {
  pinX: number;
  pinY: number;
  barX: number;
  barY: number;
  barWidth: number;
  barHeight: number;
  connX: number;
  connY: number;
  shortName: string;
  shortNameEn: string;
}

const VENUE_LAYOUTS: Record<string, VenueMapLayout> = {
  // Hanoi 1: West of Hanoi (Left side bar)
  "doan-xiec-ha-noi": {
    pinX: 204,
    pinY: 155,
    barX: 18,
    barY: 130,
    barWidth: 168,
    barHeight: 32,
    connX: 186,
    connY: 146,
    shortName: "Xiếc & Tạp Kỹ Hà Nội",
    shortNameEn: "Hanoi Variety Circus",
  },
  // Hanoi 2: East of Hanoi (Right side bar)
  "rap-xiec-trung-uong": {
    pinX: 228,
    pinY: 145,
    barX: 282,
    barY: 130,
    barWidth: 168,
    barHeight: 32,
    connX: 282,
    connY: 146,
    shortName: "Rạp Xiếc Trung Ương",
    shortNameEn: "National Circus",
  },
  // HCMC 1: Upper West of HCMC (Left side bar, top)
  "rap-xiec-cong-vien-gia-dinh": {
    pinX: 295,
    pinY: 635,
    barX: 18,
    barY: 610,
    barWidth: 176,
    barHeight: 32,
    connX: 194,
    connY: 626,
    shortName: "Rạp Xiếc Gia Định",
    shortNameEn: "Gia Dinh Circus Top",
  },
  // HCMC 2: Lower West of HCMC (Left side bar, bottom)
  "rap-xiec-dam-sen": {
    pinX: 280,
    pinY: 655,
    barX: 18,
    barY: 665,
    barWidth: 176,
    barHeight: 32,
    connX: 194,
    connY: 681,
    shortName: "Rạp Xiếc Đầm Sen",
    shortNameEn: "Dam Sen Park Circus",
  },
  // HCMC 3: Upper East of HCMC (Right side bar, top)
  "rap-xiec-phu-tho": {
    pinX: 308,
    pinY: 648,
    barX: 375,
    barY: 575,
    barWidth: 176,
    barHeight: 32,
    connX: 375,
    connY: 591,
    shortName: "Rạp Đa Năng Phú Thọ",
    shortNameEn: "Phu Tho Circus Arena",
  },
  // HCMC 4: Lower East of HCMC (Right side bar, bottom)
  "nha-hat-thanh-pho": {
    pinX: 325,
    pinY: 640,
    barX: 375,
    barY: 630,
    barWidth: 176,
    barHeight: 32,
    connX: 375,
    connY: 646,
    shortName: "Nhà Hát Thành Phố",
    shortNameEn: "Saigon Opera House",
  },
};

export const CircusMap: React.FC<CircusMapProps> = ({
  onBack,
  onUnlockBadge,
  mapUrl = OFFICIAL_CIRCUS_MAP,
  onUploadMap,
  onResetMap,
}) => {
  const { isEn } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<'Tất Cả' | 'Bắc' | 'Trung' | 'Nam'>('Tất Cả');
  const [activeVenueId, setActiveVenueId] = useState<string>("rap-xiec-phu-tho");
  const [bookmarkedVenue, setBookmarkedVenue] = useState<string | null>(null);
  const [viewedVenues, setViewedVenues] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('circus_viewed_venues');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return [CIRCUS_VENUES[0].id];
  });
  const [mapBgColor, setMapBgColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('circus_map_bg_color');
      if (saved && saved !== '#FFF8DC') return saved;
      return '#FFFDF0';
    }
    return '#FFFDF0';
  });

  const handleSetMapTone = (hex: string) => {
    setMapBgColor(hex);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('circus_map_bg_color', hex);
      } catch {
        // ignore storage errors
      }
    }
  };

  const isCustomMapActive = Boolean(mapUrl && mapUrl !== OFFICIAL_CIRCUS_MAP);

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
    if (file && onUploadMap) {
      onUploadMap(file);
    }
  };

  const filteredVenues = selectedRegion === 'Tất Cả'
    ? CIRCUS_VENUES
    : CIRCUS_VENUES.filter((v) => v.region === selectedRegion);

  const activeVenue = CIRCUS_VENUES.find((v) => v.id === activeVenueId) || filteredVenues[0] || CIRCUS_VENUES[0];

  const handleSelectVenue = (venue: CircusVenue) => {
    setActiveVenueId(venue.id);
    circusAudio.playBambooStep();

    if (!viewedVenues.includes(venue.id)) {
      const nextViewed = [...viewedVenues, venue.id];
      setViewedVenues(nextViewed);
      try {
        localStorage.setItem('circus_viewed_venues', JSON.stringify(nextViewed));
      } catch {
        // ignore
      }

      if (nextViewed.length === CIRCUS_VENUES.length) {
        onUnlockBadge('circus-map-explorer');
        circusAudio.playFanfare();
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleBookmarkVenue = (venueName: string) => {
    circusAudio.playFanfare();
    setBookmarkedVenue(venueName);
    onUnlockBadge('circus-map-explorer');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setBookmarkedVenue(null), 3500);
  };

  const getRegionLabel = (reg: 'Tất Cả' | 'Bắc' | 'Trung' | 'Nam') => {
    if (isEn) {
      if (reg === 'Tất Cả') return 'All Regions';
      if (reg === 'Bắc') return 'North';
      if (reg === 'Trung') return 'Central';
      return 'South';
    }
    return reg === 'Tất Cả' ? 'Toàn Quốc' : `Miền ${reg}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 select-none">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 bg-white shadow-xs cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
          </Button>

          {/* Map Items Viewing Progress Pill */}
          <div className="flex items-center gap-1.5 bg-amber-100/90 px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-xs text-xs font-bold text-amber-950">
            <MapPin className="size-3.5 text-red-600" />
            <span>
              {isEn
                ? `Exploration: ${viewedVenues.length}/${CIRCUS_VENUES.length} venues`
                : `Khám phá di sản: ${viewedVenues.length}/${CIRCUS_VENUES.length} rạp xiếc`}
            </span>
            {viewedVenues.length === CIRCUS_VENUES.length && (
              <span className="text-emerald-700 flex items-center gap-1 text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="size-3 text-emerald-600" />
                <span>{isEn ? "Badge Unlocked!" : "Đã nhận huy hiệu!"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 bg-amber-100/90 p-1.5 rounded-2xl border-2 border-amber-300 shadow-xs">
          <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider px-2 flex items-center gap-1">
            <Compass className="size-3.5 text-amber-800" />
            <span>{isEn ? "Region:" : "Khu vực:"}</span>
          </span>
          {(['Tất Cả', 'Bắc', 'Trung', 'Nam'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => {
                setSelectedRegion(reg);
                const matching = reg === 'Tất Cả' ? CIRCUS_VENUES : CIRCUS_VENUES.filter((v) => v.region === reg);
                if (matching.length > 0 && !matching.some((v) => v.id === activeVenueId)) {
                  setActiveVenueId(matching[0].id);
                }
                circusAudio.playBambooStep();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-red-700 text-yellow-300 shadow-xs ring-2 ring-red-800/50'
                  : 'text-amber-950 hover:bg-amber-200/70'
              }`}
            >
              {getRegionLabel(reg)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Venue Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Stylized Cartoon Map of Vietnam (7 cols - Bigger & Clearer) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between border-b border-stone-100 pb-3 mb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-red-50 flex items-center justify-center border border-red-200/70">
                <Navigation className="size-4 text-red-600" />
              </div>
              <div>
                <span className="font-circus text-sm sm:text-base text-neutral-900 tracking-wide block">
                  {isEn ? "VIETNAM CIRCUS MAP" : "BẢN ĐỒ RẠP XIẾC VIỆT NAM"}
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {isEn ? "Official circus heritage map" : "Bản đồ di sản rạp xiếc Việt Nam"}
                </span>
              </div>
            </div>
            <span className="text-[11px] uppercase font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
              {filteredVenues.length} {isEn ? "Theaters & Stages" : "Rạp & Điểm Diễn"}
            </span>
          </div>

          {/* Stylized Vietnam Map Canvas SVG Container - Warm Golden Yellow Base */}
          <div 
            className="relative w-full h-[760px] sm:h-[820px] lg:h-[880px] flex items-center justify-center rounded-2xl overflow-hidden border border-amber-300/80 shadow-inner group transition-colors duration-200"
            style={{ backgroundColor: mapBgColor }}
          >
            <svg
              viewBox="0 0 736 870"
              className="w-full h-full max-h-[880px] select-none"
            >
              {/* Solid Light Warm Yellow Canvas Background */}
              <rect width="736" height="870" fill={mapBgColor} />

              {/* Map Image: Original OFFICIAL_CIRCUS_MAP or User Uploaded Custom Map */}
              <image
                href={mapUrl || OFFICIAL_CIRCUS_MAP}
                x="0"
                y="0"
                width="736"
                height="870"
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Subtle Decorative North Compass Indicator */}
              <g transform="translate(685, 48)" opacity="0.85">
                <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
                <polygon points="0,-10 3,2 0,0 -3,2" fill="#dc2626" />
                <polygon points="0,10 3,0 0,0 -3,0" fill="#78350f" />
                <text x="0" y="-11" fontSize="7" fontWeight="bold" fill="#dc2626" textAnchor="middle">N</text>
              </g>

              {/* INTERACTIVE SOVEREIGNTY REGIONS FOR HOÀNG SA & TRƯỜNG SA */}
              <g 
                className="cursor-pointer"
                onClick={() => circusAudio.playBambooStep()}
              >
                <circle cx="585" cy="445" r="55" fill="transparent" />
                <title>{isEn ? "Paracel Islands (Hoàng Sa) - Sacred Sovereignty of Vietnam" : "Quần đảo Hoàng Sa - Chủ quyền thiêng liêng của Việt Nam"}</title>
              </g>

              <g 
                className="cursor-pointer"
                onClick={() => circusAudio.playBambooStep()}
              >
                <circle cx="550" cy="760" r="65" fill="transparent" />
                <title>{isEn ? "Spratly Islands (Trường Sa) - Sacred Sovereignty of Vietnam" : "Quần đảo Trường Sa - Chủ quyền thiêng liêng của Việt Nam"}</title>
              </g>

              {/* DYNAMIC CIRCUS VENUE MAP PINS & CLEARLY SEPARATED LOCATION BARS */}
              {filteredVenues.map((venue) => {
                const isSelected = venue.id === activeVenueId;
                const layout = VENUE_LAYOUTS[venue.id] || {
                  pinX: 200,
                  pinY: 300,
                  barX: 20,
                  barY: 300,
                  barWidth: 150,
                  barHeight: 28,
                  connX: 170,
                  connY: 314,
                  shortName: venue.name.slice(0, 16),
                  shortNameEn: (venue.nameEn || venue.name).slice(0, 16),
                };

                const { pinX, pinY, barX, barY, barWidth, barHeight, connX, connY, shortName, shortNameEn } = layout;
                const displayName = isEn ? shortNameEn : shortName;

                return (
                  <g
                    key={venue.id}
                    className="cursor-pointer"
                    onClick={() => handleSelectVenue(venue)}
                  >
                    {/* Leader Line connecting Pin to Location Bar */}
                    <line
                      x1={pinX}
                      y1={pinY}
                      x2={connX}
                      y2={connY}
                      stroke={isSelected ? "#991b1b" : "#c2410c"}
                      strokeWidth={isSelected ? 2.2 : 1.2}
                      strokeDasharray={isSelected ? "none" : "3,2"}
                      opacity={isSelected ? 1 : 0.75}
                    />
                    {/* Anchor Dot at Pin connection */}
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r={isSelected ? 3.5 : 2.5}
                      fill={isSelected ? "#991b1b" : "#c2410c"}
                    />

                    {/* PIN ON MAP (Positioned on Vietnam territory) */}
                    <g transform={`translate(${pinX}, ${pinY})`}>
                      {isSelected && (
                        <>
                          <circle
                            cx="0"
                            cy="0"
                            r="18"
                            fill="#ef4444"
                            opacity="0.35"
                            className="animate-ping"
                          />
                          <circle
                            cx="0"
                            cy="0"
                            r="13"
                            fill="#ef4444"
                            opacity="0.25"
                          />
                        </>
                      )}

                      {/* Pin teardrop / badge */}
                      <path
                        d="M 0,-20 C -7,-20 -12,-15 -12,-7 C -12,3 0,14 0,14 C 0,14 12,3 12,-7 C 12,-15 7,-20 0,-20 Z"
                        fill={isSelected ? "#7f1d1d" : "#ffffff"}
                        stroke={isSelected ? "#fef08a" : "#b91c1c"}
                        strokeWidth={isSelected ? 2 : 1.5}
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.18))"
                      />
                      <circle cx="0" cy="-7" r="5.5" fill={isSelected ? "#fef08a" : "#fee2e2"} />
                      <text
                        x="0"
                        y="-4.5"
                        fontSize="8"
                        textAnchor="middle"
                        className="select-none pointer-events-none"
                      >
                        {venue.icon}
                      </text>
                    </g>

                    {/* DEDICATED LOCATION BAR - Clearly separated, non-overlapping */}
                    <g className="transition-transform duration-150 hover:scale-[1.02] origin-center">
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="6"
                        fill={isSelected ? "#7f1d1d" : "#ffffff"}
                        stroke={isSelected ? "#fef08a" : "#ca8a04"}
                        strokeWidth={isSelected ? 2 : 1.2}
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                      />

                      {/* Icon circle inside bar */}
                      <circle
                        cx={barX + 14}
                        cy={barY + barHeight / 2}
                        r="9"
                        fill={isSelected ? "#991b1b" : "#fef3c7"}
                        stroke={isSelected ? "#fef08a" : "#f59e0b"}
                        strokeWidth={0.8}
                      />
                      <text
                        x={barX + 14}
                        y={barY + barHeight / 2 + 3.5}
                        fontSize="9"
                        textAnchor="middle"
                        className="select-none pointer-events-none"
                      >
                        {venue.icon}
                      </text>

                      {/* Venue Name inside bar */}
                      <text
                        x={barX + 28}
                        y={barY + barHeight / 2 + 3.5}
                        fill={isSelected ? "#ffffff" : "#1f2937"}
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        className="select-none pointer-events-none"
                      >
                        {displayName}
                      </text>

                      {/* Active indicator dot inside bar */}
                      {isSelected && (
                        <circle
                          cx={barX + barWidth - 10}
                          cy={barY + barHeight / 2}
                          r="3"
                          fill="#facc15"
                        />
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Venue Details & Venue Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Venue Spotlight Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-4 border-amber-400 shadow-xl space-y-5 relative overflow-hidden">
            {bookmarkedVenue === activeVenue.name && (
              <div className="absolute inset-0 bg-amber-500/95 z-20 flex flex-col items-center justify-center p-6 text-center text-amber-950 animate-in fade-in duration-200">
                <Bookmark className="size-12 text-red-700 animate-bounce mb-2" />
                <h4 className="font-circus text-xl">
                  {isEn ? "SAVED TO CIRCUS NOTEBOOK!" : "ĐÃ LƯU VÀO SỔ TAY XIẾC!"}
                </h4>
                <p className="text-xs text-amber-900 mt-1 max-w-sm">
                  {isEn
                    ? `You bookmarked ${activeVenue.nameEn || activeVenue.name}. Keep exploring! Badge Unlocked!`
                    : `Bạn đã lưu địa chỉ rạp ${activeVenue.name} vào hành trang xiếc. Tiếp tục khám phá các điểm diễn khác nhé!`}
                </p>
                <span className="text-[10px] text-amber-950 mt-2 font-mono bg-amber-200 px-3 py-1 rounded-full">
                  {isEn ? "Record ID: " : "Mã lưu trữ: "}RXVN-{Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neutral-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="size-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs shrink-0 mt-0.5">
                  {activeVenue.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {isEn ? `${activeVenue.region === 'Bắc' ? 'North' : activeVenue.region === 'Trung' ? 'Central' : 'South'} • ${activeVenue.cityEn || activeVenue.city}` : `Miền ${activeVenue.region} • ${activeVenue.city}`}
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      {isEn ? `Est: ${activeVenue.establishedYear}` : `Năm thành lập: ${activeVenue.establishedYear}`}
                    </span>
                  </div>
                  <h3 className="font-circus text-lg sm:text-xl text-neutral-900 leading-snug mt-1">
                    {isEn ? (activeVenue.nameEn || activeVenue.name) : activeVenue.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-amber-50 sm:bg-transparent px-2.5 py-1 sm:px-0 sm:py-0 rounded-lg shrink-0 self-start">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-xs">
                  {isEn ? "Vietnam Circus Venue" : "Di tích & Rạp biểu diễn xiếc Việt Nam"}
                </span>
              </div>
            </div>

            {/* Address Info */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs sm:text-sm">
              <MapPin className="size-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 block text-xs uppercase tracking-wider mb-0.5">
                  {isEn ? "Address:" : "Địa chỉ:"}
                </span>
                <span className="text-neutral-800 leading-relaxed font-medium">
                  {isEn ? (activeVenue.addressEn || activeVenue.address) : activeVenue.address}
                </span>
              </div>
            </div>

            {/* Historical Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-amber-600" />
                <span>{isEn ? "Introduction & Artistic Significance" : "Giới Thiệu & Ý Nghĩa Nghệ Thuật"}</span>
              </span>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                {isEn ? (activeVenue.descriptionEn || activeVenue.description) : activeVenue.description}
              </p>
            </div>

            {/* Signature Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>{isEn ? "Scale & Signature Highlights" : "Quy Mô & Điểm Nhấn Đặc Trưng"}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEn && activeVenue.highlightsEn ? activeVenue.highlightsEn : activeVenue.highlights).map((hl, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-xl bg-amber-100/70 text-amber-950 border border-amber-200"
                  >
                    ★ {hl}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
              {activeVenue.mapUrl && (
                <a
                  href={activeVenue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0"
                  title={`Directions to ${activeVenue.name} on Google Maps`}
                >
                  <Navigation className="size-4" />
                  <span>{isEn ? "Directions (Google Maps)" : "Chỉ Đường (Google Maps)"}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              <Button
                variant="carnival"
                size="sm"
                onClick={() => handleBookmarkVenue(activeVenue.name)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Bookmark className="size-3.5" />
                <span>{isEn ? "Bookmark Venue in Notebook" : "Lưu Địa Chỉ Vào Sổ Tay Xiếc"}</span>
              </Button>
            </div>
          </div>

          {/* Selector List of Venues */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-amber-600" />
                <span>
                  {isEn
                    ? `Circus Venues & Theaters Directory (${filteredVenues.length})`
                    : `Danh Sách Rạp & Điểm Diễn Xiếc (${filteredVenues.length})`}
                </span>
              </span>
              <span className="text-[10px] text-amber-800 font-normal">
                {isEn ? "Click to view on map" : "Bấm để chọn và định vị trên bản đồ"}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredVenues.length === 0 ? (
                <div className="col-span-full py-8 text-center text-neutral-500 text-xs font-medium">
                  {isEn
                    ? "No venues found in this region."
                    : "Chưa có rạp hoặc điểm biểu diễn nào thuộc khu vực này."}
                </div>
              ) : (
                filteredVenues.map((venue) => {
                  const isSelected = venue.id === activeVenueId;
                return (
                  <div
                    key={venue.id}
                    onClick={() => handleSelectVenue(venue)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 font-bold shadow-xs ring-1 ring-amber-300'
                        : 'bg-neutral-50 hover:bg-amber-50/50 border-neutral-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{venue.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-neutral-900 truncate font-semibold">
                        {isEn ? (venue.nameEn || venue.name) : venue.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center justify-between mt-0.5">
                        <span>
                          {isEn ? (venue.cityEn || venue.city) : venue.city} • {isEn ? (venue.region === 'Bắc' ? 'North' : venue.region === 'Trung' ? 'Central' : 'South') : `Miền ${venue.region}`}
                        </span>
                        <span className="text-amber-800 font-medium">
                          {isEn ? `Est. ${venue.establishedYear}` : `Năm ${venue.establishedYear}`}
                        </span>
                      </div>
                    </div>

                    {venue.mapUrl && (
                      <a
                        href={venue.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="size-7 rounded-lg bg-white/90 hover:bg-red-600 text-red-600 hover:text-white border border-amber-300 hover:border-red-600 flex items-center justify-center shrink-0 transition-all shadow-xs"
                        title={isEn ? `Open ${venue.nameEn || venue.name} in Google Maps` : `Mở ${venue.name} trên Google Maps`}
                      >
                        <Navigation className="size-3.5" />
                      </a>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
