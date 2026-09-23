import React, { useEffect } from "react";
import { HistoryPhoto } from "@/src/lib/historyImages";
import { X, ZoomIn, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoLightboxModalProps {
  photo: HistoryPhoto | null;
  allPhotos?: HistoryPhoto[];
  onClose: () => void;
  onSelectPhoto?: (photo: HistoryPhoto) => void;
  isEn: boolean;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photo,
  allPhotos = [],
  onClose,
  onSelectPhoto,
  isEn,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (allPhotos.length > 1 && onSelectPhoto && photo) {
        const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
        if (e.key === "ArrowLeft" && currentIndex > 0) {
          onSelectPhoto(allPhotos[currentIndex - 1]);
        } else if (e.key === "ArrowRight" && currentIndex < allPhotos.length - 1) {
          onSelectPhoto(allPhotos[currentIndex + 1]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, allPhotos, onClose, onSelectPhoto]);

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center bg-neutral-900 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 text-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs sm:text-sm">
              📷 {isEn ? "Historical Image Viewer" : "Xem Ảnh Tư Liệu Lịch Sử"}
            </span>
            {allPhotos.length > 1 && (
              <span className="text-neutral-400 text-xs bg-neutral-800 px-2.5 py-0.5 rounded-full">
                {currentIndex + 1} / {allPhotos.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={photo.url}
              download="circus-historical-photo.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition-colors"
              title={isEn ? "Open full resolution" : "Mở ảnh gốc"}
            >
              <Download className="size-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Main Image Display Area */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh] bg-neutral-950 p-2 sm:p-4">
          <img
            src={photo.url}
            alt={photo.caption || "Circus history photo"}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-neutral-800"
          />

          {/* Prev button */}
          {allPhotos.length > 1 && onSelectPhoto && currentIndex > 0 && (
            <button
              onClick={() => onSelectPhoto(allPhotos[currentIndex - 1])}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-amber-500 text-white hover:text-neutral-950 border border-neutral-700 transition-all cursor-pointer shadow-xl"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Next button */}
          {allPhotos.length > 1 && onSelectPhoto && currentIndex < allPhotos.length - 1 && (
            <button
              onClick={() => onSelectPhoto(allPhotos[currentIndex + 1])}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-amber-500 text-white hover:text-neutral-950 border border-neutral-700 transition-all cursor-pointer shadow-xl"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>

        {/* Caption Bar */}
        {(photo.caption || photo.captionEn) && (
          <div className="w-full bg-neutral-950 px-6 py-4 border-t border-neutral-800 text-neutral-200 text-xs sm:text-sm text-center">
            <p className="font-medium leading-relaxed max-w-3xl mx-auto">
              {isEn ? (photo.captionEn || photo.caption) : photo.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
