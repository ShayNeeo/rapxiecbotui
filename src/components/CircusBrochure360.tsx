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
  Compass,
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
              {isEn ? "Interactive 3D Circus Brochure" : "Brochure Xiếc Việt Nam 3D"}
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

        {/* Floating Interactive Tooltip Pill on top */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="bg-black/80 backdrop-blur-xs border border-amber-400/50 px-3 py-1.5 rounded-full text-xs text-amber-200 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="size-3.5 text-amber-300 animate-spin" />
            <span className="font-semibold">
              {foldMode === 'open'
                ? (isEn ? "✨ Click brochure to fold back" : "✨ Click vào brochure để gập lại!")
                : (isEn ? "✨ Click brochure to unfold!" : "✨ Click vào brochure để bung ra!")
              }
            </span>
          </div>

          <div className="hidden sm:flex bg-black/60 backdrop-blur-xs border border-white/20 px-2.5 py-1 rounded-full text-[11px] text-white/70 items-center gap-1.5">
            <Compass className="size-3 text-amber-300" />
            <span>{isEn ? "Drag to rotate 360°" : "Kéo chuột xoay 360° tự do"}</span>
          </div>
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
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5 cursor-pointer"
            title={isEn ? "High-res reader" : "Phóng to đọc nét từng chi tiết"}
          >
            <Maximize2 className="size-3.5 text-amber-300" />
            <span>{isEn ? "Zoom In" : "Phóng To Đọc"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetView}
            className="text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 flex items-center gap-1.5 cursor-pointer"
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
              onClick={() => setZoomLevel((z) => Math.max(0.65, z - 0.15))}
              className="p-1 hover:bg-white/20 rounded text-amber-200 transition-colors cursor-pointer"
              title={isEn ? "Zoom out" : "Thu nhỏ"}
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-amber-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-1 hover:bg-white/20 rounded text-amber-200 transition-colors cursor-pointer"
              title={isEn ? "Zoom in" : "Phóng to"}
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          {/* Download Front PNG */}
          <a
            href="/media/brochure_front.png"
            download="Brochure_Xiec_Viet_Nam_Bia_Ngoai.png"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all cursor-pointer"
            title={isEn ? "Download Outside PNG" : "Tải Bìa Ngoài (PNG)"}
          >
            <Download className="size-3.5 text-amber-300" />
            <span>{isEn ? "Outside PNG" : "Tải Bìa Ngoài"}</span>
          </a>

          {/* Download Back PNG */}
          <a
            href="/media/brochure_back.png"
            download="Brochure_Xiec_Viet_Nam_Ruot_Trong.png"
            onClick={() => circusAudio.playBambooStep()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all cursor-pointer"
            title={isEn ? "Download Inside PNG" : "Tải Ruột Trong (PNG)"}
          >
            <Download className="size-3.5 text-amber-300" />
            <span>{isEn ? "Inside PNG" : "Tải Ruột Trong"}</span>
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
                  onClick={() => setLightboxZoom((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-4" />
                </button>
                <span className="text-xs font-mono px-2 text-amber-300">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="size-4" />
                </button>
              </div>

              <a
                href={lightboxSide === 'outside' ? '/media/brochure_front.png' : '/media/brochure_back.png'}
                download={lightboxSide === 'outside' ? 'Brochure_Bia_Ngoai.png' : 'Brochure_Ruot_Trong.png'}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border border-white/20 transition-all cursor-pointer"
                title={isEn ? "Download image" : "Tải ảnh về máy"}
              >
                <Download className="size-4" />
              </a>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-all ml-2 cursor-pointer"
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
                ? "Tip: Use the zoom controls or download the image to read text and explore details."
                : "Mẹo: Nhấn nút phóng to (+) hoặc tải ảnh về máy để xem rõ từng chi tiết và văn bản của brochure."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
