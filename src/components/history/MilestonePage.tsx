import React, { useEffect, useState } from "react";
import { Icon } from "@/src/components/Icon";
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
import philipAstleyImg from "@/src/assets/images/philip_astley_classical_circus.jpg";

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
                <Icon name={era.imageIcon} />
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
              <span className="text-lg"><Icon name="bi bi-hand-thumbs-up" /></span>
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
              {era.id === "classical-circus" ? (
                <>
                  <img
                    src={milestoneCover}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 size-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                  />
                  <img
                    src={milestoneCover}
                    alt={era.title}
                    className="relative z-10 max-h-full max-w-full object-contain object-center group-hover:scale-102 transition-transform duration-500 drop-shadow-2xl"
                  />
                </>
              ) : (
                <img
                  src={milestoneCover}
                  alt={era.title}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10" />

              {/* Photo Controls on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                  <ImageIcon className="size-3 text-amber-300" />
                  <span>
                    {era.id === "classical-circus"
                      ? (isEn ? "Philip Astley (1742 – 1814)" : "Philip Astley (1742 – 1814)")
                      : (isEn ? (era.titleEn || era.title) : era.title)}
                  </span>
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => {
                      circusAudio.playBambooStep();
                      setActiveLightboxPhoto({
                        id: `cover-${era.id}`,
                        url: milestoneCover,
                        caption: era.id === "classical-circus"
                          ? (isEn 
                              ? "Philip Astley, Esqr. (1742 – 1814) – English equestrian master, Father of Classical Circus" 
                              : "Philip Astley, Esqr. (1742 – 1814) – Kỵ sĩ người Anh, Cha đẻ của Nghệ thuật Xiếc Cổ điển")
                          : (isEn ? (era.titleEn || era.title) : era.title),
                        eraId: era.id,
                      });
                    }}
                    className="p-2 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/30 transition-all cursor-pointer shadow-md"
                    title={isEn ? "View full resolution" : "Xem phóng to toàn màn hình"}
                  >
                    <Maximize2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption & Source Citation on Bottom */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none z-20">
                <div className="space-y-0.5 pointer-events-auto max-w-xl">
                  <p className="text-xs sm:text-sm font-bold drop-shadow-md text-amber-100/95 leading-relaxed">
                    <Icon name="bi bi-camera" />{" "}
                    {era.id === "classical-circus"
                      ? (isEn 
                          ? "Philip Astley, Esqr. (1742 – 1814) – Father of Classical Circus" 
                          : "Philip Astley, Esqr. (1742 – 1814) – Cha đẻ của Nghệ thuật Xiếc Cổ điển")
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
                    href="https://www.alamy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-700 backdrop-blur-md text-amber-200 hover:text-white text-[11px] font-semibold transition-all border border-amber-400/40 hover:border-red-400 shadow-md cursor-pointer pointer-events-auto shrink-0"
                    title={isEn ? "Source: Alamy" : "Nguồn ảnh: Alamy"}
                  >
                    <span>{isEn ? "Source: Alamy" : "Nguồn ảnh: Alamy"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {era.id === "contemporary-circus" && (
                  <a
                    href="https://chinhsachcuocsong.vnanet.vn/nghe-thuat-xiec-qua-goc-nhin-cua-nghe-sy-nhiep-anh-nha-bao-thanh-ha/16876.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-700 backdrop-blur-md text-amber-200 hover:text-white text-[11px] font-semibold transition-all border border-amber-400/40 hover:border-red-400 shadow-md cursor-pointer pointer-events-auto shrink-0"
                    title={isEn ? "Source: TTXVN / Thanh Ha" : "Nguồn ảnh: TTXVN (Thanh Hà)"}
                  >
                    <span>{isEn ? "Source: TTXVN (vnanet.vn)" : "Nguồn ảnh: TTXVN"}</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {era.id === "vietnam-century-circus" && (
                  <a
                    href="https://arttimes.vn/san-khau-dien-anh/ky-niem-100-nam-xiec-viet-nam-ton-vinh-ong-to-cua-nganh-xiec-chuyen-nghiep-c17a18668.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-700 backdrop-blur-md text-amber-200 hover:text-white text-[11px] font-semibold transition-all border border-amber-400/40 hover:border-red-400 shadow-md cursor-pointer pointer-events-auto shrink-0"
                    title={isEn ? "Source: arttimes.vn" : "Nguồn ảnh: arttimes.vn"}
                  >
                    <span>{isEn ? "Source: Arttimes.vn" : "Nguồn ảnh: Arttimes.vn"}</span>
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
                {isEn ? `Milestone ${era.sectionNumber}` : `Cột Mốc ${era.sectionNumber}`}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isEn 
                  ? "This milestone currently has no cover photo. Click to upload an authentic image from your device or paste an image URL."
                  : "Cột mốc này hiện chưa có ảnh tư liệu. Bấm vào đây để tải ảnh từ máy tính / điện thoại hoặc dán link URL để tự thiết lập ảnh theo ý muốn."}
              </p>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-2 border border-amber-300 pointer-events-none mt-1"
            >
              <Plus className="size-4" />
              <span>{isEn ? "Upload Photo" : "Tải lên tư liệu ảnh"}</span>
            </button>
          </div>
        )}



        {/* Milestone Summary Description */}
        <div>
          <p className="text-neutral-800 text-sm sm:text-base leading-relaxed bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200/90 whitespace-pre-line shadow-xs font-normal">
            {isEn ? (era.summaryEn || era.summary) : era.summary}
          </p>
        </div>

        {/* Dedicated Historical Figure Card for Philip Astley (Milestone 2) */}
        {era.id === "classical-circus" && (
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/40 rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 shadow-md my-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Portrait Engraving Box */}
              <div className="w-full md:w-56 shrink-0 flex flex-col items-center gap-3">
                <div 
                  onClick={() => {
                    circusAudio.playBambooStep();
                    setActiveLightboxPhoto({
                      id: "philip-astley-portrait",
                      url: philipAstleyImg,
                      caption: isEn 
                        ? "Philip Astley, Esqr. (1742 – 1814) – English equestrian master, Father of Classical Circus"
                        : "Philip Astley, Esqr. (1742 – 1814) – Kỵ sĩ người Anh, Cha đẻ của Nghệ thuật Xiếc Cổ điển",
                      eraId: "classical-circus"
                    });
                  }}
                  className="relative group/portrait w-full max-w-[220px] aspect-[2/3] rounded-2xl overflow-hidden border-2 border-amber-400 bg-neutral-950 shadow-md cursor-pointer hover:shadow-xl transition-all"
                  title={isEn ? "Click to view full portrait" : "Bấm để xem tranh chân dung phóng to"}
                >
                  <img
                    src={philipAstleyImg}
                    alt="Philip Astley, Esqr. (1742 – 1814)"
                    className="w-full h-full object-cover object-center group-hover/portrait:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover/portrait:opacity-90 transition-opacity" />
                  <div className="absolute bottom-2.5 inset-x-2 flex items-center justify-between text-white text-[11px] font-bold">
                    <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/20">
                      1742 – 1814
                    </span>
                    <span className="size-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs">
                      <Maximize2 className="size-3" />
                    </span>
                  </div>
                </div>

                {/* Citation for portrait */}
                <a
                  href="https://www.alamy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-[11px] font-semibold border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="size-3 text-amber-700" />
                  <span>{isEn ? "Portrait source: Alamy" : "Nguồn tranh: Alamy"}</span>
                </a>
              </div>

              {/* Biography & Historical Impact Content */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-700 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {isEn ? "Father of Modern Circus" : "Cha Đẻ Của Nghệ Thuật Xiếc Cổ Điển"}
                    </span>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-full border border-amber-300">
                      London • 1768
                    </span>
                  </div>
                  <h3 className="font-circus text-xl sm:text-2xl text-neutral-900">
                    Philip Astley, Esqr. (1742 – 1814)
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 font-medium italic">
                    {isEn 
                      ? "British cavalry officer, master horseman, and founder of the modern circus ring."
                      : "Sĩ quan kỵ binh Hoàng gia Anh, bậc thầy huấn luyện tuấn mã và người phát minh ra sàn diễn xiếc tròn."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-red-600" />
                    <span>{isEn ? "Revolutionary Contributions to Circus History:" : "3 Cống hiến mang tính cách mạng cho lịch sử xiếc:"}</span>
                  </h4>

                  {/* 3 Key points */}
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white/90 border border-amber-200/90 shadow-2xs space-y-1">
                      <div className="font-bold text-red-800 flex items-center gap-1.5">
                        <span className="size-4 rounded-full bg-red-700 text-white text-[9px] flex items-center justify-center font-black">1</span>
                        <span>{isEn ? "Standard 13-meter (42 ft) Ring Diameter" : "Vòng tròn diễn tiêu chuẩn 13 mét (42 feet)"}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed pl-5.5">
                        {isEn
                          ? "Astley calculated that riding inside a 13-meter diameter ring harnesses centrifugal force, enabling equestrians to maintain equilibrium while standing upright on galloping steeds—establishing the immortal standard for traditional circus rings."
                          : "Astley tính toán cho ngựa chạy theo vòng tròn đường kính đúng 13 mét để tận dụng lực ly tâm, giúp người cưỡi giữ thăng bằng vững vàng trên lưng ngựa khi phi nước đại. Đây là tiêu chuẩn bất biến của mọi rạp xiếc thế giới suốt hơn 250 năm."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/90 border border-amber-200/90 shadow-2xs space-y-1">
                      <div className="font-bold text-red-800 flex items-center gap-1.5">
                        <span className="size-4 rounded-full bg-red-700 text-white text-[9px] flex items-center justify-center font-black">2</span>
                        <span>{isEn ? "Multi-Act Variety Synthesis (Modern Circus Format)" : "Mô hình nghệ thuật biểu diễn tổng hợp (Xiếc hiện đại)"}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed pl-5.5">
                        {isEn
                          ? "To sustain audience engagement between equestrian demonstrations, Astley innovatively introduced acrobats, jugglers, tightrope walkers, and humorous clown acts, synthesizing ancient individual feats into the comprehensive circus spectacle."
                          : "Để tạo sự đa dạng và duy trì hứng khởi cho khán giả giữa các màn phi ngựa, Astley là người đầu tiên đưa nhào lộn, tung hứng, đi thăng bằng trên dây và hề xiếc (clown) xen kẽ vào chương trình, khai sinh ra diện mạo một buổi trình diễn xiếc hoàn chỉnh."}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/90 border border-amber-200/90 shadow-2xs space-y-1">
                      <div className="font-bold text-red-800 flex items-center gap-1.5">
                        <span className="size-4 rounded-full bg-red-700 text-white text-[9px] flex items-center justify-center font-black">3</span>
                        <span>{isEn ? "First Permanent Covered Circus – Astley's Amphitheatre" : "Rạp xiếc có mái che đầu tiên – Astley's Amphitheatre"}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed pl-5.5">
                        {isEn
                          ? "Constructed near Westminster Bridge in London (1768), followed by Paris (1782), setting the foundation for covered amphitheaters and touring Big Top tent circuses worldwide."
                          : "Được xây dựng bên bờ sông Thames gần Cầu Westminster (London), sau đó mở rộng sang Paris, mở đường cho kỷ nguyên các rạp xiếc mái vòm kiên cố và rạp bạt lưu động (Big Top) trên khắp năm châu."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <span className="text-2xl">{sub.icon ? <Icon name={sub.icon} /> : null}</span>
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

              // Special restructured layout for Subsection 4.3 (or any subsection with structuredSections)
              if (sub.structuredSections && sub.structuredSections.length > 0) {
                return (
                  <div key={sub.id} className="space-y-6 animate-in fade-in duration-200">
                    {/* KHUNG TIỂU MỤC 4.3 - MỤC LỚN PHÍA ĐẦU */}
                    <div className="bg-gradient-to-br from-amber-50/90 via-white to-red-50/40 rounded-3xl p-5 sm:p-7 border-2 border-red-300 shadow-md space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-200/80 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="size-11 rounded-2xl bg-gradient-to-br from-red-700 to-amber-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                            {sub.icon ? <Icon name={sub.icon} /> : "🏆"}
                          </span>
                          <div>
                            <span className="text-[11px] font-black text-white bg-red-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                              {isEn ? sub.tagEn : sub.tag}
                            </span>
                            <h5 className="font-circus text-lg sm:text-2xl text-neutral-900 mt-1">
                              {isEn ? sub.titleEn : sub.title}
                            </h5>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 shrink-0 self-start sm:self-center">
                          {isEn ? (sub.periodEn || sub.period) : sub.period}
                        </span>
                      </div>

                      {/* Sub-section 4.3 Overview Description */}
                      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line bg-white/90 p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-2xs">
                        {isEn ? (sub.descriptionEn || sub.description) : sub.description}
                      </p>
                    </div>

                    {/* TÁCH RIÊNG THÀNH 2 MỤC ĐỘC LẬP: MỤC 1 & MỤC 2 */}
                    <div className="space-y-6">
                      {sub.structuredSections.map((sec) => (
                        <div
                          key={sec.number}
                          className="rounded-3xl p-5 sm:p-7 border-2 transition-all bg-white shadow-md hover:shadow-lg border-amber-300 hover:border-amber-400 space-y-4"
                        >
                          {/* Mục Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-100 pb-4">
                            <div className="flex items-center gap-3">
                              <span className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-sm">
                                {sec.number}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-2xl shrink-0">{sec.icon ? <Icon name={sec.icon} /> : null}</span>
                                <h6 className="font-circus text-lg sm:text-xl text-neutral-900 leading-snug">
                                  {isEn ? `Section ${sec.number}: ` : `Mục ${sec.number}: `}
                                  {isEn ? (sec.titleEn || sec.title) : sec.title}
                                </h6>
                              </div>
                            </div>

                            {(sec.categoryBadge || sec.categoryBadgeEn) && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 w-fit bg-red-50 text-red-800 border border-red-200">
                                {isEn ? (sec.categoryBadgeEn || sec.categoryBadge) : sec.categoryBadge}
                              </span>
                            )}
                          </div>

                          {/* Mục Summary */}
                          {(sec.summary || sec.summaryEn) && (
                            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70">
                              {isEn ? (sec.summaryEn || sec.summary) : sec.summary}
                            </p>
                          )}

                          {/* Danh sách các tác phẩm / Kỷ lục trong từng mục */}
                          {sec.items && sec.items.length > 0 && (
                            <div className="space-y-3 pt-1">
                              {sec.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="rounded-2xl p-4 border text-xs sm:text-sm transition-colors bg-neutral-50/80 hover:bg-white border-neutral-200 hover:border-amber-300 space-y-2 shadow-2xs"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <span className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                                      <span className="size-2 rounded-full bg-red-600 shrink-0" />
                                      <span>{isEn ? (item.nameEn || item.name) : item.name}</span>
                                    </span>
                                    {(item.badge || item.badgeEn) && (
                                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 w-fit">
                                        {isEn ? (item.badgeEn || item.badge) : item.badge}
                                      </span>
                                    )}
                                  </div>

                                  {(item.artists || item.artistsEn) && (
                                    <div className="text-xs font-semibold text-red-900 flex items-center gap-1.5">
                                      <span>★ {isEn ? "Artist / Troupe:" : "Nghệ sĩ / Đơn vị:"}</span>
                                      <span className="text-neutral-800">{isEn ? (item.artistsEn || item.artists) : item.artists}</span>
                                    </div>
                                  )}

                                  <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200/80">
                                    <span className="font-semibold text-neutral-900">
                                      {isEn ? "Achievement & Significance: " : "Thành tích & Dấu ấn: "}
                                    </span>
                                    {isEn ? (item.achievementEn || item.achievement) : item.achievement}
                                  </p>

                                  {/* Illustration Photos (Multiple or Single) */}
                                  {item.images && item.images.length > 0 ? (
                                    <div className="pt-2 space-y-3">
                                      <div className={`grid gap-3.5 ${
                                        item.images.length === 2 
                                          ? "grid-cols-1 sm:grid-cols-2" 
                                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                      }`}>
                                        {item.images.map((img, imgIdx) => (
                                          <div
                                            key={imgIdx}
                                            className="rounded-2xl border-2 border-amber-300/80 bg-neutral-900/95 overflow-hidden flex flex-col justify-between shadow-md hover:border-amber-400 transition-all group/subimg"
                                          >
                                            <div
                                              onClick={() => {
                                                circusAudio.playBambooStep();
                                                setActiveLightboxPhoto({
                                                  id: `sub3-item-${item.name}-${imgIdx}`,
                                                  url: img.url,
                                                  caption: isEn ? (img.captionEn || img.caption || item.nameEn || item.name) : (img.caption || item.name),
                                                  eraId: era.id,
                                                });
                                              }}
                                              className="relative overflow-hidden cursor-pointer aspect-[16/10] bg-neutral-950 flex items-center justify-center"
                                              title={isEn ? "Click to view full screen" : "Bấm để xem phóng to toàn màn hình"}
                                            >
                                              <img
                                                src={img.url}
                                                alt={isEn ? (img.captionEn || img.caption || "") : (img.caption || "")}
                                                className="w-full h-full object-cover group-hover/subimg:scale-103 transition-transform duration-500"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-50 group-hover/subimg:opacity-80 transition-opacity pointer-events-none" />

                                              {/* Badge on top */}
                                              {img.badge && (
                                                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                                                  <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                                                    {isEn ? (img.badgeEn || img.badge) : img.badge}
                                                  </span>
                                                </div>
                                              )}

                                              {/* Zoom icon on bottom right */}
                                              <div className="absolute bottom-2.5 right-2.5 size-7 rounded-xl bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md z-10 pointer-events-none">
                                                <Maximize2 className="size-3.5" />
                                              </div>
                                            </div>

                                            {/* Caption & Source Area */}
                                            <div className="p-3 bg-neutral-900/90 text-neutral-200 text-xs space-y-2 border-t border-white/10 flex-1 flex flex-col justify-between">
                                              <p className="italic text-neutral-300 leading-relaxed text-[11px] sm:text-xs">
                                                {isEn ? (img.captionEn || img.caption) : img.caption}
                                              </p>

                                              {img.sourceUrl ? (
                                                <div className="flex items-center justify-end pt-1">
                                                  <a
                                                    href={img.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 hover:text-red-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95"
                                                    title={isEn ? "Open source link" : "Mở nguồn ảnh bài báo"}
                                                  >
                                                    <ExternalLink className="size-3 text-red-600" />
                                                    <span>
                                                      {isEn
                                                        ? `Source: ${img.sourceNameEn || img.sourceName || "Article"}`
                                                        : `Nguồn ảnh: ${img.sourceName || "Bài báo"}`}
                                                    </span>
                                                  </a>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-end pt-1">
                                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-xl shadow-2xs">
                                                    <Sparkles className="size-3 text-emerald-400" />
                                                    <span>{isEn ? "Research Team Fieldwork Photo" : "Ảnh điền dã của nhóm nghiên cứu"}</span>
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : item.imageUrl ? (
                                    <div className="pt-2 space-y-2">
                                      <div
                                        onClick={() => {
                                          circusAudio.playBambooStep();
                                          setActiveLightboxPhoto({
                                            id: `sub3-item-${item.name}`,
                                            url: item.imageUrl!,
                                            caption: isEn ? (item.imageCaptionEn || item.imageCaption || item.nameEn || item.name) : (item.imageCaption || item.name),
                                            eraId: era.id,
                                          });
                                        }}
                                        className="relative rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md group bg-neutral-900 flex flex-col items-center cursor-pointer"
                                        title={isEn ? "Click to view full screen" : "Bấm để xem phóng to"}
                                      >
                                        <img
                                          src={item.imageUrl}
                                          alt={isEn ? (item.imageCaptionEn || item.nameEn || item.name) : (item.imageCaption || item.name)}
                                          className="w-full max-h-[460px] object-contain object-center group-hover:scale-[1.01] transition-transform duration-300"
                                        />
                                        {(item.imageCaption || item.imageCaptionEn) && (
                                          <div className="w-full bg-neutral-900/90 text-neutral-200 text-xs px-3.5 py-2 text-center italic border-t border-white/10">
                                            {isEn ? (item.imageCaptionEn || item.imageCaption) : item.imageCaption}
                                          </div>
                                        )}
                                      </div>

                                      {item.sourceUrl && (
                                        <div className="flex items-center justify-end">
                                          <a
                                            href={item.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 hover:text-red-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95"
                                            title={isEn ? "Open source link" : "Mở nguồn ảnh bài báo"}
                                          >
                                            <ExternalLink className="size-3 text-red-600" />
                                            <span>
                                              {isEn
                                                ? `Source: ${item.sourceNameEn || item.sourceName || "Article"}`
                                                : `Nguồn ảnh: ${item.sourceName || "Bài báo"}`}
                                            </span>
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Standard layout for Subsection 4.1 & 4.2
              return (
                <div
                  key={sub.id}
                  className="bg-gradient-to-br from-amber-50/90 via-white to-red-50/40 rounded-2xl p-5 sm:p-6 border-2 border-red-300 shadow-sm space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{sub.icon ? <Icon name={sub.icon} /> : null}</span>
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

                  {/* Sub-section Highlights for 4.1 & 4.2 */}
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

          {/* Archival Takeaway */}
          {(era.quote || era.quoteEn) && (
            <div className="space-y-1.5 pt-6 mt-6 border-t border-amber-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <BookmarkCheck className="size-3 text-amber-600" />
                <span>{isEn ? "Archival Takeaway" : "Đúc kết ý nghĩa lịch sử"}</span>
              </h4>
              <blockquote className="border-l-4 border-amber-500 pl-3 py-1.5 italic text-xs text-neutral-700 bg-amber-50/50 rounded-r-xl border border-amber-200">
                "{isEn ? (era.quoteEn || era.quote) : era.quote}"
              </blockquote>
            </div>
          )}

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
                ? `Milestone ${era.sectionNumber}` 
                : `Tư Liệu Cột Mốc ${era.sectionNumber}`)
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
