import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HistoryEra } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import {
  Calendar,
  Sparkles,
  Award,
  Globe2,
  ExternalLink,
  Play,
  Layers,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Quote,
  Camera,
  Maximize2,
  Trash2,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { 
  HistoryPhoto, 
  getMilestonePhotos, 
  addCustomPhoto, 
  deleteCustomPhoto,
  getMilestoneCover,
  saveMilestoneCover,
  removeMilestoneCover
} from "@/src/lib/historyImages";
import { PhotoLightboxModal } from "@/src/components/history/PhotoLightboxModal";
import { AddPhotoDialog } from "@/src/components/history/AddPhotoDialog";

interface MilestonePageProps {
  era: HistoryEra;
  index: number;
  prevPath: string | null;
  prevTitle: string | null;
  nextPath: string | null;
  nextTitle: string | null;
  applauseCount: number;
  onApplause: () => void;
  onMarkRead: (eraId: string) => void;
  isEn: boolean;
  activeSubsectionId: string;
  setActiveSubsectionId: (id: string) => void;
  onNavigate?: (path: string) => void;
}

export const MilestonePage: React.FC<MilestonePageProps> = ({
  era,
  index,
  prevPath,
  prevTitle,
  nextPath,
  nextTitle,
  applauseCount,
  onApplause,
  onMarkRead,
  isEn,
  activeSubsectionId,
  setActiveSubsectionId,
  onNavigate,
}) => {
  const isVietnamCentury = era.id === "vietnam-century-circus";

  // Milestone cover & photo states
  const [milestoneCover, setMilestoneCover] = useState<string | null>(() => getMilestoneCover(era.id));
  const [photos, setPhotos] = useState<HistoryPhoto[]>(() => getMilestonePhotos(era.id));
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"cover" | "gallery">("cover");
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<HistoryPhoto | null>(null);

  useEffect(() => {
    onMarkRead(era.id);
  }, [era.id, onMarkRead]);

  // Sync cover and photos when era changes
  useEffect(() => {
    setMilestoneCover(getMilestoneCover(era.id));
    setPhotos(getMilestonePhotos(era.id));
    setSelectedPhotoIndex(0);
  }, [era.id]);

  const reloadPhotos = () => {
    const list = getMilestonePhotos(era.id);
    setPhotos(list);
    if (selectedPhotoIndex >= list.length) {
      setSelectedPhotoIndex(0);
    }
  };

  const handleOpenCoverDialog = () => {
    circusAudio.playBambooStep();
    setDialogMode("cover");
    setIsAddPhotoOpen(true);
  };

  const handleOpenGalleryDialog = () => {
    circusAudio.playBambooStep();
    setDialogMode("gallery");
    setIsAddPhotoOpen(true);
  };

  const handleDeleteCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    circusAudio.playBambooStep();
    removeMilestoneCover(era.id);
    setMilestoneCover(null);
  };

  const handleSavePhoto = (data: {
    url: string;
    caption: string;
    eraId: string;
    isCover?: boolean;
  }) => {
    if (dialogMode === "cover") {
      saveMilestoneCover(era.id, data.url);
      setMilestoneCover(data.url);
    } else {
      addCustomPhoto({
        url: data.url,
        caption: data.caption,
        eraId: era.id,
      });
      reloadPhotos();
    }
  };

  const handleDeletePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    circusAudio.playBambooStep();
    deleteCustomPhoto(photoId);
    reloadPhotos();
  };

  const currentPhoto = photos[selectedPhotoIndex] || photos[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Milestone Card Container */}
      <div className="rounded-3xl p-5 sm:p-8 sm:p-10 border-2 bg-white border-amber-300 shadow-xl space-y-6">
        {/* Milestone Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-amber-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="size-9 rounded-2xl bg-amber-400 border-2 border-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center shadow-xs">
                {era.imageIcon}
              </span>
              <span className="text-xs font-black uppercase tracking-wider bg-red-700 text-white px-3 py-1 rounded-full shadow-2xs">
                {isEn ? `Milestone ${era.sectionNumber}` : `Cột Mốc ${era.sectionNumber}`}
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-amber-700" />
                <span>{isEn ? (era.periodEn || era.period) : era.period}</span>
              </span>
            </div>

            <h2 className="font-circus text-2xl sm:text-3xl text-neutral-900 leading-tight">
              {isEn ? (era.titleEn || era.title) : era.title}
            </h2>
          </div>

          {/* Independent Applause Button with persistent counter */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onApplause}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 text-xs sm:text-sm font-black flex items-center gap-2.5 transition-all shadow-md hover:scale-105 active:scale-95 border-2 border-amber-600 cursor-pointer"
            >
              <span className="text-lg">👏</span>
              <span>{isEn ? "Applaud" : "Tán thưởng"}</span>
              <span className="bg-white/90 px-2.5 py-0.5 rounded-full text-xs font-black text-amber-950 border border-amber-300 shadow-2xs">
                {applauseCount}
              </span>
            </button>
          </div>
        </div>

        {/* MILESTONE COVER PHOTO & SECTION TO AUTOMATICALLY ADD COVER PHOTO */}
        {milestoneCover ? (
          <div className="space-y-3">
            {/* Featured Hero Cover Photo */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group bg-neutral-950 aspect-[16/9] sm:aspect-[21/9] max-h-[380px] w-full flex items-center justify-center">
              <img
                src={milestoneCover}
                alt={era.title}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Photo Controls on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                  <ImageIcon className="size-3 text-amber-300" />
                  <span>
                    {era.id === "ancient-circus"
                      ? (isEn ? "Cover Photo for Milestone 1" : "Thêm ảnh bìa cho cột mốc 1")
                      : era.id === "classical-circus"
                      ? (isEn ? "Cover Photo for Milestone 2" : "Thêm ảnh bìa cho cột mốc 2")
                      : (isEn ? `Cover • Milestone ${era.sectionNumber}` : `Ảnh bìa • Cột mốc ${era.sectionNumber}`)}
                  </span>
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => {
                      circusAudio.playBambooStep();
                      setActiveLightboxPhoto({
                        id: `cover-${era.id}`,
                        url: milestoneCover,
                        caption: isEn ? `Cover Photo: ${era.titleEn || era.title}` : `Ảnh bìa: ${era.title}`,
                        eraId: era.id,
                      });
                    }}
                    className="p-2 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/30 transition-all cursor-pointer shadow-md"
                    title={isEn ? "View full resolution" : "Xem phóng to toàn màn hình"}
                  >
                    <Maximize2 className="size-3.5" />
                  </button>

                  <button
                    onClick={handleOpenCoverDialog}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-amber-500"
                  >
                    <Camera className="size-3.5" />
                    <span>{isEn ? "Change Cover" : "Đổi ảnh bìa"}</span>
                  </button>

                  <button
                    onClick={handleDeleteCover}
                    className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                    title={isEn ? "Remove cover photo" : "Xóa ảnh bìa"}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption & Source Citation on Bottom */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
                <div className="space-y-0.5 pointer-events-auto max-w-xl">
                  <p className="text-xs sm:text-sm font-bold drop-shadow-md text-amber-100/95 leading-relaxed">
                    📷 {era.id === "ancient-circus" 
                      ? (isEn ? "Cover Photo for Milestone 1: Origin of Circus & Classical Ring Origins" : "Thêm ảnh bìa cho cột mốc 1: Nguồn gốc xiếc thời cổ đại") 
                      : era.id === "classical-circus"
                      ? (isEn ? "Cover Photo for Milestone 2: Classical Circus & Hanoi Heritage 1936" : "Thêm ảnh bìa cho cột mốc 2: Nguồn gốc xiếc cổ điển")
                      : (isEn ? (era.titleEn || era.title) : era.title)}
                  </p>
                </div>

                {/* Image source citation in small corner */}
                {era.id === "ancient-circus" && (
                  <a
                    href="https://en.baodanang.vn/nguoi-sang-tao-rap-xiec-hien-dai-3282905.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-700 backdrop-blur-md text-amber-200 hover:text-white text-[11px] font-semibold transition-all border border-amber-400/40 hover:border-red-400 shadow-md cursor-pointer pointer-events-auto shrink-0"
                    title={isEn ? "Source: Danang Today (en.baodanang.vn)" : "Nguồn ảnh: Báo Đà Nẵng"}
                  >
                    <span>{isEn ? "Source: en.baodanang.vn" : "Nguồn ảnh: Báo Đà Nẵng"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {era.id === "classical-circus" && (
                  <a
                    href="https://36pho.com/xiec-o-ha-noi-xua-1936.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-700 backdrop-blur-md text-amber-200 hover:text-white text-[11px] font-semibold transition-all border border-amber-400/40 hover:border-red-400 shadow-md cursor-pointer pointer-events-auto shrink-0"
                    title={isEn ? "Source: 36pho.com" : "Nguồn ảnh: 36pho.com"}
                  >
                    <span>{isEn ? "Source: 36pho.com" : "Nguồn ảnh: 36pho.com"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* SECTION TO AUTOMATICALLY ADD COVER PHOTO */
          <div
            onClick={handleOpenCoverDialog}
            className="rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50/70 to-amber-100/40 hover:from-amber-100/80 hover:to-amber-200/50 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer shadow-xs group/addcover"
          >
            <div className="size-14 rounded-2xl bg-amber-200/80 group-hover/addcover:bg-amber-400 text-amber-900 group-hover/addcover:text-amber-950 flex items-center justify-center shadow-xs transition-transform group-hover/addcover:scale-105">
              <Camera className="size-7" />
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="font-circus text-base sm:text-lg text-neutral-900 group-hover/addcover:text-red-700 transition-colors">
                {isEn ? `Add Cover Photo for Milestone ${era.sectionNumber}` : `Thêm Ảnh Bìa cho Cột Mốc ${era.sectionNumber}`}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn 
                  ? "This milestone currently has no cover photo. Click to upload an authentic image from your device or paste an image URL."
                  : "Cột mốc này hiện chưa có ảnh bìa. Bấm vào đây để tải ảnh từ máy tính / điện thoại hoặc dán link URL để tự thiết lập ảnh bìa theo ý muốn."}
              </p>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-2 border border-amber-300 pointer-events-none mt-1"
            >
              <Plus className="size-4" />
              <span>{isEn ? "Upload / Add Cover Photo" : "Tải lên / Thêm ảnh bìa"}</span>
            </button>
          </div>
        )}

        {/* Optional Secondary Photo Gallery if user added extra photos */}
        {photos.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-amber-200/60">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
              <span className="flex items-center gap-1.5 text-amber-900">
                <ImageIcon className="size-3.5 text-amber-700" />
                <span>{isEn ? "Additional Milestone Documents" : "Tư liệu bổ sung khác"} ({photos.length})</span>
              </span>
              <button
                onClick={handleOpenGalleryDialog}
                className="text-amber-800 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3" />
                <span>{isEn ? "Add more" : "Thêm ảnh"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => {
                    circusAudio.playBambooStep();
                    setActiveLightboxPhoto(p);
                  }}
                  className="group relative shrink-0 rounded-xl overflow-hidden border-2 border-amber-200 hover:border-amber-400 w-28 h-20 bg-neutral-900 cursor-pointer shadow-2xs"
                >
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button
                    onClick={(e) => handleDeletePhoto(p.id, e)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isEn ? "Delete photo" : "Xóa ảnh"}
                  >
                    <Trash2 className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Summary Description */}
        <div>
          <p className="text-neutral-800 text-sm sm:text-base leading-relaxed bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200/90 whitespace-pre-line shadow-xs font-normal">
            {isEn ? (era.summaryEn || era.summary) : era.summary}
          </p>
        </div>

        {/* Archival Reference Links (for Contemporary Circus / etc.) */}
        {era.referenceLinks && era.referenceLinks.length > 0 && (
          <div className="bg-amber-100/70 rounded-2xl p-4 border border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-4">
            <div className="flex items-center gap-2">
              <Globe2 className="size-4 text-amber-900 shrink-0" />
              <span className="text-xs font-bold text-amber-950">
                {isEn ? "Archival Reference Links:" : "Nguồn tham khảo tư liệu lịch sử:"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {era.referenceLinks.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-50 text-amber-900 rounded-xl text-xs font-semibold border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{ref.title}</span>
                  <ExternalLink className="size-3 text-amber-700" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Historic Video Embed Card if available */}
        {era.videoUrl && (
          <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg my-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Play className="size-5 fill-white ml-0.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {isEn ? "Historic Video Footage" : "Tư Liệu Video Lịch Sử"}
                </span>
                <h4 className="font-circus text-sm sm:text-base text-amber-200 mt-0.5">
                  {era.videoTitle || (isEn ? "Performance Video" : "Video Trình Diễn Lịch Sử")}
                </h4>
              </div>
            </div>
            <a
              href={era.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => circusAudio.playApplause()}
              className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer border border-amber-300"
            >
              <Play className="size-3.5 fill-white" />
              <span>{isEn ? "Watch on YouTube" : "Xem Trên YouTube"}</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        )}

        {/* SUB-SECTIONS FOR 100 YEARS OF VIETNAMESE CIRCUS (Milestone 4) */}
        {isVietnamCentury && era.subsections && era.subsections.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-amber-200 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-red-700" />
                <h4 className="font-circus text-lg sm:text-xl text-neutral-900">
                  {isEn ? "3 Essential Historical Sub-sections" : "3 Tiểu Mục Lịch Sử Trọng Điểm Của Xiếc Việt"}
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                1910s → 1950s → Nay
              </span>
            </div>

            {/* Sub-sections Tab Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {era.subsections.map((sub) => {
                const isActive = activeSubsectionId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      circusAudio.playBambooStep();
                      setActiveSubsectionId(sub.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isActive
                        ? "bg-red-800 text-white border-red-950 shadow-md font-bold"
                        : "bg-neutral-50 hover:bg-amber-50 text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <span className="text-2xl">{sub.icon}</span>
                    <div className="min-w-0">
                      <span className={`text-[10px] font-black uppercase block ${isActive ? "text-amber-300" : "text-red-700"}`}>
                        {isEn ? sub.tagEn : sub.tag}
                      </span>
                      <div className="text-xs font-bold truncate">
                        {isEn ? sub.titleEn : sub.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Sub-section Exhibition Display */}
            {era.subsections.map((sub) => {
              if (sub.id !== activeSubsectionId) return null;
              return (
                <div
                  key={sub.id}
                  className="bg-gradient-to-br from-amber-50/90 via-white to-red-50/40 rounded-2xl p-5 sm:p-6 border-2 border-red-300 shadow-sm space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{sub.icon}</span>
                      <div>
                        <span className="text-[10px] font-black text-white bg-red-800 px-2 py-0.5 rounded-md uppercase">
                          {isEn ? sub.tagEn : sub.tag}
                        </span>
                        <h5 className="font-circus text-base sm:text-lg text-neutral-900 mt-0.5">
                          {isEn ? sub.titleEn : sub.title}
                        </h5>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900">
                      {isEn ? (sub.periodEn || sub.period) : sub.period}
                    </span>
                  </div>

                  {/* Sub-section Description */}
                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line bg-white/80 p-4 rounded-xl border border-amber-200">
                    {isEn ? (sub.descriptionEn || sub.description) : sub.description}
                  </p>

                  {/* Artistic Quote from Master inside sub-section */}
                  {sub.quote && (
                    <div className="bg-gradient-to-r from-amber-100/90 via-orange-50/70 to-red-50/60 border-l-4 border-red-700 p-4 rounded-r-2xl border-y border-r border-amber-300/80 shadow-xs">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl text-red-700 font-serif leading-none select-none shrink-0 mt-0.5">“</span>
                        <div className="space-y-1.5 flex-1">
                          <p className="text-xs sm:text-sm italic font-medium text-neutral-900 leading-relaxed font-serif">
                            {isEn ? (sub.quoteEn || sub.quote) : sub.quote}
                          </p>
                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <span className="h-px w-6 bg-red-400" />
                            <span className="text-xs font-bold text-red-950">
                              — {isEn ? (sub.quoteAuthorEn || sub.quoteAuthor) : sub.quoteAuthor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-section Content / Highlights */}
                  {sub.structuredSections && sub.structuredSections.length > 0 ? (
                    <div className="space-y-4">
                      {sub.structuredSections.map((sec) => (
                        <div
                          key={sec.number}
                          className="rounded-2xl p-4 sm:p-5 border-2 transition-all bg-white shadow-xs hover:shadow-md border-amber-200 hover:border-amber-400 space-y-3"
                        >
                          {/* Section Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="size-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                                {sec.number}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xl shrink-0">{sec.icon}</span>
                                <h6 className="font-circus text-base sm:text-lg text-neutral-900 leading-snug">
                                  {isEn ? (sec.titleEn || sec.title) : sec.title}
                                </h6>
                              </div>
                            </div>

                            {(sec.categoryBadge || sec.categoryBadgeEn) && (
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 w-fit bg-amber-100 text-amber-900 border border-amber-300">
                                {isEn ? (sec.categoryBadgeEn || sec.categoryBadge) : sec.categoryBadge}
                              </span>
                            )}
                          </div>

                          {/* Section Summary */}
                          {(sec.summary || sec.summaryEn) && (
                            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                              {isEn ? (sec.summaryEn || sec.summary) : sec.summary}
                            </p>
                          )}

                          {/* Section Sub-items (Records / Gold Medal Acts) */}
                          {sec.items && sec.items.length > 0 && (
                            <div className="space-y-2.5 pt-1">
                              {sec.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="rounded-xl p-3 border text-xs transition-colors bg-white/95 border-neutral-200 hover:border-amber-300 space-y-1.5 shadow-2xs"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <span className="font-bold text-neutral-900 text-xs sm:text-sm flex items-center gap-1.5">
                                      <span className="size-2 rounded-full bg-red-600 shrink-0" />
                                      <span>{isEn ? (item.nameEn || item.name) : item.name}</span>
                                    </span>
                                    {(item.badge || item.badgeEn) && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 w-fit">
                                        {isEn ? (item.badgeEn || item.badge) : item.badge}
                                      </span>
                                    )}
                                  </div>

                                  {(item.artists || item.artistsEn) && (
                                    <div className="text-[11px] font-semibold text-red-900 flex items-center gap-1">
                                      <span>★ {isEn ? "Artist / Troupe:" : "Nghệ sĩ / Đơn vị:"}</span>
                                      <span className="text-neutral-800">{isEn ? (item.artistsEn || item.artists) : item.artists}</span>
                                    </div>
                                  )}

                                  <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-neutral-150">
                                    <span className="font-semibold text-neutral-900">
                                      {isEn ? "Achievement & Significance: " : "Thành tích & Dấu ấn: "}
                                    </span>
                                    {isEn ? (item.achievementEn || item.achievement) : item.achievement}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Sub-section Highlights for 4.1 & 4.2 */
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>{isEn ? "Sub-section Highlights" : "Dấu ấn tiểu mục trọng điểm"}</span>
                      </span>
                      <div className="space-y-2">
                        {(isEn && sub.highlightsEn ? sub.highlightsEn : sub.highlights).map((hl, hIdx) => {
                          const isSubHeader = hl.includes("KỶ LỤC") || hl.includes("GIẢI THƯỞNG") || hl.startsWith("•");
                          return (
                            <div
                              key={hIdx}
                              className={`flex items-start gap-2.5 text-xs p-2.5 rounded-xl border ${
                                isSubHeader
                                  ? "bg-amber-100/70 border-amber-300 text-amber-950 font-semibold"
                                  : "bg-white border-neutral-200 text-neutral-800"
                              }`}
                            >
                              <span className="size-4 rounded-full bg-red-700 text-white font-bold flex items-center justify-center shrink-0 text-[9px] mt-0.5">
                                {hIdx + 1}
                              </span>
                              <span className="leading-relaxed whitespace-pre-line">{hl}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Figures / Ensembles for Sub-section */}
                  {sub.figures && sub.figures.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1">
                        <Award className="size-3 text-amber-600" />
                        <span>{isEn ? "Pioneers & Landmark Troupes" : "Nhân vật, Tác phẩm & Tổ chức tiêu biểu"}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isEn && sub.figuresEn ? sub.figuresEn : sub.figures).map((fig, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-100/70 text-red-900 border border-red-200"
                          >
                            ★ {fig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Highlights for Milestones 1, 2, 3 */}
        {!isVietnamCentury && era.highlights && era.highlights.length > 0 && (
          <div className="space-y-3 mt-6 pt-6 border-t-2 border-amber-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>{isEn ? "Key Historical Milestones" : "Nội dung tư liệu & Dấu ấn lịch sử"}</span>
            </h4>
            <div className="space-y-2.5">
              {(isEn && era.highlightsEn ? era.highlightsEn : era.highlights).map((hl, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-neutral-800 p-3 sm:p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-250 hover:bg-neutral-100/70 transition-colors shadow-2xs"
                >
                  <span className="size-5 rounded-full bg-red-700 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Figures & Archival Takeaway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-6 border-t border-amber-200">
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <Award className="size-3.5 text-amber-500" />
              <span>{isEn ? "Pioneers & Representative Figures" : "Nhân vật & Tổ chức đại diện"}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(isEn && era.keyFiguresEn ? era.keyFiguresEn : era.keyFigures).map((fig, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs"
                >
                  ★ {fig}
                </span>
              ))}
            </div>
          </div>

          {(era.quote || era.quoteEn) && (
            <div className="space-y-1.5 flex flex-col justify-end">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <BookmarkCheck className="size-3 text-amber-600" />
                <span>{isEn ? "Archival Takeaway" : "Đúc kết ý nghĩa lịch sử"}</span>
              </h4>
              <blockquote className="border-l-4 border-amber-500 pl-3 py-1.5 italic text-xs text-neutral-700 bg-amber-50/50 rounded-r-xl border border-amber-200">
                "{isEn ? (era.quoteEn || era.quote) : era.quote}"
              </blockquote>
            </div>
          )}
        </div>

        {/* Featured Quotes from Masters (for Era 4) */}
        {era.featuredQuotes && era.featuredQuotes.length > 0 && (
          <div className="pt-6 mt-6 border-t-2 border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Quote className="size-4 text-red-700" />
                <h4 className="font-circus text-sm sm:text-base text-neutral-900">
                  {isEn ? "Words of Inspiration from Circus Masters" : "Tâm Huyết & Lời Nhắn Gửi Từ Các Nghệ Sĩ Lớn"}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-red-800 bg-red-100/70 px-2.5 py-0.5 rounded-full border border-red-200">
                {isEn ? "Artistic Soul" : "Hồn Cốt Xiếc Việt"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {era.featuredQuotes.map((fq, qIdx) => (
                <div
                  key={qIdx}
                  className="rounded-2xl p-4 bg-gradient-to-br from-amber-50/90 via-white to-red-50/40 border border-amber-300/90 shadow-xs flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-2">
                    {fq.context && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-800 bg-red-100/80 px-2.5 py-0.5 rounded-full inline-block border border-red-200">
                        {isEn ? (fq.contextEn || fq.context) : fq.context}
                      </span>
                    )}
                    <p className="text-xs sm:text-sm italic font-medium text-neutral-900 leading-relaxed font-serif pt-1">
                      “{isEn ? (fq.quoteEn || fq.quote) : fq.quote}”
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-amber-200/80 flex items-center justify-between text-xs">
                    <span className="font-black text-red-950">
                      {isEn ? (fq.authorEn || fq.author) : fq.author}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800">
                      ★ {isEn ? "Master of Circus" : "Nghệ sĩ Xiếc Việt Nam"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons: "← Mốc trước" (hidden on Milestone 1), "Về Trang Chủ Lịch Sử", "Mốc sau →" (hidden on Milestone 4) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-amber-200/80">
        {prevPath ? (
          onNavigate ? (
            <button
              type="button"
              onClick={() => {
                circusAudio.playBambooStep();
                onNavigate(prevPath);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-102 cursor-pointer"
            >
              <ArrowLeft className="size-4 text-amber-800" />
              <span>{isEn ? `← Previous (${prevTitle})` : `← Mốc trước: ${prevTitle}`}</span>
            </button>
          ) : (
            <Link
              to={prevPath}
              onClick={() => circusAudio.playBambooStep()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-102 cursor-pointer"
            >
              <ArrowLeft className="size-4 text-amber-800" />
              <span>{isEn ? `← Previous (${prevTitle})` : `← Mốc trước: ${prevTitle}`}</span>
            </Link>
          )
        ) : (
          <div className="hidden sm:block" />
        )}

        {onNavigate ? (
          <button
            type="button"
            onClick={() => {
              circusAudio.playBambooStep();
              onNavigate('/');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>🏠 {isEn ? "Overview of 4 Milestones" : "Về Trang Chủ Lịch Sử"}</span>
          </button>
        ) : (
          <Link
            to="/"
            onClick={() => circusAudio.playBambooStep()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>🏠 {isEn ? "Overview of 4 Milestones" : "Về Trang Chủ Lịch Sử"}</span>
          </Link>
        )}

        {nextPath ? (
          onNavigate ? (
            <button
              type="button"
              onClick={() => {
                circusAudio.playBambooStep();
                onNavigate(nextPath);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer border border-amber-300"
            >
              <span>{isEn ? `Next (${nextTitle}) →` : `Mốc sau: ${nextTitle} →`}</span>
              <ArrowRight className="size-4 text-white" />
            </button>
          ) : (
            <Link
              to={nextPath}
              onClick={() => circusAudio.playBambooStep()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer border border-amber-300"
            >
              <span>{isEn ? `Next (${nextTitle}) →` : `Mốc sau: ${nextTitle} →`}</span>
              <ArrowRight className="size-4 text-white" />
            </Link>
          )
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      {/* Add Photo Dialog */}
      <AddPhotoDialog
        isOpen={isAddPhotoOpen}
        initialEraId={era.id}
        isCoverMode={dialogMode === "cover"}
        customTitle={
          dialogMode === "cover"
            ? (isEn 
                ? `Add Cover Photo for Milestone ${era.sectionNumber}` 
                : `Thêm / Thay Đổi Ảnh Bìa cho Mốc ${era.sectionNumber}`)
            : (isEn ? "Add Historical Photo" : "Thêm Ảnh Tư Liệu Lịch Sử")
        }
        onClose={() => setIsAddPhotoOpen(false)}
        onSavePhoto={handleSavePhoto}
        isEn={isEn}
      />

      {/* Full-screen Lightbox Modal */}
      <PhotoLightboxModal
        photo={activeLightboxPhoto}
        allPhotos={photos}
        onClose={() => setActiveLightboxPhoto(null)}
        onSelectPhoto={(p) => setActiveLightboxPhoto(p)}
        isEn={isEn}
      />
    </div>
  );
};
