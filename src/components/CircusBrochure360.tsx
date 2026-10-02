import React, { useState, useRef, useEffect } from "react";
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
  RefreshCw,
  X,
  BookOpen,
  FolderClosed,
  Sparkles,
  Layers
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

  // Folding modes:
  // - 'folded': fully folded booklet (clean Z-fold, cover on front, back on back)
  // - 'half': 3D alternating accordion / Z-fold standing perspective
  // - 'open': completely unfolded flat spread
  const [foldMode, setFoldMode] = useState<'folded' | 'half' | 'open'>('folded');

  // 3D scene rotation angles in degrees
  const [rotY, setRotY] = useState<number>(0);
  const [rotX, setRotX] = useState<number>(8);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const zoomLevelRef = useRef<number>(1);
  zoomLevelRef.current = zoomLevel;

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Lightbox for high-resolution reading
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxSide, setLightboxSide] = useState<'inside' | 'outside'>('inside');
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  // Interaction tracking refs
  const dragStartRef = useRef<{
    x: number;
    y: number;
    startRotY: number;
    startRotX: number;
    startTime: number;
  } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Zoom on wheel (mouse scroll directly on the brochure stage)
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoomLevel((prev) => Math.min(2.5, Math.max(0.6, Number((prev + delta).toFixed(2)))));
    };

    stageEl.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      stageEl.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Pinch-to-zoom on touch devices
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    let initialDist: number | null = null;
    let initialZoom = 1;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (initialDist === null) {
          initialDist = dist;
          initialZoom = zoomLevelRef.current;
        } else {
          const factor = dist / initialDist;
          const newZoom = Math.min(2.5, Math.max(0.6, Number((initialZoom * factor).toFixed(2))));
          setZoomLevel(newZoom);
        }
      }
    };

    const onTouchEnd = () => {
      initialDist = null;
    };

    stageEl.addEventListener('touchmove', onTouchMove, { passive: false });
    stageEl.addEventListener('touchend', onTouchEnd);
    return () => {
      stageEl.removeEventListener('touchmove', onTouchMove);
      stageEl.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Rotate ~15 degrees per second
      setRotY((prev) => (prev + delta * 15) % 36000);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isDragging]);

  // Pointer drag and click handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotY: rotY,
      startRotX: rotX,
      startTime: performance.now(),
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Rotate scene
    const newRotY = dragStartRef.current.startRotY + dx * 0.55;
    const newRotX = Math.max(-35, Math.min(35, dragStartRef.current.startRotX - dy * 0.35));

    setRotY(newRotY);
    setRotX(newRotX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging && dragStartRef.current) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      const dt = performance.now() - dragStartRef.current.startTime;

      // Click detection: small travel distance and short duration
      if (dx < 8 && dy < 8 && dt < 400) {
        toggleFold();
      }

      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Toggle fold / unfold on click
  const toggleFold = () => {
    circusAudio.playBambooStep();
    if (foldMode === 'folded') {
      setFoldMode('open');
    } else {
      setFoldMode('folded');
    }
  };

  const setFoldingMode = (mode: 'folded' | 'half' | 'open') => {
    circusAudio.playBambooStep();
    setFoldMode(mode);
  };

  const resetView = () => {
    circusAudio.playBambooStep();
    setIsAutoRotating(false);
    setRotY(0);
    setRotX(8);
    setZoomLevel(1);
    setFoldMode('folded');
  };

  const spin360 = () => {
    setIsAutoRotating(false);
    circusAudio.playApplause();
    setRotX(8);
    setRotY((prev) => prev + 360);
  };

  const openLightbox = (side: 'inside' | 'outside') => {
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

  // Tải trọn bộ brochure: tự động tải cả 2 mặt (Mặt Ngoài + Mặt Trong) trong một lần bấm
  const handleDownloadBoth = async () => {
    circusAudio.playBambooStep();
    setIsDownloading(true);
    try {
      // 1. Tải Mặt Ngoài (Front / Outside Cover)
      const linkFront = document.createElement('a');
      linkFront.href = '/media/brochure_front.png';
      linkFront.download = 'Brochure_Xiec_Viet_Nam_Mat_Ngoai.png';
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // Khoảng nghỉ 400ms để trình duyệt tải tệp thứ hai mà không bị chặn đa luồng
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 2. Tải Mặt Trong (Back / Inside Spread)
      const linkBack = document.createElement('a');
      linkBack.href = '/media/brochure_back.png';
      linkBack.download = 'Brochure_Xiec_Viet_Nam_Mat_Trong.png';
      document.body.appendChild(linkBack);
      linkBack.click();
      document.body.removeChild(linkBack);
    } catch (err) {
      console.error('Lỗi khi tải brochure:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  // =========================================================================
  // ALTERNATING Z-FOLD (Nếp gấp xen kẽ):
  // - Left panel folds BACKWARD (-Z) behind center panel:
  //     open: 0deg, half: 55deg, folded: 176deg (with translateZ: -4px)
  // - Right panel folds FORWARD (+Z) in front of center panel:
  //     open: 0deg, half: -55deg, folded: -176deg (with translateZ: +4px)
  //
  // Result:
  // 1. One flap is in front (+4px), one is in the back (-4px), center is in between (0px).
  // 2. ZERO overlapping / ZERO Z-fighting / ZERO clipping!
  // 3. Front cover "RẠP XIẾC BỎ TÚI" is crystal-clear on front!
  // =========================================================================
  let angleLeft = 0;
  let angleRight = 0;
  let offsetLeftZ = 0;
  let offsetRightZ = 0;

  if (foldMode === 'folded') {
    angleLeft = 177;
    angleRight = -177;
    offsetLeftZ = -6;
    offsetRightZ = 6;
  } else if (foldMode === 'half') {
    angleLeft = 55;
    angleRight = -55;
    offsetLeftZ = -2;
    offsetRightZ = 2;
  } else {
    angleLeft = 0;
    angleRight = 0;
    offsetLeftZ = 0;
    offsetRightZ = 0;
  }

  return (
    <div className={`relative w-full rounded-3xl bg-gradient-to-b from-amber-950/85 via-neutral-900/95 to-black/95 p-4 sm:p-6 md:p-8 border-4 border-amber-400 shadow-2xl text-white ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-400/40">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
            <Rotate3d className="size-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-circus text-xl sm:text-2xl text-amber-300 drop-shadow-sm">
              {isEn ? "Vietnam Circus Promotional Brochure" : "Brochure quảng bá xiếc Việt Nam"}
            </h2>
          </div>
        </div>
      </div>

      {/* Main 3D Card Stage with Perspective */}
      <div
        ref={stageRef}
        className="relative my-6 select-none overflow-hidden rounded-2xl bg-gradient-radial from-amber-900/30 via-black/70 to-black/95 p-4 sm:p-8 flex items-center justify-center min-h-[420px] sm:min-h-[500px] md:min-h-[580px]"
        style={{ perspective: "1700px" }}
      >
        {/* Subtle decorative background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="size-[340px] sm:size-[460px] md:size-[580px] rounded-full border border-dashed border-amber-400 animate-[spin_80s_linear_infinite]" />
          <div className="absolute size-[240px] sm:size-[340px] md:size-[440px] rounded-full border border-amber-300/40" />
        </div>

        {/* Floating Interactive Tooltip Pill on top left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-xs border border-amber-400/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs text-amber-200 flex items-center gap-1 sm:gap-1.5 shadow-lg">
            <Sparkles className="size-3 sm:size-3.5 text-amber-300 animate-spin" />
            <span className="font-semibold whitespace-nowrap">
              <span className="sm:hidden">
                {foldMode === 'open'
                  ? (isEn ? "✨ Chạm để gập" : "✨ Chạm để gập")
                  : (isEn ? "✨ Chạm để mở" : "✨ Chạm để mở")
                }
              </span>
              <span className="hidden sm:inline">
                {foldMode === 'open'
                  ? (isEn ? "✨ Click brochure to fold back" : "✨ Click vào brochure để gập lại!")
                  : (isEn ? "✨ Click brochure to unfold!" : "✨ Click vào brochure để bung ra!")
                }
              </span>
            </span>
          </div>
        </div>

        {/* Floating Zoom & Detail Viewer Controls directly on the 3D Stage (top right) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex items-center gap-0.5 sm:gap-1 bg-black/85 backdrop-blur-md border border-amber-400/50 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, Number((z - 0.2).toFixed(2))))}
            className="p-1 sm:p-1.5 hover:bg-white/20 rounded-md sm:rounded-lg text-amber-200 hover:text-white transition-colors cursor-pointer"
            title={isEn ? "Zoom out" : "Thu nhỏ"}
          >
            <ZoomOut className="size-3 sm:size-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="text-[10px] sm:text-xs font-mono px-1 sm:px-2 py-0.5 rounded hover:bg-white/10 text-amber-300 font-bold cursor-pointer min-w-[32px] sm:min-w-[40px] text-center"
            title={isEn ? "Reset zoom (100%)" : "Đặt lại độ phóng to (100%)"}
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.2).toFixed(2))))}
            className="p-1 sm:p-1.5 hover:bg-white/20 rounded-md sm:rounded-lg text-amber-200 hover:text-white transition-colors cursor-pointer"
            title={isEn ? "Zoom in" : "Phóng to"}
          >
            <ZoomIn className="size-3 sm:size-4" />
          </button>
          <div className="w-[1px] h-3.5 sm:h-4 bg-white/20 mx-0.5 sm:mx-1" />
          <button
            onClick={() => openLightbox('inside')}
            className="p-1 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-amber-400/25 hover:bg-amber-400/35 text-amber-300 hover:text-amber-100 text-[10px] sm:text-xs font-semibold flex items-center gap-1 cursor-pointer border border-amber-400/40 transition-all shadow-sm"
            title={isEn ? "Open full-screen high-resolution zoom mode" : "Chế độ phóng to đọc chi tiết toàn màn hình"}
          >
            <Maximize2 className="size-3 sm:size-3.5" />
            <span className="hidden sm:inline">{isEn ? "Zoom Mode" : "Chế độ phóng to"}</span>
          </button>
        </div>

        {/* 3D TRI-FOLD BROCHURE OBJECT */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `scale(${zoomLevel}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: isDragging ? "grabbing" : "pointer",
          }}
          className="relative w-full max-w-[750px] aspect-[1684/1190] touch-none select-none"
        >
          {/* ========================================================
              CENTER PANEL (Base / Spine) - width 33.3333%, left 33.3333%
              Inside Face: back_panel_1.png (Chatbot AI & 3D Model)
              Outside Face: front_panel_1.png (Lịch sử & Tổng quan)
             ======================================================== */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "33.3333%",
              width: "33.3334%",
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
            }}
            className="rounded-sm shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
          >
            {/* Center Inside Face (Facing +Z at rest) */}
            <div
              style={{
                transform: "rotateY(0deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                opacity: foldMode === 'folded' ? 0 : 1,
                transition: "opacity 0.35s ease",
              }}
              className="absolute inset-0 border-t-2 border-b-2 border-amber-300/40 bg-neutral-900 rounded-sm"
            >
              <img
                src="/media/back_panel_1.png"
                alt="Brochure Center Inside"
                className="w-full h-full object-cover rounded-sm pointer-events-none select-none block"
                draggable={false}
              />
              {/* Dynamic contact shadow from folding front flap */}
              <div
                className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-r from-black/20 via-transparent to-black/50 transition-opacity duration-700"
                style={{ opacity: foldMode === 'open' ? 0.05 : 0.4 }}
              />
            </div>

            {/* Center Outside Face (Facing -Z at rest) */}
            <div
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="absolute inset-0 border-t-2 border-b-2 border-amber-300/40 bg-neutral-900 rounded-sm"
            >
              <img
                src="/media/front_panel_1.png"
                alt="Brochure Center Outside"
                className="w-full h-full object-cover rounded-sm pointer-events-none select-none block"
                draggable={false}
              />
              {/* Dynamic contact shadow from folding back flap */}
              <div
                className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-l from-black/20 via-transparent to-black/50 transition-opacity duration-700"
                style={{ opacity: foldMode === 'open' ? 0.05 : 0.4 }}
              />
            </div>

            {/* Left Crease Line (Nếp gấp xen kẽ trái - Accordion ridge) */}
            <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-r from-black/60 via-amber-900/40 to-white/30 z-20 pointer-events-none shadow-[0_0_4px_rgba(0,0,0,0.7)]" />

            {/* Right Crease Line (Nếp gấp xen kẽ phải - Accordion ridge) */}
            <div className="absolute top-0 bottom-0 right-0 w-[3px] bg-gradient-to-r from-white/30 via-amber-900/40 to-black/60 z-20 pointer-events-none shadow-[0_0_4px_rgba(0,0,0,0.7)]" />

            {/* ========================================================
                LEFT PANEL (Flap trái) - width 100% of panel, left -100%
                Hinged at its right edge: transform-origin: 100% 50%
                Folds BACKWARD behind center panel (rotateY: 0deg -> 177deg)
                Inside Face: back_panel_0.png
                Outside Face: front_panel_0.png (Chúng mình là ai?)
               ======================================================== */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "-100%",
                width: "100%",
                transformOrigin: "100% 50%",
                transform: `rotateY(${angleLeft}deg) translateZ(${offsetLeftZ}px)`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)",
                zIndex: 5,
              }}
              className="rounded-l-sm shadow-2xl"
            >
              {/* Left Inside Face (facing +Z when flat, hidden when folded) */}
              <div
                style={{
                  transform: "rotateY(0deg) translateZ(1px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  opacity: foldMode === 'folded' ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }}
                className="absolute inset-0 border-t-2 border-b-2 border-l-2 border-amber-300/40 bg-neutral-900 rounded-l-sm"
              >
                <img
                  src="/media/back_panel_0.png"
                  alt="Brochure Left Inside"
                  className="w-full h-full object-cover rounded-l-sm pointer-events-none select-none block"
                  draggable={false}
                />
              </div>

              {/* Left Outside Face (facing -Z when flat, facing -Z when folded behind!) */}
              <div
                style={{
                  transform: "rotateY(180deg) translateZ(1.5px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="absolute inset-0 border-t-2 border-b-2 border-l-2 border-amber-300/40 bg-neutral-900 rounded-l-sm shadow-xl"
              >
                <img
                  src="/media/front_panel_0.png"
                  alt="Brochure Left Outside"
                  className="w-full h-full object-cover rounded-l-sm pointer-events-none select-none block"
                  draggable={false}
                />
              </div>
            </div>

            {/* ========================================================
                RIGHT PANEL (Flap phải / Cover) - width 100% of panel, left 100%
                Hinged at its left edge: transform-origin: 0% 50%
                Folds FORWARD in front of center panel (rotateY: 0deg -> -177deg)
                Inside Face: back_panel_2.png
                Outside Face: front_panel_2.png (Front Cover "RẠP XIẾC BỎ TÚI")
               ======================================================== */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "100%",
                width: "100%",
                transformOrigin: "0% 50%",
                transform: `rotateY(${angleRight}deg) translateZ(${offsetRightZ}px)`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)",
                zIndex: 25,
              }}
              className="rounded-r-sm shadow-2xl"
            >
              {/* Right Inside Face (facing +Z when flat, hidden when folded) */}
              <div
                style={{
                  transform: "rotateY(0deg) translateZ(1px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  opacity: foldMode === 'folded' ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }}
                className="absolute inset-0 border-t-2 border-b-2 border-r-2 border-amber-300/40 bg-neutral-900 rounded-r-sm"
              >
                <img
                  src="/media/back_panel_2.png"
                  alt="Brochure Right Inside"
                  className="w-full h-full object-cover rounded-r-sm pointer-events-none select-none block"
                  draggable={false}
                />
              </div>

              {/* Right Outside Face (FRONT COVER: facing -Z when flat, facing +Z when folded forward!) */}
              <div
                style={{
                  transform: "rotateY(180deg) translateZ(2px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="absolute inset-0 border-t-2 border-b-2 border-r-2 border-amber-300/80 bg-neutral-900 rounded-r-sm shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              >
                <img
                  src="/media/front_panel_2.png"
                  alt="Brochure Front Cover"
                  className="w-full h-full object-cover rounded-r-sm pointer-events-none select-none block"
                  draggable={false}
                />
                {/* Subtle paper gloss glare on cover */}
                <div className="absolute inset-0 pointer-events-none rounded-r-sm bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel Below Stage */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-amber-400/30">
        {/* Folding Modes Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFoldingMode('folded')}
            className={`text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              foldMode === 'folded'
                ? "bg-amber-400 text-amber-950 font-bold border-amber-300 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20 border-white/20"
            }`}
          >
            <FolderClosed className="size-3.5" />
            <span>{isEn ? "Folded (Booklet)" : "Gập Gọn (Bìa)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setFoldingMode('half')}
            className={`text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              foldMode === 'half'
                ? "bg-amber-400 text-amber-950 font-bold border-amber-300 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20 border-white/20"
            }`}
            title={isEn ? "3D Z-Fold perspective" : "Góc nhìn Z-Fold 3D"}
          >
            <Layers className="size-3.5 text-amber-300" />
            <span>{isEn ? "Z-Fold (3D)" : "Gập Nửa (3D)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setFoldingMode('open')}
            className={`text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              foldMode === 'open'
                ? "bg-amber-400 text-amber-950 font-bold border-amber-300 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20 border-white/20"
            }`}
          >
            <BookOpen className="size-3.5" />
            <span>{isEn ? "Unfolded (Full)" : "Bung Ra (Mở Hết)"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={spin360}
            className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 flex items-center gap-1.5 cursor-pointer"
            title={isEn ? "Perform a full 360° spin" : "Xoay một vòng 360° trọn vẹn"}
          >
            <RotateCw className="size-3.5 text-amber-300" />
            <span>{isEn ? "Spin 360°" : "Xoay 360°"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              circusAudio.playBambooStep();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
              isAutoRotating
                ? "bg-amber-400 text-amber-950 border-amber-300 shadow-sm font-bold"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            }`}
            title={isAutoRotating ? (isEn ? "Pause rotation" : "Tạm dừng xoay") : (isEn ? "Auto rotate 360°" : "Tự động xoay 360°")}
          >
            {isAutoRotating ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isAutoRotating ? (isEn ? "Pause" : "Dừng Xoay") : (isEn ? "Auto Rotate" : "Tự Động Xoay")}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => openLightbox('inside')}
            className="text-xs bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border-amber-400/40 flex items-center gap-1.5 cursor-pointer font-medium"
            title={isEn ? "Open high-resolution zoom mode" : "Chế độ phóng to đọc nét từng chi tiết"}
          >
            <Maximize2 className="size-3.5 text-amber-300" />
            <span>{isEn ? "Zoom Mode" : "Chế Độ Phóng To"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetView}
            className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 flex items-center gap-1.5 cursor-pointer"
            title={isEn ? "Reset view angle & zoom" : "Đặt lại góc nhìn & kích thước"}
          >
            <RefreshCw className="size-3.5" />
            <span>{isEn ? "Reset" : "Đặt Lại"}</span>
          </Button>
        </div>

        {/* Zoom Controls & Unified Download Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, Number((z - 0.2).toFixed(2))))}
              className="p-1.5 hover:bg-white/20 rounded-lg text-amber-200 transition-colors cursor-pointer"
              title={isEn ? "Zoom out" : "Thu nhỏ brochure"}
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-xs font-mono px-2 text-amber-300 font-bold min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.2).toFixed(2))))}
              className="p-1.5 hover:bg-white/20 rounded-lg text-amber-200 transition-colors cursor-pointer"
              title={isEn ? "Zoom in" : "Phóng to brochure"}
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          {/* Gộp 1 nút tải duy nhất: Tải Brochure (tải cả 2 mặt một lượt luôn) */}
          <Button
            size="sm"
            onClick={handleDownloadBoth}
            disabled={isDownloading}
            className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold px-4 py-2 rounded-xl shadow-lg border border-amber-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            title={isEn ? "Download both outside & inside brochure pages at once" : "Tải trọn bộ brochure (cả 2 mặt ngoài & trong một lượt)"}
          >
            <Download className={`size-4 text-amber-950 ${isDownloading ? "animate-bounce" : ""}`} />
            <span className="font-semibold text-xs sm:text-sm">
              {isDownloading ? (isEn ? "Downloading 2 sides..." : "Đang tải 2 mặt...") : (isEn ? "Download Brochure" : "Tải Brochure")}
            </span>
            <span className="text-[10px] bg-amber-950/20 text-amber-950 font-extrabold px-1.5 py-0.5 rounded-md font-mono tracking-tight">
              {isEn ? "2 Sides" : "2 Mặt"}
            </span>
          </Button>
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
                    setLightboxSide('outside');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                    lightboxSide === 'outside'
                      ? "bg-amber-400 text-amber-950 shadow"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {isEn ? "Outside Spread" : "Bìa Ngoài"}
                </button>
                <button
                  onClick={() => {
                    circusAudio.playBambooStep();
                    setLightboxSide('inside');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                    lightboxSide === 'inside'
                      ? "bg-amber-400 text-amber-950 shadow"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {isEn ? "Inside Spread" : "Ruột Trong"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-0.5">
                <button
                  onClick={() => setLightboxZoom((z) => Math.max(0.6, Number((z - 0.2).toFixed(2))))}
                  className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-4" />
                </button>
                <span className="text-xs font-mono px-2 text-amber-300">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  onClick={() => setLightboxZoom((z) => Math.min(3.0, Number((z + 0.2).toFixed(2))))}
                  className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="size-4" />
                </button>
              </div>

              {/* Nút tải trọn bộ cả 2 mặt ngay trong Modal */}
              <Button
                size="sm"
                onClick={handleDownloadBoth}
                disabled={isDownloading}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow transition-all disabled:opacity-70"
                title={isEn ? "Download complete brochure (both sides at once)" : "Tải brochure (cả 2 mặt cùng lúc)"}
              >
                <Download className={`size-3.5 ${isDownloading ? "animate-bounce" : ""}`} />
                <span>{isDownloading ? (isEn ? "Downloading..." : "Đang tải...") : (isEn ? "Download Brochure" : "Tải Brochure (2 Mặt)")}</span>
              </Button>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-all ml-2 cursor-pointer"
                title={isEn ? "Close" : "Đóng"}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Modal Content / Pan-able image with wheel zoom */}
          <div
            onWheel={(e) => {
              e.stopPropagation();
              const delta = e.deltaY < 0 ? 0.2 : -0.2;
              setLightboxZoom((z) => Math.min(3.0, Math.max(0.6, Number((z + delta).toFixed(2)))));
            }}
            className="flex-1 overflow-auto flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
          >
            <div
              style={{
                transform: `scale(${lightboxZoom})`,
                transition: "transform 0.15s ease-out",
              }}
              className="max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-amber-400/30"
            >
              <img
                src={lightboxSide === 'outside' ? '/media/brochure_front.png' : '/media/brochure_back.png'}
                alt={lightboxSide === 'outside' ? 'Brochure Bìa Ngoài' : 'Brochure Ruột Trong'}
                className="max-h-[85vh] w-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Modal Footer Tip */}
          <div className="text-center text-xs text-amber-200/70 pt-2 border-t border-white/10 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>
              {isEn
                ? "Tip: Use the zoom controls or scroll your mouse wheel to zoom in up to 300% and explore every detail."
                : "Mẹo: Dùng thanh phóng to hoặc cuộn chuột để zoom lên tới 300% và đọc rõ từng chi tiết của brochure."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
