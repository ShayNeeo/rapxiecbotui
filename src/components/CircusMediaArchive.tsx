import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { circusAudio } from "@/src/utils/audio";
import duNon4NuImg from "@/src/assets/images/du_non_4_nu_silver_idol.jpg";
import vungDatKyBiImg1 from "@/src/assets/images/vung_dat_ky_bi_thap_nguoi_1.jpg";
import vungDatKyBiImg2 from "@/src/assets/images/vung_dat_ky_bi_khong_gian_2.jpg";
import khaiMacTaiNangImg from "@/src/assets/images/khai_mac_tai_nang_xiec_du_non_ao_dai.jpg";
import cauBeRungXanhImg from "@/src/assets/images/cau_be_tro_ve_tu_rung_xanh.jpg";
import { Button } from "@/src/components/ui/button";
import { 
  Film, 
  Camera, 
  Play, 
  Pause, 
  X, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  Eye,
  UploadCloud,
  HardDrive,
  Link2,
  Plus,
  Trash2,
  Image as ImageIcon,
  RotateCcw,
  FileText,
  AlertTriangle,
  Layers
} from "lucide-react";

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  titleEn: string;
  troupe: string;
  category: 'bamboo' | 'acrobatics' | 'aerial' | 'backstage';
  thumbnail: string;
  galleryImages?: string[];
  videoUrl?: string;
  driveUrl?: string;
  articleUrl?: string;
  articleSource?: string;
  duration?: string;
  description: string;
  descriptionEn: string;
  year: string;
  tags: string[];
  isDriveSource?: boolean;
}

