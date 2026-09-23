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
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon
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
    ? (isEn ? "Change Overview Cover Photo" : "Đổi Ảnh Bìa Ngoài Triển Lãm")
    : (isEn 
        ? `Add Cover Photo for Milestone ${targetEraObj?.sectionNumber || ""}`
        : `Thêm / Đổi Ảnh Bìa cho Mốc ${targetEraObj?.sectionNumber || ""}`);

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

            {/* Change / Reset Cover Photo Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCoverDialog}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-amber-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={isEn ? "Change outside cover photo" : "Thay đổi ảnh bìa bên ngoài"}
              >
                <Camera className="size-3.5" />
                <span>{isEn ? "Change Cover Photo" : "Đổi Ảnh Bìa Ngoài"}</span>
              </button>
              <button
                onClick={handleResetCover}
                className="p-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                title={isEn ? "Reset to default cover" : "Đặt lại ảnh bìa mặc định"}
              >
                <RotateCcw className="size-3.5" />
              </button>
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

                    {/* Change / Delete Cover Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenMilestoneCoverDialog(era.id, e)}
                        className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-amber-300 hover:text-white text-[11px] font-bold border border-white/20 flex items-center gap-1 shadow-md cursor-pointer transition-all"
                        title={isEn ? "Change cover photo" : "Đổi ảnh bìa"}
                      >
                        <Edit2 className="size-3" />
                        <span>{isEn ? "Change" : "Đổi ảnh"}</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteMilestoneCover(era.id, e)}
                        className="p-1 rounded-full bg-red-600/80 hover:bg-red-700 text-white shadow-md cursor-pointer transition-all"
                        title={isEn ? "Remove cover photo" : "Xóa ảnh bìa"}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-amber-200/90 font-medium truncate drop-shadow flex items-center gap-1.5">
                      <ImageIcon className="size-3" />
                      <span>{isEn ? "Custom cover photo active" : "Ảnh bìa đã cài đặt cho cột mốc"}</span>
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
                        {isEn ? `Add cover photo for Milestone ${era.sectionNumber}` : `Thêm ảnh bìa cho Mốc ${era.sectionNumber}`}
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
