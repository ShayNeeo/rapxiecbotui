import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HistoryEra } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import { 
  History as HistoryIcon, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Camera,
  Plus,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { 
  getOverviewCover, 
  saveOverviewCover, 
  resetOverviewCover, 
  getMilestoneCover,
  saveMilestoneCover,
  removeMilestoneCover
} from "@/src/lib/historyImages";
import { AddPhotoDialog } from "@/src/components/history/AddPhotoDialog";

interface HistoryHomeProps {
  eras: HistoryEra[];
  readEras: string[];
  applauseCounts: Record<string, number>;
  isEn: boolean;
  onSelectMilestone?: (path: string) => void;
}

export const HistoryHome: React.FC<HistoryHomeProps> = ({
  eras,
  readEras,
  applauseCounts,
  isEn,
  onSelectMilestone,
}) => {
  const milestonePaths = ["/moc-1", "/moc-2", "/moc-3", "/moc-4"];

  // Overview cover image state
  const [coverUrl, setCoverUrl] = useState<string>(getOverviewCover);

  // Milestone cover photos map
  const [milestoneCovers, setMilestoneCovers] = useState<Record<string, string | null>>(() => {
    const map: Record<string, string | null> = {};
    eras.forEach((era) => {
      map[era.id] = getMilestoneCover(era.id);
    });
    return map;
  });

  // Dialog state
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);
  const [targetEraForCover, setTargetEraForCover] = useState<string>("overview");

  const handleOpenCoverDialog = () => {
    circusAudio.playBambooStep();
    setTargetEraForCover("overview");
    setIsAddPhotoOpen(true);
  };

  const handleOpenMilestoneCoverDialog = (eraId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    circusAudio.playBambooStep();
    setTargetEraForCover(eraId);
    setIsAddPhotoOpen(true);
  };

  const handleDeleteMilestoneCover = (eraId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    circusAudio.playBambooStep();
    removeMilestoneCover(eraId);
    setMilestoneCovers((prev) => ({ ...prev, [eraId]: null }));
  };

  const handleResetCover = () => {
    circusAudio.playBambooStep();
    resetOverviewCover();
    setCoverUrl(getOverviewCover());
  };

  const handleSavePhoto = (data: {
    url: string;
    caption: string;
    eraId: string;
    isCover?: boolean;
  }) => {
    if (targetEraForCover === "overview") {
      saveOverviewCover(data.url);
      setCoverUrl(data.url);
    } else {
      saveMilestoneCover(targetEraForCover, data.url);
      setMilestoneCovers((prev) => ({ ...prev, [targetEraForCover]: data.url }));
    }
  };

  const targetEraObj = eras.find((e) => e.id === targetEraForCover);
  const dialogCustomTitle = targetEraForCover === "overview"
    ? (isEn ? "Overview Photo" : "Tư Liệu Ảnh Triển Lãm")
    : (isEn 
        ? `Milestone ${targetEraObj?.sectionNumber || ""}`
        : `Tư Liệu Cột Mốc ${targetEraObj?.sectionNumber || ""}`);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Exhibition Banner with Outside Cover Photo */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400">
        {/* Background Cover Image with Gradient Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={coverUrl}
            alt="Circus History Grand Exhibition Cover"
            className="w-full h-full object-cover object-center transform scale-102 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-950/85 to-amber-950/80 backdrop-blur-[1px]" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 p-6 sm:p-10 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-sm w-fit">
              <HistoryIcon className="size-3.5" />
              <span>{isEn ? "Discovering Historical Documents" : "Khám Phá Tư Liệu Lịch Sử"}</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="font-circus text-2xl sm:text-4xl text-amber-300 leading-tight drop-shadow-md">
              {isEn 
                ? "VERTICAL HISTORICAL TIMELINE: FROM ANCIENT ORIGINS TO 100 YEARS OF VIETNAMESE CIRCUS" 
                : "DÒNG THỜI GIAN LỊCH SỬ: TỪ NGUỒN GỐC CỔ ĐẠI ĐẾN 100 NĂM XIẾC VIỆT NAM"}
            </h2>
            <p className="text-amber-100/95 text-xs sm:text-sm leading-relaxed drop-shadow font-normal">
              {isEn
                ? "Vietnamese circus art is a unique harmony between ancient acrobatic heritage and modern theatrical breath. From rudimentary traces thousands of years ago to the radiant spotlights of a century of Vietnamese Circus, this is a journey full of talent, courage, and the enduring vitality of a proud cultural heritage."
                : "Nghệ thuật xiếc Việt Nam là sự hòa quyện độc đáo giữa tinh hoa tạp kỹ cổ truyền và hơi thở sân khấu hiện đại. Từ những vết tích sơ khai hàng nghìn năm trước cho đến ánh đèn sân khấu lung linh của 100 năm Xiếc Việt Nam, đây là hành trình đong đầy tài năng, sự quả cảm và sức sống bền bỉ của một di sản văn hóa tự hào."}
            </p>
          </div>
        </div>
      </div>

      {/* Intro section for 4 Milestone Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="size-8 rounded-xl bg-red-700 text-white flex items-center justify-center text-base shadow-xs">
              🎪
            </span>
            <div>
              <h3 className="font-circus text-xl sm:text-2xl text-neutral-900">
                {isEn ? "4 Monumental Historical Milestones" : "4 Cột Mốc Lịch Sử Trọng Điểm"}
              </h3>
              <p className="text-xs text-neutral-600">
                {isEn 
                  ? "Select a milestone page below to explore dedicated documents and archives" 
                  : "Bấm vào từng trang cột mốc độc lập dưới đây để khám phá chi tiết tư liệu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-300 w-fit">
            <BookOpen className="size-3.5 text-amber-700" />
            <span>{isEn ? `Explored: ${readEras.length}/4` : `Đã xem: ${readEras.length}/4`}</span>
          </div>
        </div>

        {/* 4 Large Milestone Navigation Cards with Cover Photo Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {eras.map((era, index) => {
            const path = milestonePaths[index] || `/moc-${index + 1}`;
            const isRead = readEras.includes(era.id);
            const applauseCount = applauseCounts[era.id] || 0;
            const currentCover = milestoneCovers[era.id];

            return (
              <div
                key={era.id}
                className="group rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Milestone Cover Photo or Section to Add Cover Photo */}
                {currentCover ? (
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={currentCover}
                      alt={era.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badge on Image */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="size-8 rounded-xl bg-amber-400 border border-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center shadow-md">
                        {era.imageIcon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-700 text-white px-2.5 py-1 rounded-full shadow-md">
                        {isEn ? `Milestone ${era.sectionNumber}` : `Cột Mốc ${era.sectionNumber}`}
                      </span>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-amber-200/90 font-medium truncate drop-shadow flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <ImageIcon className="size-3 shrink-0" />
                        <span className="truncate">
                          {isEn ? (era.titleEn || era.title) : era.title}
                        </span>
                      </div>
                      {era.id === "ancient-circus" && (
                        <a
                          href="https://en.baodanang.vn/nguoi-sang-tao-rap-xiec-hien-dai-3282905.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-amber-300 hover:text-white underline decoration-amber-400/60 flex items-center gap-1 shrink-0 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs"
                          title={isEn ? "Source: en.baodanang.vn" : "Nguồn ảnh: Báo Đà Nẵng"}
                        >
                          <span>{isEn ? "Source: en.baodanang.vn" : "Nguồn: Báo Đà Nẵng"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                      {era.id === "classical-circus" && (
                        <a
                          href="https://36pho.com/xiec-o-ha-noi-xua-1936.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-amber-300 hover:text-white underline decoration-amber-400/60 flex items-center gap-1 shrink-0 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs"
                          title={isEn ? "Source: 36pho.com" : "Nguồn ảnh: 36pho.com"}
                        >
                          <span>{isEn ? "Source: 36pho.com" : "Nguồn: 36pho.com"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                      {era.id === "contemporary-circus" && (
                        <a
                          href="https://chinhsachcuocsong.vnanet.vn/nghe-thuat-xiec-qua-goc-nhin-cua-nghe-sy-nhiep-anh-nha-bao-thanh-ha/16876.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-amber-300 hover:text-white underline decoration-amber-400/60 flex items-center gap-1 shrink-0 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs"
                          title={isEn ? "Source: TTXVN" : "Nguồn ảnh: TTXVN"}
                        >
                          <span>{isEn ? "Source: TTXVN" : "Nguồn: TTXVN"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                      {era.id === "vietnam-century-circus" && (
                        <a
                          href="https://arttimes.vn/san-khau-dien-anh/ky-niem-100-nam-xiec-viet-nam-ton-vinh-ong-to-cua-nganh-xiec-chuyen-nghiep-c17a18668.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-amber-300 hover:text-white underline decoration-amber-400/60 flex items-center gap-1 shrink-0 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs"
                          title={isEn ? "Source: Arttimes.vn" : "Nguồn ảnh: Arttimes.vn"}
                        >
                          <span>{isEn ? "Source: Arttimes.vn" : "Nguồn: Arttimes"}</span>
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Section to Add Cover Photo if not set */
                  <div
                    onClick={(e) => handleOpenMilestoneCoverDialog(era.id, e)}
                    className="relative h-36 sm:h-40 w-full bg-gradient-to-b from-amber-50/70 to-amber-100/40 hover:from-amber-100/90 hover:to-amber-200/50 border-b-2 border-dashed border-amber-300 hover:border-amber-500 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center group/cover"
                  >
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="size-7 rounded-xl bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center shadow-xs">
                        {era.imageIcon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-700 text-white px-2 py-0.5 rounded-full shadow-xs">
                        {isEn ? `Milestone ${era.sectionNumber}` : `Cột Mốc ${era.sectionNumber}`}
                      </span>
                    </div>

                    <div className="size-11 rounded-2xl bg-amber-200/80 group-hover/cover:bg-amber-400 text-amber-900 group-hover/cover:text-amber-950 flex items-center justify-center transition-all shadow-xs mt-3">
                      <Camera className="size-5" />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-amber-950 flex items-center justify-center gap-1 group-hover/cover:text-red-700 transition-colors">
                        <Plus className="size-3.5" />
                        {isEn ? `Milestone ${era.sectionNumber}` : `Cột Mốc ${era.sectionNumber}`}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        {isEn ? "Click to upload from device or paste image URL" : "Bấm vào đây để tải ảnh từ máy hoặc dán link URL"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Content Area */}
                <div className="p-5 sm:p-6 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                        <Calendar className="size-3 text-amber-700" />
                        <span>{isEn ? (era.periodEn || era.period) : era.period}</span>
                      </span>
                      {isRead && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          <span>{isEn ? "Viewed" : "Đã xem"}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-circus text-xl text-neutral-900 leading-snug group-hover:text-red-700 transition-colors">
                      {isEn ? (era.titleEn || era.title) : era.title}
                    </h4>

                    <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed line-clamp-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                      {isEn ? (era.summaryEn || era.summary) : era.summary}
                    </p>
                  </div>

                  {/* Card Footer with Applause & Link Button */}
                  <div className="pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <span>👏</span>
                      <span>{applauseCount} {isEn ? "applauds" : "lượt tán thưởng"}</span>
                    </span>

                    {onSelectMilestone ? (
                      <button
                        type="button"
                        onClick={() => {
                          circusAudio.playBambooStep();
                          onSelectMilestone(path);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer border border-amber-300"
                      >
                        <span>{isEn ? `Explore Mốc ${era.sectionNumber} →` : `Khám phá Mốc ${era.sectionNumber} →`}</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    ) : (
                      <Link
                        to={path}
                        onClick={() => circusAudio.playBambooStep()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer border border-amber-300"
                      >
                        <span>{isEn ? `Explore Mốc ${era.sectionNumber} →` : `Khám phá Mốc ${era.sectionNumber} →`}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Change Cover Photo Dialog */}
      <AddPhotoDialog
        isOpen={isAddPhotoOpen}
        isCoverMode={true}
        initialEraId={targetEraForCover}
        customTitle={dialogCustomTitle}
        onClose={() => setIsAddPhotoOpen(false)}
        onSavePhoto={handleSavePhoto}
        isEn={isEn}
      />
    </div>
  );
};