export const MODERN_CIRCUS_MEDIA: MediaItem[] = [
  {
    id: "media-cau-be-tro-ve-tu-rung-xanh-baovanhoa",
    type: "image",
    title: "Xiếc Việt kể chuyện Trung thu bằng 'Cậu bé trở về từ rừng xanh'",
    titleEn: "Vietnamese Circus Mid-Autumn Tale: 'The Boy Returning from the Green Jungle'",
    troupe: "Liên Đoàn Xiếc Việt Nam",
    category: "acrobatics",
    thumbnail: cauBeRungXanhImg,
    articleUrl: "https://baovanhoa.vn/nghe-thuat/xiec-viet-ke-chuyen-trung-thu-bang-cau-be-tro-ve-tu-rung-xanh-170335.html",
    articleSource: "Báo Văn Hóa",
    year: "2024",
    tags: ["Cậu Bé Rừng Xanh", "Xiếc Trung Thu", "Liên Đoàn Xiếc", "Rạp Xiếc Trung Ương"],
    description: "Vở kịch xiếc 'Cậu bé trở về từ rừng xanh' do Liên đoàn Xiếc Việt Nam công diễn tại Rạp Xiếc Trung ương dịp Tết Trung thu. Tác phẩm dàn dựng kỳ công, kết hợp xiếc nhào lộn, uốn dẻo, xiếc thú vui nhộn và hiệu ứng sân khấu huyền ảo, truyền tải thông điệp nhân văn về tình yêu gia đình và bảo vệ thiên nhiên muôn loài.",
    descriptionEn: "The circus spectacle 'The Boy Returning from the Green Jungle', presented by the Vietnam Circus Federation at the Central Circus Arena for Mid-Autumn Festival, combines acrobatics, contortion, animal acts, and magical staging to celebrate family bonds and nature conservation."
  },
  {
    id: "media-vung-dat-ky-bi-le-ich-dien-sggp",
    type: "image",
    title: "Vở đại vũ kịch xiếc 'Vùng Đất Kỳ Bí' (Nhà hát Phương Nam) - Đột phá xiếc TP.HCM",
    titleEn: "'The Mystic Land' Grand Circus Spectacle (Phuong Nam Theatre) - A Breakthrough for HCMC Circus",
    troupe: "Nhà Hát Nghệ Thuật Phương Nam",
    category: "acrobatics",
    thumbnail: vungDatKyBiImg1,
    galleryImages: [vungDatKyBiImg1, vungDatKyBiImg2],
    articleUrl: "https://www.sggp.org.vn/dao-dien-nsut-le-ich-dien-buoc-dem-cho-phat-trien-xiec-tphcm-post784148.html",
    articleSource: "Báo SGGP",
    year: "2025",
    tags: ["Vùng Đất Kỳ Bí", "Nhà Hát Phương Nam", "NSƯT Lê Ích Diễn", "Xiếc TP.HCM", "Bộ Ảnh Sân Khấu"],
    description: "Vở đại vũ kịch xiếc 'Vùng Đất Kỳ Bí' do Nhà hát Nghệ thuật Phương Nam dàn dựng dưới sự chỉ đạo của đạo diễn - NSƯT Lê Ích Diễn đã tạo nên hiện tượng 'cháy vé' tại TP.HCM. Tác phẩm kết hợp ngoạn mục giữa kỹ thuật xiếc thăng bằng tháp người đỉnh cao, âm thanh ánh sáng kỳ ảo và múa rối khổng lồ, mở ra bước tiến mới cho nghệ thuật xiếc đương đại thành phố.",
    descriptionEn: "The grand circus spectacle 'The Mystic Land', produced by Phuong Nam Theatre under Director - Meritorious Artist Le Ich Dien, became a sold-out phenomenon in Ho Chi Minh City. Blending towering human pyramid acrobatics, mystical lighting, and colossal puppetry, it marks a breakthrough for contemporary circus art."
  },
  {
    id: "media-khai-mac-tai-nang-xiec-2018-laodong",
    type: "image",
    title: "Nghẹt thở màn khai mạc Đu nón kết hợp Áo dài - Cuộc thi Tài năng Diễn viên Xiếc Toàn quốc",
    titleEn: "Breathtaking Opening: Aerial Conical Hat & Traditional Ao Dai - National Circus Talent Contest",
    troupe: "Liên Đoàn Xiếc Việt Nam",
    category: "aerial",
    thumbnail: khaiMacTaiNangImg,
    articleUrl: "https://laodong.vn/van-hoa/nghet-tho-truoc-man-khai-mac-cuoc-thi-tai-nang-dien-vien-xiec-644910.ldo",
    articleSource: "Báo Lao Động",
    year: "2018",
    tags: ["Tài Năng Xiếc", "Đu Nón Lá", "Áo Dài", "Khai Mạc", "Liên Đoàn Xiếc"],
    description: "Đêm khai mạc mãn nhãn của Cuộc thi Tài năng Diễn viên Xiếc Toàn quốc mở màn bằng tiết mục đu nón lá trên không kết hợp cùng tà áo dài truyền thống thướt tha và dàn múa nón hoành tráng trên đấu trường xiếc tròn rực rỡ sắc màu.",
    descriptionEn: "The spectacular opening night of the National Circus Talent Contest captivated audiences with an aerial conical hat performance harmonized with traditional Vietnamese Ao Dai and vibrant round arena choreography."
  },
  {
    id: "media-du-non-4-nu-giai-bac-the-gioi",
    type: "image",
    title: "Màn 'Đu nón 4 nữ' đoạt giải Bạc tại Liên hoan Xiếc Thế giới IDOL (Moskva)",
    titleEn: "Silver Award '4-Female Conical Hat Aerial Act' at IDOL World Circus Festival (Moscow)",
    troupe: "Liên Đoàn Xiếc Việt Nam",
    category: "aerial",
    thumbnail: duNon4NuImg,
    articleUrl: "https://vnexpress.net/man-du-non-4-nu-doat-giai-bac-tai-lien-hoan-xiec-the-gioi-4773445.html",
    articleSource: "VnExpress",
    year: "2024",
    tags: ["Đu Nón 4 Nữ", "Giải Bạc Thế Giới", "Liên Đoàn Xiếc", "IDOL Moskva"],
    description: "Tiết mục 'Đu nón 4 nữ' của Liên đoàn Xiếc Việt Nam xuất sắc giành giải Bạc danh giá tại Liên hoan Xiếc Thế giới IDOL 2024 ở Moskva (Nga), tôn vinh vẻ đẹp nón lá truyền thống và bản lĩnh phi thường của nữ nghệ sĩ xiếc Việt trên đấu trường quốc tế.",
    descriptionEn: "The breathtaking '4-Female Conical Hat' aerial act by the Vietnam Circus Federation won the prestigious Silver Award at the 2024 IDOL World Circus Festival in Moscow, honoring Vietnamese traditional conical hats and world-class aerial artistry."
  },
  {
    id: "media-quoc-co-quoc-nghiep-got-talent",
    type: "video",
    title: "Màn trình diễn đỉnh cao ở đêm chung kết Got Talent của hai anh em Quốc Cơ - Quốc Nghiệp",
    titleEn: "Peak Britain's Got Talent Final Performance - Giang Brothers (Quốc Cơ - Quốc Nghiệp)",
    troupe: "NSƯT Quốc Cơ - NSƯT Quốc Nghiệp",
    category: "acrobatics",
    thumbnail: "https://img.youtube.com/vi/df-9MrHOTaU/hqdefault.jpg",
    videoUrl: "https://youtu.be/df-9MrHOTaU?si=f9WHCBRHIVn5ECxn",
    duration: "5:30",
    description: "Màn trình diễn đỉnh cao ở đêm chung kết Britain's Got Talent của hai anh em nghệ sĩ Quốc Cơ - Quốc Nghiệp với cú nhảy sinh tử thăng bằng chồng đầu huyền thoại, làm rạng danh xiếc Việt Nam trên đấu trường quốc tế.",
    descriptionEn: "Peak Britain's Got Talent Grand Final performance of the Giang Brothers (Quốc Cơ & Quốc Nghiệp) with their legendary leap of faith head-to-head balancing act.",
    year: "2018",
    tags: ["Quốc Cơ Quốc Nghiệp", "Got Talent", "Chung Kết", "Kỷ Lục"]
  },
  {
    id: "media-phong-su-vo-dien-mo-show",
    type: "video",
    title: "Phóng sự vở diễn 'Mơ Show' - Bản giao hưởng thị giác và xiếc đương đại Việt Nam",
    titleEn: "Documentary Feature: 'Dreamscape Show' (Mơ Show) - Visual Symphony of Vietnamese Contemporary Circus",
    troupe: "Nhà Hát Nghệ Thuật Phương Nam",
    category: "bamboo",
    thumbnail: "https://img.youtube.com/vi/mLlYRMPFkIc/hqdefault.jpg",
    videoUrl: "https://youtu.be/mLlYRMPFkIc?si=e_MfcwhtGIJn_PQN",
    duration: "4:15",
    description: "Thước phim phóng sự đặc sắc về vở diễn 'Mơ Show' (Dreamscape Show) tại Rạp xiếc Phú Thọ, tôn vinh nghệ thuật xiếc đương đại Việt Nam hòa quyện cùng âm nhạc dân tộc, múa rối và kỹ xảo ánh sáng huyền ảo.",
    descriptionEn: "Special documentary feature on 'Dreamscape Show' (Mơ Show) at Phu Tho Circus Arena, celebrating Vietnamese contemporary circus blending indigenous puppetry, music, and surreal visual artistry.",
    year: "2024",
    tags: ["Mơ Show", "Xiếc Đương Đại", "Phóng Sự", "Nhà Hát Phương Nam"]
  },
  {
    id: "media-trailer-vung-dat-ky-bi",
    type: "video",
    title: "Trailer đại vũ kịch xiếc 'Vùng Đất Kỳ Bí' - Nhà Hát Nghệ Thuật Phương Nam",
    titleEn: "Official Trailer: 'The Mystic Land' Circus Spectacle - Phuong Nam Theatre",
    troupe: "Nhà Hát Nghệ Thuật Phương Nam",
    category: "acrobatics",
    thumbnail: "https://img.youtube.com/vi/-1yDN9RwtVU/hqdefault.jpg",
    videoUrl: "https://youtu.be/-1yDN9RwtVU?feature=shared",
    duration: "1:30",
    description: "Trailer chính thức giới thiệu vở đại vũ kịch xiếc hoành tráng 'Vùng Đất Kỳ Bí' của Nhà Hát Nghệ Thuật Phương Nam với những pha đu bay lượn và kỹ xảo ma thuật kỳ ảo.",
    descriptionEn: "Official trailer introducing the grand circus spectacle 'The Mystic Land' produced by Phuong Nam Theatre with magical aerial stunts and illusions.",
    year: "2024",
    tags: ["Vùng Đất Kỳ Bí", "Nhà Hát Phương Nam", "Trailer", "Ảo Thuật Xiếc"]
  },
  {
    id: "media-doan-xiec-vung-dat-ky-bi-wechoice",
    type: "video",
    title: "Đoàn xiếc 'Vùng Đất Kỳ Bí': Cú lội ngược dòng đập tan định kiến, vẽ lại giấc mơ rực rỡ cho Xiếc Việt",
    titleEn: "'Mystic Land' Circus Troupe: Breaking Prejudices, Painting a Radiant Dream for Vietnamese Circus",
    troupe: "Đoàn Xiếc 'Vùng Đất Kỳ Bí' (Phương Nam)",
    category: "acrobatics",
    thumbnail: "https://img.youtube.com/vi/sHqMeYyZzv8/hqdefault.jpg",
    videoUrl: "https://youtu.be/sHqMeYyZzv8?si=7DYvz4dsUypQvPcZ",
    duration: "6:20",
    description: "Phóng sự WeChoice Awards: Cú lội ngược dòng đập tan định kiến, thắp sáng lại niềm tin và vẽ nên giấc mơ rực rỡ cho nghệ thuật xiếc đương đại Việt Nam.",
    descriptionEn: "WeChoice Awards documentary: A breakthrough overcoming prejudices to rekindle dreams and passion for contemporary Vietnamese circus.",
    year: "2023",
    tags: ["Vùng Đất Kỳ Bí", "WeChoice Awards", "Xiếc Việt Đổi Mới", "Cảm Hứng"]
  },
  {
    id: "media-xiec-viet-nam-khong-ngung-doi-moi",
    type: "video",
    title: "Xiếc Việt Nam không ngừng đổi mới - Bước chuyển mình vươn tầm thời đại",
    titleEn: "Vietnamese Circus Continuously Innovates - Modern Evolution and Creative Leap",
    troupe: "Liên Đoàn Xiếc Việt Nam / Đài Hà Nội",
    category: "backstage",
    thumbnail: "https://img.youtube.com/vi/YgZJTBqBZ0c/hqdefault.jpg",
    videoUrl: "https://youtu.be/YgZJTBqBZ0c?si=YEB4rfPbUJr0GuwM",
    duration: "3:45",
    description: "Phóng sự chuyên sâu của Đài PT-TH Hà Nội về hành trình đổi mới không ngừng từ công nghệ dàn dựng, tư duy kịch bản đến cách tiếp cận khán giả trẻ của ngành xiếc Việt Nam.",
    descriptionEn: "Hanoi Television in-depth report on the ongoing transformation of Vietnamese circus in theatrical staging, innovative scripts, and youth engagement.",
    year: "2024",
    tags: ["Xiếc Đổi Mới", "Đài Hà Nội", "Liên Đoàn Xiếc", "Nghệ Thuật Đương Đại"]
  },
  {
    id: "media-duc-thang-thuy-duong-day-lua-doi",
    type: "video",
    title: "Tiết mục đu dây lụa đôi tuyệt mỹ - NSƯT Đức Thắng & Thùy Dương",
    titleEn: "Masterpiece Aerial Silk Duo - Duc Thang & Thuy Duong (Vietnam Circus Federation)",
    troupe: "Đức Thắng - Thùy Dương (Liên đoàn Xiếc VN)",
    category: "aerial",
    thumbnail: "https://img.youtube.com/vi/mo6tGpet2so/hqdefault.jpg",
    videoUrl: "https://youtu.be/mo6tGpet2so?si=pg3wILq-VGjlL2PQ",
    duration: "5:15",
    description: "Màn trình diễn xiếc dây lụa đôi trên không trữ tình, điêu luyện và cảm xúc thăng hoa của hai nghệ sĩ Đức Thắng - Thùy Dương thuộc Liên đoàn Xiếc Việt Nam.",
    descriptionEn: "Breathtaking and poetic aerial silk duo performance by artists Duc Thang and Thuy Duong of the Vietnam Circus Federation.",
    year: "2020",
    tags: ["Đức Thắng Thùy Dương", "Xiếc Lụa Đôi", "Liên Đoàn Xiếc", "Đu Bay Nghệ Thuật"]
  },
  {
    id: "media-lang-chai-xiec-mua-dan-gian-cham",
    type: "video",
    title: "Vở diễn 'Làng Chài' - Xiếc, múa dân gian đương đại và nét độc đáo văn hóa Chăm",
    titleEn: "'Fisherman Village' - Circus, Contemporary Folk Dance & Unique Cham Heritage",
    troupe: "Vũ Đoàn Sài Gòn & Nghệ Sĩ Xiếc",
    category: "bamboo",
    thumbnail: "https://img.youtube.com/vi/6WesfsDQmOw/hqdefault.jpg",
    videoUrl: "https://youtu.be/6WesfsDQmOw?si=vX0W9rOUCP5bNeRN",
    duration: "4:50",
    description: "Tác phẩm 'Làng Chài' kết hợp nghệ thuật xiếc đương đại với vũ điệu Chăm truyền thống và âm hưởng dân gian miền biển, tạo nên bức tranh văn hóa sống động và cuốn hút.",
    descriptionEn: "The 'Fisherman Village' production weaves contemporary circus feats with traditional Cham dance and coastal folklore into a vivid cultural tapestry.",
    year: "2023",
    tags: ["Làng Chài", "Văn Hóa Chăm", "Xiếc Đương Đại", "Vũ Đoàn Sài Gòn"]
  },
  {
    id: "media-tai-hien-ky-uc-truong-son-vtv24",
    type: "video",
    title: "Tái hiện ký ức Trường Sơn hào hùng bằng nghệ thuật xiếc - VTV24",
    titleEn: "Recreating Legendary Truong Son Memories through Circus Artistry - VTV24",
    troupe: "Liên Đoàn Xiếc Việt Nam / VTV24",
    category: "acrobatics",
    thumbnail: "https://img.youtube.com/vi/E_-WlEwHi5w/hqdefault.jpg",
    videoUrl: "https://youtu.be/E_-WlEwHi5w?si=PeRmH_rgl2h091Np",
    duration: "3:20",
    description: "Phóng sự VTV24 về tác phẩm xiếc sử thi tái hiện chân thực và xúc động những năm tháng khói lửa trên tuyến đường Trường Sơn huyền thoại qua nhào lộn, đu bay và thăng bằng.",
    descriptionEn: "VTV24 documentary on an epic circus production commemorating the heroic Truong Son trail with spectacular acrobatics and aerial balancing acts.",
    year: "2024",
    tags: ["Ký Ức Trường Sơn", "VTV24", "Liên Đoàn Xiếc", "Xiếc Sử Thi"]
  },
  {
    id: "media-dao-tao-xiec-viet-nguoi-lai-do-du-vang",
    type: "video",
    title: "Đào tạo xiếc Việt: Trải lòng của 'người lái đò' thầm lặng trên dây đu văng",
    titleEn: "Vietnamese Circus Training: Reflections of the Silent Masters on the Flying Trapeze",
    troupe: "Trường Trung Cấp Nghệ Thuật Xiếc Và Tạp Kỹ VN",
    category: "backstage",
    thumbnail: "https://img.youtube.com/vi/cFrw8Sqq3PA/hqdefault.jpg",
    videoUrl: "https://youtu.be/cFrw8Sqq3PA?si=9NtbdUhSC3OGJ8Pn",
    duration: "4:40",
    description: "Thước phim phóng sự của VietnamPlus ghi lại những tâm sự xúc động, giọt mồ hôi và nhiệt huyết truyền nghề của các thầy cô giáo bộ môn đu văng tại chiếc nôi đào tạo xiếc quốc gia.",
    descriptionEn: "A VietnamPlus documentary on the dedication, sweat, and heartfelt stories of trapeze instructors cultivating future generations at Vietnam's National Circus School.",
    year: "2024",
    tags: ["Đào Tạo Xiếc", "Đu Văng", "VietnamPlus", "Thầy Trò Xiếc"]
  }
];

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`
    : null;
}

interface CircusMediaArchiveProps {
  isOpen?: boolean;
  onClose: () => void;
  isFullPage?: boolean;
  onNavigateTo?: (act: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const CircusMediaArchive: React.FC<CircusMediaArchiveProps> = ({
  isOpen = true,
  onClose,
  isFullPage = false,
  onNavigateTo,
  onUnlockBadge,
}) => {
  const { isEn } = useLanguage();
  const unlockedArchiveBadgeRef = useRef(false);

  useEffect(() => {
    if (isOpen && !unlockedArchiveBadgeRef.current) {
      unlockedArchiveBadgeRef.current = true;
      onUnlockBadge?.('circus-digital-archive');
    }
  }, [isOpen]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  // User upload & Google Drive link state
  const [showDriveUploadPanel, setShowDriveUploadPanel] = useState<boolean>(false);
  const [driveUrlInput, setDriveUrlInput] = useState<string>("");
  const [customTitleInput, setCustomTitleInput] = useState<string>("");
  const [customTypeInput, setCustomTypeInput] = useState<'image' | 'video'>("image");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>("");

  // Deleted media tracking (supports deleting any video or media item)
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("pocket_circus_deleted_media");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [confirmDeleteMedia, setConfirmDeleteMedia] = useState<MediaItem | null>(null);

  // Blank template modal & form state
  const [showBlankTemplateModal, setShowBlankTemplateModal] = useState<boolean>(false);
  const [blankCoverImage, setBlankCoverImage] = useState<string>("");
  const [blankTitle, setBlankTitle] = useState<string>("");
  const [blankTitleEn, setBlankTitleEn] = useState<string>("");
  const [blankType, setBlankType] = useState<'image' | 'video'>("video");
  const [blankVideoUrl, setBlankVideoUrl] = useState<string>("");
  const [blankDuration, setBlankDuration] = useState<string>("1:00");
  const [blankTroupe, setBlankTroupe] = useState<string>("");
  const [blankYear, setBlankYear] = useState<string>(`${new Date().getFullYear()}`);
  const [blankCategory, setBlankCategory] = useState<'bamboo' | 'acrobatics' | 'aerial' | 'backstage'>("acrobatics");
  const [blankDescription, setBlankDescription] = useState<string>("");
  const [blankTags, setBlankTags] = useState<string>("Tự Tạo, Xiếc Việt");

  const [userUploadedMedia, setUserUploadedMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("pocket_circus_user_media");
      if (!saved) return [];
      const parsed: MediaItem[] = JSON.parse(saved);
      const filtered = parsed.filter(item => {
        const titleLower = (item.title || "").toLowerCase();
        const troupeLower = (item.troupe || "").toLowerCase();
        const tags = (item.tags || []).map(t => t.toLowerCase());

        // Remove old dummy Mơ Show item with "nghệ sĩ xiếc tự do" and tags #tự tạo, #xiếc việt
        const isOldMoShow = titleLower.includes("mơ show") && (
          troupeLower.includes("tự do") || 
          troupeLower.includes("independent") ||
          tags.some(t => t.includes("tự tạo")) ||
          tags.some(t => t.includes("xiếc việt"))
        );
        if (isOldMoShow) return false;

        return (
          item.id !== "media-ao-show-1" && 
          item.id !== "media-lang-toi-bamboo" &&
          !titleLower.includes("à ố") &&
          !titleLower.includes("làng tôi")
        );
      });

      if (filtered.length !== parsed.length) {
        localStorage.setItem("pocket_circus_user_media", JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const blankVideoFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: isEn ? "All Media" : "Tất Cả", icon: Sparkles },
    ...(userUploadedMedia.length > 0 ? [{ id: "user", label: isEn ? "Drive & Uploads" : "Tư Liệu Drive / Máy", icon: HardDrive }] : []),
    { id: "video", label: isEn ? "Short Videos" : "Video Ngắn", icon: Film },
    { id: "image", label: isEn ? "Photo Gallery" : "Hình Ảnh", icon: Camera },
    { id: "bamboo", label: isEn ? "Bamboo Circus" : "Xiếc Tre", icon: Filter },
    { id: "acrobatics", label: isEn ? "Acrobatics" : "Nhào Lộn & Kỷ Lục", icon: Filter },
    { id: "aerial", label: isEn ? "Aerial & Silk" : "Đu Bay & Dây Lụa", icon: Filter },
    { id: "backstage", label: isEn ? "Backstage" : "Hậu Trường & Đào Tạo", icon: Filter },
  ];

  // Exclude deleted media items
  const visibleDefaultMedia = MODERN_CIRCUS_MEDIA.filter(item => !deletedMediaIds.includes(item.id));
  const allMediaList = [...userUploadedMedia, ...visibleDefaultMedia].filter(item => {
    const titleLower = (item.title || "").toLowerCase();
    const troupeLower = (item.troupe || "").toLowerCase();
    const tags = (item.tags || []).map(t => t.toLowerCase());

    const isOldMoShow = titleLower.includes("mơ show") && (
      troupeLower.includes("tự do") || 
      troupeLower.includes("independent") ||
      tags.some(t => t.includes("tự tạo")) ||
      tags.some(t => t.includes("xiếc việt"))
    );
    return !isOldMoShow;
  });

  const filteredMedia = allMediaList.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "video") return item.type === "video";
    if (selectedCategory === "image") return item.type === "image";
    if (selectedCategory === "user") return item.isDriveSource || userUploadedMedia.some(u => u.id === item.id);
    return item.category === selectedCategory;
  });

  const handleOpenItem = (item: MediaItem) => {
    setSelectedMedia(item);
    setActiveImageIndex(0);
    setIsPlaying(item.type === "video");
    circusAudio.playBambooStep();
  };

  const handleShare = () => {
    circusAudio.playApplause();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle direct file upload (images/videos from device or downloaded from Drive)
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = [];
    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith("video");
      const url = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");

      const newItem: MediaItem = {
        id: `user-upload-${Date.now()}-${index}`,
        type: isVideo ? "video" : "image",
        title: cleanName || (isVideo ? "Video tư liệu xiếc mới" : "Hình ảnh tư liệu xiếc mới"),
        titleEn: cleanName || (isVideo ? "New Circus Video Archive" : "New Circus Photo Archive"),
        troupe: isEn ? "User Contribution (Drive/Device)" : "Đóng góp từ Drive & Thiết bị",
        category: "backstage",
        thumbnail: isVideo ? "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80" : url,
        videoUrl: isVideo ? url : undefined,
        duration: isVideo ? "0:45" : undefined,
        description: isEn 
          ? `File '${file.name}' added directly to the Digital Archive.`
          : `Tập tin '${file.name}' được tải lên trực tiếp vào Kho tư liệu số.`,
        descriptionEn: `Uploaded media: ${file.name}`,
        year: `${new Date().getFullYear()}`,
        tags: ["Tư Liệu Mới", "Tải Lên", isVideo ? "Video" : "Ảnh"],
        isDriveSource: true
      };
      newItems.push(newItem);
    });

    const updated = [...newItems, ...userUploadedMedia];
    setUserUploadedMedia(updated);
    try {
      // Save metadata (excluding blob URLs for safety)
      localStorage.setItem("pocket_circus_user_media", JSON.stringify(updated.slice(0, 20)));
    } catch {
      // local storage quota fallback
    }

    circusAudio.playApplause();
    setUploadSuccessMsg(isEn ? `Successfully added ${newItems.length} file(s)!` : `Đã thêm thành công ${newItems.length} tệp tư liệu!`);
    setTimeout(() => setUploadSuccessMsg(""), 3500);
  };

  // Handle adding a Google Drive or external link
  const handleAddDriveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrlInput.trim()) return;

    const isVideo = customTypeInput === "video";
    const title = customTitleInput.trim() || (isVideo ? "Clip video từ Google Drive" : "Tư liệu ảnh từ Google Drive");

    const newItem: MediaItem = {
      id: `drive-link-${Date.now()}`,
      type: isVideo ? "video" : "image",
      title: title,
      titleEn: title,
      troupe: isEn ? "Google Drive Archive" : "Tư Liệu Google Drive",
      category: "backstage",
      thumbnail: isVideo 
        ? "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80" 
        : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
      driveUrl: driveUrlInput.trim(),
      videoUrl: isVideo ? driveUrlInput.trim() : undefined,
      duration: isVideo ? "1:00" : undefined,
      description: isEn
        ? `Media linked from Google Drive: ${driveUrlInput.trim()}`
        : `Tư liệu liên kết từ Google Drive: ${driveUrlInput.trim()}`,
      descriptionEn: `Google Drive archive link: ${driveUrlInput.trim()}`,
      year: `${new Date().getFullYear()}`,
      tags: ["Google Drive", "Tư Liệu Số", isVideo ? "Video" : "Ảnh"],
      isDriveSource: true
    };

    const updated = [newItem, ...userUploadedMedia];
    setUserUploadedMedia(updated);
    try {
      localStorage.setItem("pocket_circus_user_media", JSON.stringify(updated.slice(0, 20)));
    } catch {
      // silent catch
    }

    setDriveUrlInput("");
    setCustomTitleInput("");
    circusAudio.playApplause();
    setUploadSuccessMsg(isEn ? "Drive link added to archive successfully!" : "Đã liên kết tư liệu Google Drive thành công!");
    setTimeout(() => setUploadSuccessMsg(""), 3500);
  };

  const handleDeleteMedia = (item: MediaItem) => {
    if (userUploadedMedia.some((u) => u.id === item.id)) {
      const updated = userUploadedMedia.filter((u) => u.id !== item.id);
      setUserUploadedMedia(updated);
      try {
        localStorage.setItem("pocket_circus_user_media", JSON.stringify(updated));
      } catch {
        // silent
      }
    } else {
      const updatedDeleted = [...deletedMediaIds, item.id];
      setDeletedMediaIds(updatedDeleted);
      try {
        localStorage.setItem("pocket_circus_deleted_media", JSON.stringify(updatedDeleted));
      } catch {
        // silent
      }
    }

    if (selectedMedia?.id === item.id) {
      setSelectedMedia(null);
    }
    setConfirmDeleteMedia(null);
    circusAudio.playBambooStep();
    setUploadSuccessMsg(
      isEn
        ? `Deleted: "${item.titleEn || item.title}" from media archive.`
        : `Đã xóa tệp: "${item.title}" khỏi kho tư liệu.`
    );
    setTimeout(() => setUploadSuccessMsg(""), 3500);
  };

  const handleRestoreDefaults = () => {
    setDeletedMediaIds([]);
    try {
      localStorage.removeItem("pocket_circus_deleted_media");
    } catch {
      // silent
    }
    circusAudio.playApplause();
    setUploadSuccessMsg(
      isEn ? "Default circus media restored successfully!" : "Đã khôi phục các tư liệu xiếc mặc định!"
    );
    setTimeout(() => setUploadSuccessMsg(""), 3500);
  };

  // Blank template: Handle uploading a cover image
  const handleCoverFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setBlankCoverImage(url);
    circusAudio.playBambooStep();
  };

  // Blank template: Handle uploading attached video file
  const handleBlankVideoFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setBlankVideoUrl(url);
    if (!blankTitle) {
      setBlankTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    circusAudio.playBambooStep();
  };

  // Blank template: Handle form submission
  const handleCreateFromTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankTitle.trim()) return;

    const isVideo = blankType === "video";
    const defaultCover = isVideo
      ? "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80"
      : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80";

    const newItem: MediaItem = {
      id: `blank-template-${Date.now()}`,
      type: blankType,
      title: blankTitle.trim(),
      titleEn: blankTitleEn.trim() || blankTitle.trim(),
      troupe: blankTroupe.trim() || (isEn ? "Independent Circus Artist" : "Nghệ sĩ Xiếc Tự Do"),
      category: blankCategory,
      thumbnail: blankCoverImage || defaultCover,
      videoUrl: isVideo && blankVideoUrl.trim() ? blankVideoUrl.trim() : undefined,
      driveUrl: blankVideoUrl.includes("drive.google.com") ? blankVideoUrl.trim() : undefined,
      duration: isVideo ? (blankDuration.trim() || "1:00") : undefined,
      description: blankDescription.trim() || (isEn ? "Custom circus archive created from blank template." : "Tư liệu xiếc được tự tạo từ mẫu trắng."),
      descriptionEn: blankDescription.trim() || "Custom circus archive entry created from blank template.",
      year: blankYear.trim() || `${new Date().getFullYear()}`,
      tags: blankTags.trim() ? blankTags.split(",").map(t => t.trim()) : ["Mẫu Tự Tạo", isVideo ? "Video" : "Hình Ảnh"],
      isDriveSource: Boolean(blankVideoUrl.includes("drive.google.com"))
    };

    const updated = [newItem, ...userUploadedMedia];
    setUserUploadedMedia(updated);
    try {
      localStorage.setItem("pocket_circus_user_media", JSON.stringify(updated.slice(0, 25)));
    } catch {
      // silent
    }

    // Reset form
    setBlankTitle("");
    setBlankTitleEn("");
    setBlankCoverImage("");
    setBlankVideoUrl("");
    setBlankDescription("");
    setShowBlankTemplateModal(false);

    circusAudio.playApplause();
    setUploadSuccessMsg(
      isEn ? `Successfully created "${newItem.title}"!` : `Đã lưu thẻ "${newItem.title}" vào kho tư liệu!`
    );
    setTimeout(() => setUploadSuccessMsg(""), 3500);
  };

  const handleRemoveUserItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = allMediaList.find(m => m.id === id);
    if (item) {
      setConfirmDeleteMedia(item);
    }
  };

  if (!isOpen && !isFullPage) return null;

  return (
    <div 
      className={isFullPage 
        ? "w-full max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in-50 duration-300"
        : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      }
      onClick={isFullPage ? undefined : onClose}
    >
      {isFullPage && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b-2 border-amber-300/80">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              circusAudio.playBambooStep();
              onClose();
            }}
            className="flex items-center gap-1.5 bg-white border-amber-300 text-neutral-900 hover:bg-amber-50 shadow-xs cursor-pointer font-medium"
          >
            <ArrowLeft className="size-4 text-red-700" />
            <span>{isEn ? "Back to Stage" : "Quay Lại Sân Khấu"}</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
              🎪 {isEn ? "Pocket Circus Vietnam • Digital Media Archive" : "Rạp Xiếc Bỏ Túi • Kho Tư Liệu Số"}
            </span>
          </div>
        </div>
      )}

      <div 
        className={`relative w-full bg-gradient-to-b from-[#FFFDF7] to-amber-50/90 rounded-3xl border-2 border-amber-400 overflow-hidden flex flex-col ${
          isFullPage ? "shadow-xl" : "max-w-5xl max-h-[92vh] shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-800 via-red-900 to-amber-950 text-white px-5 py-4 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <Film className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                  {isEn ? "DIGITAL ARCHIVES" : "KHO TƯ LIỆU SỐ"}
                </span>
                <span className="text-[11px] text-amber-200 font-medium hidden sm:inline">
                  {isEn ? "Modern Circus Vietnam" : "Xiếc Việt Nam Hiện Đại"}
                </span>
              </div>
              <h2 className="font-circus text-xl sm:text-2xl text-amber-300 leading-tight">
                {isEn ? "Modern Circus Vietnam Media Archive" : "Kho Tư Liệu Số: Xiếc Việt Nam Hiện Đại"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title={isEn ? "Share Archive" : "Chia sẻ kho tư liệu"}
            >
              {copied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4" />}
              <span className="hidden sm:inline">{copied ? (isEn ? "Copied!" : "Đã sao chép") : (isEn ? "Share" : "Chia sẻ")}</span>
            </button>
            <button
              onClick={() => {
                circusAudio.playBambooStep();
                onClose();
              }}
              className="size-9 rounded-xl bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isEn ? "Close Archive" : "Đóng"}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Subtitle / Intro Banner */}
        <div className="bg-amber-100/70 border-b border-amber-300/60 px-5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-800 font-bold">✨ {isEn ? "Highlights:" : "Điểm nhấn:"}</span>
            <span>
              {isEn
                ? "Where viewers can admire numerous vivid pictures and dynamic short videos of modern Vietnamese circus."
                : "Nơi người xem có thể chiêm ngưỡng nhiều hình ảnh sắc nét và video ngắn sống động về xiếc Việt Nam hiện đại."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {deletedMediaIds.length > 0 && (
              <button
                onClick={handleRestoreDefaults}
                className="px-2.5 py-1 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] flex items-center gap-1 border border-amber-400 cursor-pointer transition-colors shadow-xs"
                title={isEn ? "Restore hidden default circus videos" : "Khôi phục lại các video mặc định đã xóa"}
              >
                <RotateCcw className="size-3 text-red-700" />
                <span>{isEn ? `Restore defaults (${deletedMediaIds.length})` : `Khôi phục (${deletedMediaIds.length} video gốc)`}</span>
              </button>
            )}
            <span className="text-amber-900 font-semibold shrink-0 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              {filteredMedia.length} {isEn ? "Items" : "Tư liệu"}
            </span>
          </div>
        </div>

        {/* Google Drive / Upload Drop Panel */}
        {showDriveUploadPanel && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/80 border-b-2 border-amber-300 p-4 sm:p-5 animate-in slide-in-from-top-3 duration-200 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
                  <HardDrive className="size-4" />
                </div>
                <div>
                  <h4 className="font-circus text-sm text-red-900 font-bold">
                    {isEn ? "Add Videos & Pictures from Google Drive or Device" : "Thêm Ảnh & Video từ Google Drive hoặc Thiết Bị"}
                  </h4>
                  <p className="text-[11px] text-neutral-600">
                    {isEn 
                      ? "Directly upload media files or link your Google Drive folder/files to this archive"
                      : "Tải lên trực tiếp tệp ảnh/video hoặc dán đường dẫn Google Drive của bạn"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowDriveUploadPanel(false)}
                className="text-neutral-500 hover:text-neutral-800 p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option 1: File Dropzone / Select */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-400/80 hover:border-red-600 rounded-2xl p-4 bg-white/80 hover:bg-amber-100/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFilesSelected(e.target.files)} 
                  multiple 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
                <UploadCloud className="size-8 text-amber-600 group-hover:text-red-700 group-hover:scale-110 transition-all mb-1.5" />
                <span className="font-semibold text-xs text-neutral-800 group-hover:text-red-800">
                  {isEn ? "Click or Drag & Drop Photos / Videos Here" : "Bấm hoặc Kéo Thả Ảnh / Video Vào Đây"}
                </span>
                <span className="text-[10px] text-neutral-500 mt-0.5">
                  {isEn ? "Supports WEBP, JPG, PNG, MP4, MOV from your Drive folder" : "Hỗ trợ tệp WEBP, JPG, PNG, MP4 từ thư mục Drive hoặc máy"}
                </span>
              </div>

              {/* Option 2: Paste Google Drive / Video URL */}
              <form onSubmit={handleAddDriveLink} className="flex flex-col justify-between bg-white/90 rounded-2xl p-3 border border-amber-300/80 gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                  <Link2 className="size-3.5 text-red-700" />
                  <span>{isEn ? "Paste Google Drive or Video Link" : "Nhập Link Google Drive hoặc Video"}</span>
                </div>
                <input 
                  type="url" 
                  value={driveUrlInput}
                  onChange={(e) => setDriveUrlInput(e.target.value)}
                  placeholder="https://drive.google.com/..." 
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 focus:outline-hidden focus:ring-1 focus:ring-red-600 bg-amber-50/40"
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={customTitleInput}
                    onChange={(e) => setCustomTitleInput(e.target.value)}
                    placeholder={isEn ? "Title / description (optional)" : "Tên tiêu đề tư liệu (tùy chọn)"}
                    className="flex-1 text-xs px-2 py-1 rounded-lg border border-amber-300 bg-amber-50/40"
                  />
                  <select 
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value as 'image' | 'video')}
                    className="text-xs px-2 py-1 rounded-lg border border-amber-300 bg-white"
                  >
                    <option value="image">{isEn ? "Photo" : "Ảnh"}</option>
                    <option value="video">{isEn ? "Video" : "Video"}</option>
                  </select>
                  <Button type="submit" size="sm" variant="carnival" className="text-xs shrink-0 cursor-pointer h-7 px-2.5">
                    <Plus className="size-3 mr-1" />
                    <span>{isEn ? "Add Link" : "Thêm Link"}</span>
                  </Button>
                </div>
              </form>
            </div>

            {uploadSuccessMsg && (
              <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <Check className="size-3.5 text-emerald-700" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Category Filters */}
        <div className="px-5 py-3 border-b border-amber-200 bg-white/60 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  circusAudio.playBambooStep();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-red-700 text-white shadow-sm scale-102"
                    : "bg-amber-100/70 text-amber-900 hover:bg-amber-200/80 border border-amber-300/60"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Grid / Content Area */}
        <div className={`flex-1 space-y-6 ${isFullPage ? "p-5 sm:p-8" : "overflow-y-auto p-4 sm:p-6"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Blank Template Card */}
            <div
              onClick={() => {
                circusAudio.playBambooStep();
                setShowBlankTemplateModal(true);
              }}
              className="group relative bg-gradient-to-br from-amber-50/90 via-white to-orange-50/90 rounded-2xl overflow-hidden border-2 border-dashed border-amber-400 hover:border-red-600 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-5 min-h-[290px]"
            >
              <div className="flex flex-col items-center text-center my-auto py-2">
                <div className="size-14 rounded-2xl bg-gradient-to-tr from-red-700 to-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-3 border-2 border-amber-200">
                  <Plus className="size-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full mb-1.5">
                  {isEn ? "BLANK TEMPLATE" : "MẪU TRẮNG TƯ LIỆU SỐ"}
                </span>
                <h3 className="font-circus text-base sm:text-lg text-neutral-900 group-hover:text-red-700 transition-colors">
                  {isEn ? "+ Create Cover & Custom Title" : "+ Tự Thêm Bìa & Viết Tiêu Đề"}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 max-w-[240px] leading-relaxed">
                  {isEn 
                    ? "Upload your custom cover image, write your own title, and attach your video or picture."
                    : "Tải ảnh bìa tùy ý, tự viết tiêu đề tiết mục, tên nghệ sĩ và đính kèm video clip hoặc ảnh biểu diễn."}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200/80 flex items-center justify-center">
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 group-hover:bg-red-600 group-hover:text-white text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm">
                  <FileText className="size-3.5" />
                  <span>{isEn ? "Open Blank Template" : "Mở Mẫu Trắng"}</span>
                  <ChevronRight className="size-3.5 ml-0.5" />
                </span>
              </div>
            </div>

            {filteredMedia.map((item) => {
              const isVideo = item.type === "video";
              const isDrive = item.isDriveSource || Boolean(item.driveUrl);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className={`group relative bg-white rounded-2xl overflow-hidden border-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isDrive ? "border-amber-400 hover:border-red-600 bg-gradient-to-b from-amber-50/40 to-white" : "border-amber-200/80 hover:border-red-600"
                  }`}
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                    <img
                      src={item.thumbnail}
                      alt={isEn ? item.titleEn : item.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Type Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                        isVideo ? "bg-red-600" : "bg-emerald-600"
                      }`}>
                        {isVideo ? <Film className="size-3" /> : <Camera className="size-3" />}
                        <span>
                          {isVideo 
                            ? (isEn ? "Short Video" : "Video Ngắn") 
                            : (item.galleryImages && item.galleryImages.length > 1 
                                ? `${item.galleryImages.length} ${isEn ? "Photos" : "Ảnh"}` 
                                : (isEn ? "Photo" : "Ảnh"))}
                        </span>
                      </span>
                      {item.videoUrl && (item.videoUrl.includes("youtu.be") || item.videoUrl.includes("youtube.com")) && (
                        <span className="px-2 py-0.5 rounded-full bg-red-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 border border-red-500">
                          <span>YouTube</span>
                        </span>
                      )}
                      {item.articleUrl && (
                        <span className="px-2 py-0.5 rounded-full bg-red-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 border border-red-500">
                          <span>{item.articleSource || "Báo chí"}</span>
                        </span>
                      )}
                      {isVideo && item.duration && (
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-white/20">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {/* Drive / Year Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {isDrive && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] shadow-sm flex items-center gap-1">
                          <HardDrive className="size-2.5" />
                          <span>Drive</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-amber-200 font-medium">
                        {item.year}
                      </span>
                    </div>

                    {/* Video Play Overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-red-500 transition-all">
                          <Play className="size-6 fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Photo View Overlay */}
                    {!isVideo && (
                      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[10px] font-semibold">
                          <Eye className="size-3 text-amber-400" />
                          <span>{isEn ? "View HD" : "Xem Ảnh"}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                          {item.troupe}
                        </div>
                      </div>
                      <h3 className="font-circus text-base text-neutral-900 group-hover:text-red-700 transition-colors mt-0.5 line-clamp-2">
                        {isEn ? item.titleEn : item.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                        {isEn ? item.descriptionEn : item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-red-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{isVideo ? (isEn ? "Play" : "Xem Clip") : (isEn ? "View Photo" : "Xem Ảnh")}</span>
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Detail / Lightbox Player */}
        {selectedMedia && (
          <div 
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedMedia(null)}
          >
            <div 
              className="relative w-full max-w-3xl bg-neutral-950 rounded-2xl border-2 border-amber-400 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-3 right-3 z-20 size-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                title={isEn ? "Close" : "Đóng"}
              >
                <X className="size-4" />
              </button>

              {/* Player / Image Viewer Area */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                {selectedMedia.videoUrl && getYouTubeEmbedUrl(selectedMedia.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedMedia.videoUrl)!}
                    title={isEn ? selectedMedia.titleEn : selectedMedia.title}
                    className="size-full border-0 aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : selectedMedia.videoUrl && selectedMedia.videoUrl.startsWith("blob:") ? (
                  <video 
                    src={selectedMedia.videoUrl} 
                    controls 
                    autoPlay 
                    className="size-full object-contain" 
                  />
                ) : (
                  <div className="relative size-full flex items-center justify-center p-2 bg-neutral-950">
                    <img
                      src={(selectedMedia.galleryImages && selectedMedia.galleryImages[activeImageIndex]) || selectedMedia.thumbnail}
                      alt={isEn ? selectedMedia.titleEn : selectedMedia.title}
                      className="max-h-[62vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                    />

                    {/* Gallery Navigation Controls if Multiple Images */}
                    {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            circusAudio.playBambooStep();
                            setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedMedia.galleryImages!.length - 1));
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-lg hover:scale-105"
                          title={isEn ? "Previous image" : "Ảnh trước"}
                        >
                          <ChevronLeft className="size-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            circusAudio.playBambooStep();
                            setActiveImageIndex((prev) => (prev < selectedMedia.galleryImages!.length - 1 ? prev + 1 : 0));
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-lg hover:scale-105"
                          title={isEn ? "Next image" : "Ảnh tiếp theo"}
                        >
                          <ChevronRight className="size-5" />
                        </button>

                        {/* Pagination indicator and thumbnails */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20 flex items-center gap-2.5 shadow-xl">
                          <span>{activeImageIndex + 1} / {selectedMedia.galleryImages.length}</span>
                          <div className="flex items-center gap-1.5">
                            {selectedMedia.galleryImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  circusAudio.playBambooStep();
                                  setActiveImageIndex(idx);
                                }}
                                className={`size-2.5 rounded-full transition-all cursor-pointer ${
                                  idx === activeImageIndex ? 'bg-amber-400 scale-125 ring-2 ring-white/60' : 'bg-white/40 hover:bg-white/80'
                                }`}
                                title={`${isEn ? "Image" : "Ảnh"} ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Simulated Interactive Video Overlay if Video without direct blob and not YouTube */}
                {selectedMedia.type === "video" && !(selectedMedia.videoUrl && (selectedMedia.videoUrl.startsWith("blob:") || getYouTubeEmbedUrl(selectedMedia.videoUrl))) && (
                  <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-red-600 font-bold uppercase tracking-wider text-[10px]">
                        {isEn ? "Video Clip • Modern Circus" : "Clip Ngắn • Xiếc Việt Hiện Đại"}
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded text-[11px] text-amber-300">
                        {selectedMedia.duration || "0:50"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setIsPlaying(!isPlaying);
                            circusAudio.playApplause();
                          }}
                          className="size-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer"
                        >
                          {isPlaying ? <Pause className="size-8" /> : <Play className="size-8 fill-white ml-1" />}
                        </button>
                      </div>

                      {/* Video Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full bg-amber-400 ${isPlaying ? "animate-pulse w-3/4" : "w-1/3"}`} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-300">
                          <div className="flex items-center gap-3">
                            <span>{isPlaying ? "0:28" : "0:00"} / {selectedMedia.duration}</span>
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              className="hover:text-white cursor-pointer"
                            >
                              {isMuted ? <VolumeX className="size-3.5 text-red-400" /> : <Volume2 className="size-3.5 text-amber-300" />}
                            </button>
                          </div>
                          <span className="text-amber-300 font-semibold">1080p Full HD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-5 bg-neutral-900 text-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {selectedMedia.troupe} • {selectedMedia.year}
                      </span>
                      {selectedMedia.isDriveSource && (
                        <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                          Google Drive
                        </span>
                      )}
                    </div>
                    <h3 className="font-circus text-xl text-white">
                      {isEn ? selectedMedia.titleEn : selectedMedia.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedMedia.articleUrl && (
                      <a
                        href={selectedMedia.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title={isEn ? `Read article on ${selectedMedia.articleSource || "Newspaper"}` : `Đọc bài viết trên ${selectedMedia.articleSource || "Báo chí"}`}
                      >
                        <FileText className="size-3.5" />
                        <span>{selectedMedia.articleSource || (isEn ? "Article" : "Bài Báo")}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                    {selectedMedia.type === "image" && (
                      <a
                        href={(selectedMedia.galleryImages && selectedMedia.galleryImages[activeImageIndex]) || selectedMedia.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-neutral-700"
                        title={isEn ? "Open full resolution photo" : "Mở xem ảnh gốc độ phân giải cao"}
                      >
                        <Maximize2 className="size-3.5" />
                        <span>{isEn ? "HD Photo" : "Xem Ảnh Gốc"}</span>
                      </a>
                    )}
                    {selectedMedia.videoUrl && (selectedMedia.videoUrl.includes("youtu.be") || selectedMedia.videoUrl.includes("youtube.com")) && (
                      <a
                        href={selectedMedia.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title={isEn ? "Open full video on YouTube" : "Mở xem video trực tiếp trên YouTube"}
                      >
                        <Play className="size-3.5 fill-white" />
                        <span>{isEn ? "Watch on YouTube" : "Xem Trên YouTube"}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                    {selectedMedia.driveUrl && (
                      <a
                        href={selectedMedia.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>{isEn ? "Open in Drive" : "Mở Trên Drive"}</span>
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={handleShare}
                      className="text-xs cursor-pointer"
                    >
                      <Share2 className="size-3.5 mr-1" />
                      <span>{copied ? (isEn ? "Link Copied!" : "Đã Sao Chép!") : (isEn ? "Share" : "Chia Sẻ")}</span>
                    </Button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {isEn ? selectedMedia.descriptionEn : selectedMedia.description}
                </p>

                <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    {selectedMedia.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-amber-400/80 text-[11px]">
                    ★ {isEn ? "Archived by Pocket Circus Vietnam" : "Lưu trữ bởi Rạp Xiếc Bỏ Túi Việt Nam"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blank Template Modal: Add Cover Image & Custom Title */}
        {showBlankTemplateModal && (
          <div 
            className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setShowBlankTemplateModal(false)}
          >
            <div 
              className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#FFFDF7] to-amber-50 rounded-3xl border-2 border-amber-400 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-800 via-red-900 to-amber-950 text-white px-5 py-3.5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-md shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                      {isEn ? "CUSTOM ARCHIVE BUILDER" : "MẪU TRẮNG TƯ LIỆU SỐ"}
                    </span>
                    <h3 className="font-circus text-lg sm:text-xl text-amber-200 leading-tight">
                      {isEn ? "Blank Template: Add Cover & Write Custom Title" : "Mẫu Trắng: Tự Thêm Hình Vào Bìa & Tự Viết Tiêu Đề"}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowBlankTemplateModal(false)}
                  className="size-8 rounded-xl bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Live Card Preview */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="size-3.5 text-red-700" />
                        <span>{isEn ? "Live Cover Preview" : "Xem Trước Bìa Thẻ"}</span>
                      </span>
                      <span className="text-[10px] text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full border border-amber-300 font-semibold">
                        {blankType === "video" ? (isEn ? "Video Card" : "Thẻ Video") : (isEn ? "Photo Card" : "Thẻ Ảnh")}
                      </span>
                    </div>

                    {/* The Preview Card */}
                    <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg flex flex-col justify-between">
                      {/* Thumbnail / Cover */}
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                        {blankCoverImage ? (
                          <img
                            src={blankCoverImage}
                            alt="Cover Preview"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4 text-amber-200/80">
                            <ImageIcon className="size-10 mb-2 opacity-50 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-100">
                              {isEn ? "No Cover Image Yet" : "Chưa có hình bìa"}
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-0.5">
                              {isEn ? "Upload or pick a sample cover on the right" : "Tải ảnh lên hoặc chọn mẫu bìa bên cạnh"}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Badge Type */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                            blankType === "video" ? "bg-red-600" : "bg-emerald-600"
                          }`}>
                            {blankType === "video" ? <Film className="size-3" /> : <Camera className="size-3" />}
                            <span>{blankType === "video" ? (isEn ? "Video" : "Video Ngắn") : (isEn ? "Photo" : "Ảnh")}</span>
                          </span>
                          {blankType === "video" && (
                            <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-white/20">
                              {blankDuration || "1:00"}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-amber-200 font-medium">
                            {blankYear || "2025"}
                          </span>
                        </div>

                        {/* Play overlay for video */}
                        {blankType === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="size-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                              <Play className="size-6 fill-white ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Info Preview */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                            {blankTroupe || (isEn ? "Circus Troupe / Artist" : "Đoàn Xiếc / Tên Nghệ Sĩ")}
                          </div>
                          <h3 className="font-circus text-base text-neutral-900 mt-0.5 line-clamp-2">
                            {blankTitle || (isEn ? "Your Custom Circus Title" : "Tiêu đề tiết mục của bạn sẽ hiện ở đây...")}
                          </h3>
                          <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                            {blankDescription || (isEn ? "Short description and introduction of this circus act." : "Mô tả ngắn gọn, cảm nghĩ hoặc kỷ niệm về tiết mục xiếc này.")}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                          <div className="flex flex-wrap gap-1">
                            {(blankTags || "Tự Tạo, Xiếc Việt").split(",").slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                          <span className="text-red-700 font-bold flex items-center gap-1">
                            <span>{blankType === "video" ? (isEn ? "Play" : "Xem Clip") : (isEn ? "Detail" : "Chi Tiết")}</span>
                            <ChevronRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Cover Presets */}
                    <div className="bg-amber-100/60 rounded-xl p-3 border border-amber-300/80 space-y-2">
                      <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                        <Sparkles className="size-3 text-amber-700" />
                        <span>{isEn ? "Preset Cover Suggestions:" : "Gợi ý mẫu ảnh bìa xiếc đẹp:"}</span>
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setBlankCoverImage("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80")}
                          className="text-[10px] py-1 px-1.5 rounded-lg bg-white hover:bg-amber-200 border border-amber-300 text-amber-950 font-medium transition-colors cursor-pointer truncate"
                        >
                          🎋 {isEn ? "Bamboo" : "Xiếc Tre"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlankCoverImage("https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80")}
                          className="text-[10px] py-1 px-1.5 rounded-lg bg-white hover:bg-amber-200 border border-amber-300 text-amber-950 font-medium transition-colors cursor-pointer truncate"
                        >
                          🔥 {isEn ? "Fire" : "Xiếc Lửa"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlankCoverImage("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80")}
                          className="text-[10px] py-1 px-1.5 rounded-lg bg-white hover:bg-amber-200 border border-amber-300 text-amber-950 font-medium transition-colors cursor-pointer truncate"
                        >
                          🎪 {isEn ? "Aerial" : "Đu Dây Lụa"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Editable Form */}
                  <form onSubmit={handleCreateFromTemplate} className="lg:col-span-7 space-y-4">
                    {/* Step 1: Upload / Add Cover Image */}
                    <div className="bg-white rounded-2xl p-4 border border-amber-300 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera className="size-3.5 text-red-700" />
                          <span>1. {isEn ? "Add Cover Image" : "Thêm Hình Vào Bìa"}</span>
                        </label>
                        {blankCoverImage && (
                          <button
                            type="button"
                            onClick={() => setBlankCoverImage("")}
                            className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                          >
                            {isEn ? "Clear Cover" : "Gỡ ảnh bìa"}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="file"
                          ref={coverFileInputRef}
                          onChange={(e) => handleCoverFileSelected(e.target.files)}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          className="px-3 py-2.5 rounded-xl border-2 border-dashed border-amber-400 hover:border-red-600 bg-amber-50/60 hover:bg-amber-100/60 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <UploadCloud className="size-4 text-red-700" />
                          <span>{isEn ? "Upload Cover from Device" : "Tải ảnh bìa từ máy / Drive"}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={blankCoverImage}
                            onChange={(e) => setBlankCoverImage(e.target.value)}
                            placeholder={isEn ? "Or paste image URL / Drive..." : "Hoặc dán URL ảnh bìa..."}
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Custom Title */}
                    <div className="bg-white rounded-2xl p-4 border border-amber-300 space-y-3 shadow-xs">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="size-3.5 text-red-700" />
                        <span>2. {isEn ? "Write Custom Title (Required)" : "Tự Viết Tiêu Đề (Bắt Buộc)"}</span>
                      </label>
                      <div className="space-y-2">
                        <div>
                          <input
                            type="text"
                            required
                            value={blankTitle}
                            onChange={(e) => setBlankTitle(e.target.value)}
                            placeholder={isEn ? "Enter act title in Vietnamese (e.g., Tiết mục nhào lộn tre 2025)..." : "Nhập tiêu đề tiếng Việt (ví dụ: Tiết mục nhào lộn tre đỉnh cao 2025)..."}
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/30 text-xs font-bold text-neutral-900 focus:outline-none focus:border-red-600 focus:bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={blankTitleEn}
                            onChange={(e) => setBlankTitleEn(e.target.value)}
                            placeholder={isEn ? "Enter English title (Optional)..." : "Nhập tiêu đề tiếng Anh (Không bắt buộc)..."}
                            className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Type & Video Attachment */}
                    <div className="bg-white rounded-2xl p-4 border border-amber-300 space-y-3 shadow-xs">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Film className="size-3.5 text-red-700" />
                        <span>3. {isEn ? "Media Type & File Attachment" : "Định Dạng & Đính Kèm Tệp Video / Ảnh"}</span>
                      </label>
                      <div className="flex items-center gap-4 text-xs font-semibold text-neutral-800">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="blankType"
                            checked={blankType === "video"}
                            onChange={() => setBlankType("video")}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span>{isEn ? "Short Video" : "Video Clip Ngắn"}</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="blankType"
                            checked={blankType === "image"}
                            onChange={() => setBlankType("image")}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span>{isEn ? "Photo Gallery" : "Hình Ảnh Sân Khấu"}</span>
                        </label>
                      </div>

                      {blankType === "video" && (
                        <div className="space-y-2 pt-2 border-t border-amber-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="file"
                              ref={blankVideoFileInputRef}
                              onChange={(e) => handleBlankVideoFileSelected(e.target.files)}
                              accept="video/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => blankVideoFileInputRef.current?.click()}
                              className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <UploadCloud className="size-3.5 text-red-700" />
                              <span>{isEn ? "Select Video from Device" : "Chọn tệp video từ máy"}</span>
                            </button>

                            <input
                              type="text"
                              value={blankDuration}
                              onChange={(e) => setBlankDuration(e.target.value)}
                              placeholder={isEn ? "Duration (e.g. 1:00)" : "Thời lượng (ví dụ: 1:15)"}
                              className="px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              value={blankVideoUrl}
                              onChange={(e) => setBlankVideoUrl(e.target.value)}
                              placeholder={isEn ? "Or paste Video URL / Google Drive link..." : "Hoặc dán liên kết video / Google Drive..."}
                              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 4: Details & Troupe */}
                    <div className="bg-white rounded-2xl p-4 border border-amber-300 space-y-3 shadow-xs">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="size-3.5 text-red-700" />
                        <span>4. {isEn ? "Troupe, Year & Description" : "Thông Tin Nghệ Sĩ & Thể Loại"}</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                            {isEn ? "Troupe / Artist" : "Đoàn / Nghệ sĩ"}
                          </label>
                          <input
                            type="text"
                            value={blankTroupe}
                            onChange={(e) => setBlankTroupe(e.target.value)}
                            placeholder={isEn ? "e.g. Tường Vy & Chí Đăng" : "Ví dụ: Đoàn Xiếc TP.HCM"}
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                            {isEn ? "Year" : "Năm"}
                          </label>
                          <input
                            type="text"
                            value={blankYear}
                            onChange={(e) => setBlankYear(e.target.value)}
                            placeholder="2025"
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                            {isEn ? "Category" : "Thể loại"}
                          </label>
                          <select
                            value={blankCategory}
                            onChange={(e) => setBlankCategory(e.target.value as any)}
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600 cursor-pointer"
                          >
                            <option value="bamboo">{isEn ? "Bamboo Circus" : "Xiếc Tre"}</option>
                            <option value="acrobatics">{isEn ? "Acrobatics" : "Nhào Lộn & Kỷ Lục"}</option>
                            <option value="aerial">{isEn ? "Aerial Arts" : "Nghệ Thuật Trên Không"}</option>
                            <option value="backstage">{isEn ? "Backstage" : "Hậu Trường"}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                          {isEn ? "Short Description / Notes" : "Mô tả ngắn gọn / Cảm nghĩ"}
                        </label>
                        <textarea
                          rows={2}
                          value={blankDescription}
                          onChange={(e) => setBlankDescription(e.target.value)}
                          placeholder={isEn ? "Write a short summary about the performance..." : "Tự viết đôi lời mô tả về điểm nhấn, vẻ đẹp hoặc kỷ niệm của tiết mục..."}
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                          {isEn ? "Tags (comma-separated)" : "Thẻ gắn (cách nhau bởi dấu phẩy)"}
                        </label>
                        <input
                          type="text"
                          value={blankTags}
                          onChange={(e) => setBlankTags(e.target.value)}
                          placeholder="Tự Tạo, Xiếc Việt, Kỷ Niệm"
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-neutral-800 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBlankTitle("");
                          setBlankTitleEn("");
                          setBlankCoverImage("");
                          setBlankVideoUrl("");
                          setBlankDescription("");
                        }}
                        className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {isEn ? "Reset Form" : "Làm Lại"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBlankTemplateModal(false)}
                        className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {isEn ? "Cancel" : "Đóng"}
                      </button>
                      <button
                        type="submit"
                        disabled={!blankTitle.trim()}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102"
                      >
                        <Check className="size-4" />
                        <span>{isEn ? "Save Card to Archive" : "Lưu Thẻ Vào Kho Tư Liệu"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Dialog */}
        {confirmDeleteMedia && (
          <div 
            className="fixed inset-0 z-80 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setConfirmDeleteMedia(null)}
          >
            <div 
              className="relative w-full max-w-md bg-[#FFFDF7] rounded-2xl border-2 border-red-500 shadow-2xl overflow-hidden p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                  <Trash2 className="size-6" />
                </div>
                <div>
                  <h4 className="font-circus text-lg text-red-900 font-bold">
                    {isEn ? "Confirm Deletion" : "Xác Nhận Xoá Tư Liệu"}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {isEn 
                      ? `Are you sure you want to delete "${confirmDeleteMedia.titleEn || confirmDeleteMedia.title}" from the digital archive?`
                      : `Bạn có chắc chắn muốn xoá "${confirmDeleteMedia.title}" khỏi kho tư liệu số không?`}
                  </p>
                  <span className="inline-block mt-2 text-[11px] text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-medium">
                    💡 {isEn ? "Default items can be restored anytime from the top banner." : "Các video gốc có thể khôi phục lại bất kỳ lúc nào từ thanh phía trên."}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  onClick={() => setConfirmDeleteMedia(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  {isEn ? "Cancel" : "Hủy bỏ"}
                </button>
                <button
                  onClick={() => handleDeleteMedia(confirmDeleteMedia)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102"
                >
                  <Trash2 className="size-3.5" />
                  <span>{isEn ? "Yes, Delete" : "Xoá Khỏi Kho"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
