import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/context/LanguageContext";
import { circusAudio } from "@/src/utils/audio";
import {
  Rotate3d,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  Download,
  Sparkles,
  Eye,
  RefreshCw,
  X,
  Compass,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface CircusBrochure360Props {
  className?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const CircusBrochure360: React.FC<CircusBrochure360Props> = ({
  className = "",
  onFullscreenChange,
}) => {
  const { isEn } = useLanguage();

  // Rotation angles in degrees
  const [rotY, setRotY] = useState<number>(15);
  const [rotX, setRotX] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxSide, setLightboxSide] = useState<'front' | 'back'>('front');
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  // Drag interaction refs
  const dragStartRef = useRef<{ x: number; y: number; startRotY: number; startRotX: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalize rotation Y to 0..360 for display and side detection
  const normalizedY = ((rotY % 360) + 360) % 360;
  // Facing front when normalized angle is in [0, 90] or [270, 360]
  const isFacingFront = normalizedY <= 90 || normalizedY >= 270;

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Rotate ~20 degrees per second
      setRotY((prev) => (prev + delta * 20) % 36000);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isDragging]);

  // Pointer drag handlers (supports mouse and touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotY: rotY,
      startRotX: rotX,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Sensitivity
    const newRotY = dragStartRef.current.startRotY + dx * 0.6;
    const newRotX = Math.max(-30, Math.min(30, dragStartRef.current.startRotX - dy * 0.4));

    setRotY(newRotY);
    setRotX(newRotX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Quick rotation helpers
  const rotateTo = (targetY: number, targetX: number = 0) => {
    setIsAutoRotating(false);
    circusAudio.playBambooStep();
    setRotX(targetX);
    // Find closest equivalent angle to avoid spinning wildly
    const currentNorm = ((rotY % 360) + 360) % 360;
    let diff = (targetY - currentNorm);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setRotY(rotY + diff);
  };

  const spin360 = () => {
    setIsAutoRotating(false);
    circusAudio.playApplause();
    setRotX(0);
    setRotY((prev) => prev + 360);
  };

  const resetView = () => {
    circusAudio.playBambooStep();
    setIsAutoRotating(false);
    setRotY(0);
    setRotX(0);
    setZoomLevel(1);
  };

  const openLightbox = (side: 'front' | 'back') => {
    circusAudio.playBambooStep();
    setLightboxSide(side);
    setLightboxZoom(1);
    setLightboxOpen(true);
    onFullscreenChange?.(true);
  };

  const closeLightbox = () => {
    circusAudio.playBambooStep();
    setLightboxOpen(false);
    onFullscreenChange?.(false);
  };

  return (
    <div className={`relative w-full rounded-3xl bg-gradient-to-b from-amber-950/80 via-neutral-900/90 to-black/95 p-4 sm:p-6 md:p-8 border-4 border-amber-400 shadow-2xl text-white ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-400/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
            <Rotate3d className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                3D Interactive • 360°
              </span>
              <span className="text-[11px] font-semibold text-amber-200/90">
                {isFacingFront 
                  ? (isEn ? "Viewing: Front Side" : "Đang nhìn: Mặt Trước")
                  : (isEn ? "Viewing: Back Side" : "Đang nhìn: Mặt Sau")
                }
              </span>
            </div>
            <h2 className="font-circus text-xl sm:text-2xl text-amber-300 drop-shadow-sm">
              {isEn ? "360° Interactive Vietnamese Circus Brochure" : "Brochure Xiếc Việt Nam Xoay 360°"}
            </h2>
          </div>
        </div>

        {/* Action buttons on top right */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              circusAudio.playBambooStep();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`text-xs flex items-center gap-1.5 transition-all border ${
              isAutoRotating
                ? "bg-amber-400 text-amber-950 border-amber-300 shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-white border-amber-400/50"
            }`}
            title={isAutoRotating ? (isEn ? "Pause rotation" : "Tạm dừng xoay") : (isEn ? "Auto rotate 360°" : "Tự động xoay 360°")}
          >
            {isAutoRotating ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isAutoRotating ? (isEn ? "Pause" : "Dừng Xoay") : (isEn ? "Auto Rotate" : "Tự Động Xoay")}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => openLightbox(isFacingFront ? 'front' : 'back')}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold border-amber-300 flex items-center gap-1.5 shadow-sm"
            title={isEn ? "Fullscreen / Zoom details" : "Xem toàn màn hình / Phóng to đọc chi tiết"}
          >
            <Maximize2 className="size-3.5" />
            <span>{isEn ? "Zoom Details" : "Phóng To Đọc"}</span>
          </Button>
        </div>
      </div>

      {/* Main 3D Card Stage */}
      <div
        className="relative my-6 select-none overflow-hidden rounded-2xl bg-gradient-radial from-amber-900/30 via-black/60 to-black/90 p-4 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[480px] md:min-h-[560px]"
        style={{ perspective: "1500px" }}
      >
        {/* Subtle decorative background ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="size-[320px] sm:size-[440px] md:size-[560px] rounded-full border border-dashed border-amber-400 animate-[spin_60s_linear_infinite]" />
          <div className="absolute size-[220px] sm:size-[320px] md:size-[420px] rounded-full border border-amber-300/40" />
        </div>

        {/* Drag Hint overlay */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none bg-black/60 backdrop-blur-xs border border-amber-400/40 px-3 py-1 rounded-full text-[11px] text-amber-200 flex items-center gap-1.5 shadow-md">
          <Compass className="size-3.5 text-amber-300 animate-spin" />
          <span>{isEn ? "Drag horizontally or vertically to rotate freely" : "Kéo chuột / vuốt tay để xoay 360° tự do"}</span>
        </div>

        {/* The 3D Rotating Object */}
        <div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `scale(${zoomLevel}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          className="relative w-full max-w-[720px] aspect-[1684/1191] max-h-[500px] touch-none select-none transition-shadow"
        >
          {/* FRONT FACE (rotateY 0deg) */}
          <div
            style={{
              transform: "rotateY(0deg) translateZ(2px)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="absolute inset-0 rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(251,191,36,0.3)] bg-amber-950 flex flex-col"
          >
            <img
              src="/media/brochure_front.png"
              alt="Brochure Mặt Trước - Rạp Xiếc Bỏ Túi"
              className="w-full h-full object-contain bg-neutral-900 pointer-events-none"
              draggable={false}
            />

            {/* Subtle dynamic paper gloss glare based on angle */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                opacity: Math.max(0, Math.cos((rotY * Math.PI) / 180)) * 0.4,
              }}
            />

            {/* Side tag */}
            <div className="absolute bottom-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-amber-300 border border-amber-400/50 text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {isEn ? "FRONT SIDE" : "MẶT TRƯỚC (BÌA NGOÀI)"}
            </div>
          </div>

          {/* BACK FACE (rotateY 180deg) */}
          <div
            style={{
              transform: "rotateY(180deg) translateZ(2px)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="absolute inset-0 rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(251,191,36,0.3)] bg-amber-950 flex flex-col"
          >
            <img
              src="/media/brochure_back.png"
              alt="Brochure Mặt Sau - Rạp Xiếc Bỏ Túi"
              className="w-full h-full object-contain bg-neutral-900 pointer-events-none"
              draggable={false}
            />

            {/* Subtle dynamic glare */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                opacity: Math.max(0, -Math.cos((rotY * Math.PI) / 180)) * 0.4,
              }}
            />

            {/* Side tag */}
            <div className="absolute bottom-2 right-2 z-10 bg-black/75 backdrop-blur-xs text-amber-300 border border-amber-400/50 text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {isEn ? "BACK SIDE" : "MẶT SAU (NỘI DUNG)"}
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel Below Stage */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-amber-400/30">
        {/* Quick Orientation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => rotateTo(0)}
            className={`text-xs flex items-center gap-1.5 transition-all ${
              isFacingFront && Math.abs(rotY % 360) < 45
                ? "bg-amber-400 text-amber-950 font-bold border-amber-300"
                : "bg-white/10 text-white hover:bg-white/20 border-white/20"
            }`}
          >
            <span>📄</span>
            <span>{isEn ? "Front Side (0°)" : "Mặt Trước (0°)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => rotateTo(180)}
            className={`text-xs flex items-center gap-1.5 transition-all ${
              !isFacingFront
                ? "bg-amber-400 text-amber-950 font-bold border-amber-300"
                : "bg-white/10 text-white hover:bg-white/20 border-white/20"
            }`}
          >
            <span>📑</span>
            <span>{isEn ? "Back Side (180°)" : "Mặt Sau (180°)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={spin360}
            className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 flex items-center gap-1.5"
            title={isEn ? "Perform a full 360° spin" : "Xoay một vòng 360° trọn vẹn"}
          >
            <RotateCw className="size-3.5 text-amber-300" />
            <span>{isEn ? "Spin 360°" : "Xoay 360°"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetView}
            className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 flex items-center gap-1.5"
            title={isEn ? "Reset view angle" : "Đặt lại góc nhìn"}
          >
            <RefreshCw className="size-3.5" />
            <span>{isEn ? "Reset" : "Đặt Lại"}</span>
          </Button>
        </div>

        {/* Zoom & Download Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1 hover:bg-white/20 rounded text-amber-200 transition-colors"
              title={isEn ? "Zoom out" : "Thu nhỏ"}
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-amber-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-1 hover:bg-white/20 rounded text-amber-200 transition-colors"
              title={isEn ? "Zoom in" : "Phóng to"}
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          {/* Download Front PNG */}
          <a
            href="/media/brochure_front.png"
            download="Brochure_Xiec_Viet_Nam_Mat_Truoc.png"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all"
            title={isEn ? "Download Front Side PNG" : "Tải Mặt Trước (PNG sắc nét)"}
          >
            <Download className="size-3.5 text-amber-300" />
            <span>{isEn ? "Front PNG" : "Tải Mặt Trước"}</span>
          </a>

          {/* Download Back PNG */}
          <a
            href="/media/brochure_back.png"
            download="Brochure_Xiec_Viet_Nam_Mat_Sau.png"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all"
            title={isEn ? "Download Back Side PNG" : "Tải Mặt Sau (PNG sắc nét)"}
          >
            <Download className="size-3.5 text-amber-300" />
            <span>{isEn ? "Back PNG" : "Tải Mặt Sau"}</span>
          </a>
        </div>
      </div>

      {/* Lightbox / High-Res Reader Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <span className="font-circus text-xl text-amber-300">
                {isEn ? "High-Resolution Brochure Reader" : "Đọc Ấn Phẩm Brochure Sắc Nét"}
              </span>

              {/* Side switch tabs in lightbox */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/20">
                <button
                  onClick={() => {
                    circusAudio.playBambooStep();
                    setLightboxSide('front');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                    lightboxSide === 'front'
                      ? "bg-amber-400 text-amber-950"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {isEn ? "Front Side" : "Mặt Trước"}
                </button>
                <button
                  onClick={() => {
                    circusAudio.playBambooStep();
                    setLightboxSide('back');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                    lightboxSide === 'back'
                      ? "bg-amber-400 text-amber-950"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {isEn ? "Back Side" : "Mặt Sau"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-0.5">
                <button
                  onClick={() => setLightboxZoom((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 hover:bg-white/20 rounded text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-4" />
                </button>
                <span className="text-xs font-mono px-2 text-amber-300">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 hover:bg-white/20 rounded text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="size-4" />
                </button>
              </div>

              <a
                href={lightboxSide === 'front' ? '/media/brochure_front.png' : '/media/brochure_back.png'}
                download={lightboxSide === 'front' ? 'Brochure_Mat_Truoc.png' : 'Brochure_Mat_Sau.png'}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border border-white/20 transition-all"
                title={isEn ? "Download image" : "Tải ảnh về máy"}
              >
                <Download className="size-4" />
              </a>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-all ml-2"
                title={isEn ? "Close" : "Đóng"}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Modal Content / Pan-able image */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div
              style={{
                transform: `scale(${lightboxZoom})`,
                transition: "transform 0.2s ease-out",
              }}
              className="max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-amber-400/30"
            >
              <img
                src={lightboxSide === 'front' ? '/media/brochure_front.png' : '/media/brochure_back.png'}
                alt={lightboxSide === 'front' ? 'Brochure Mặt Trước' : 'Brochure Mặt Sau'}
                className="max-h-[85vh] w-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Modal Footer Tip */}
          <div className="text-center text-xs text-amber-200/70 pt-2 border-t border-white/10 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>
              {isEn
                ? "Tip: Use the zoom controls or download the image to read text and explore details."
                : "Mẹo: Nhấn nút phóng to (+) hoặc tải ảnh về máy để xem rõ từng chi tiết và văn bản của brochure."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
