import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Crop, 
  RotateCcw, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2, 
  SlidersHorizontal,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { 
  ImageFramingConfig, 
  DEFAULT_FRAMING, 
  getImageFraming, 
  saveImageFraming, 
  resetImageFraming 
} from '@/src/lib/imageFramingStore';
import { Button } from '@/src/components/ui/button';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageKey: string;
  imageUrl: string;
  imageTitle?: string;
  isEn?: boolean;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageKey,
  imageUrl,
  imageTitle = '',
  isEn = false,
}) => {
  const [config, setConfig] = useState<ImageFramingConfig>(DEFAULT_FRAMING);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number }>({ x: 0, y: 0, startX: 50, startY: 50 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && imageKey) {
      setConfig(getImageFraming(imageKey));
    }
  }, [isOpen, imageKey]);

  if (!isOpen) return null;

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: config.offsetX,
      startY: config.offsetY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Convert pixel delta to percentage of preview container
    const deltaXPercent = (dx / rect.width) * 100;
    const deltaYPercent = (dy / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, dragStartRef.current.startX - deltaXPercent));
    const newY = Math.max(0, Math.min(100, dragStartRef.current.startY - deltaYPercent));

    setConfig(prev => ({
      ...prev,
      offsetX: Math.round(newX),
      offsetY: Math.round(newY),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Handlers for Mobile / iPad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      startX: config.offsetX,
      startY: config.offsetY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1 || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;

    const deltaXPercent = (dx / rect.width) * 100;
    const deltaYPercent = (dy / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, dragStartRef.current.startX - deltaXPercent));
    const newY = Math.max(0, Math.min(100, dragStartRef.current.startY - deltaYPercent));

    setConfig(prev => ({
      ...prev,
      offsetX: Math.round(newX),
      offsetY: Math.round(newY),
    }));
  };

  const handleSave = () => {
    saveImageFraming(imageKey, config);
    onClose();
  };

  const handleReset = () => {
    resetImageFraming(imageKey);
    setConfig(DEFAULT_FRAMING);
  };

  const aspectClass = 
    config.aspectRatio === '16/9' ? 'aspect-video' :
    config.aspectRatio === '4/3' ? 'aspect-[4/3]' :
    config.aspectRatio === '1/1' ? 'aspect-square' : 'aspect-[16/10]';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-neutral-950 text-white rounded-3xl border-2 border-amber-400/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-red-950 via-amber-950 to-neutral-900 border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
              <Crop className="size-4" />
            </div>
            <div>
              <h3 className="font-circus text-sm sm:text-base text-amber-300 font-bold leading-tight">
                {isEn ? "Adjust Image Framing & Cropping" : "Căn Chỉnh Khung & Cắt Xén Hình Ảnh"}
              </h3>
              <p className="text-[11px] text-neutral-300 truncate max-w-xs sm:max-w-md">
                {imageTitle || (isEn ? "Custom framing" : "Tùy chỉnh góc nhìn")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-xl bg-white/10 hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? "Close" : "Đóng"}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body: Live Draggable Preview Box */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Instruction hint */}
          <div className="flex items-center justify-between text-xs text-amber-200/90 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-1.5">
            <span className="flex items-center gap-1.5">
              <Move className="size-3.5 text-amber-400 animate-pulse" />
              <span>{isEn ? "Drag directly on the image below to adjust framing" : "Kéo chuột hoặc ngón tay trực tiếp trên ảnh để căn góc nhìn"}</span>
            </span>
            <span className="font-mono text-[10px] text-amber-300 hidden sm:inline">
              X: {config.offsetX}% · Y: {config.offsetY}% · Zoom: {config.zoom}%
            </span>
          </div>

          {/* Frame Container */}
          <div className="relative mx-auto w-full max-w-lg bg-neutral-900 rounded-2xl overflow-hidden border-2 border-dashed border-amber-400/60 shadow-inner flex items-center justify-center">
            <div 
              ref={previewRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`relative w-full ${aspectClass} overflow-hidden cursor-grab active:cursor-grabbing bg-black select-none touch-none`}
            >
              <img
                src={imageUrl}
                alt="Preview"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: config.fitMode,
                  objectPosition: `${config.offsetX}% ${config.offsetY}%`,
                  transform: `scale(${config.zoom / 100})`,
                  transformOrigin: `${config.offsetX}% ${config.offsetY}%`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out, object-position 0.15s ease-out',
                }}
                className="pointer-events-none select-none"
              />

              {/* Grid Guide Overlay (Rule of Thirds) */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Drag indicator chip */}
              <div className="absolute bottom-2 right-2 pointer-events-none bg-black/70 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded-full border border-white/20 text-neutral-300 flex items-center gap-1">
                <Move className="size-2.5" />
                <span>{isEn ? "Drag to pan" : "Kéo để di chuyển"}</span>
              </div>
            </div>
          </div>

          {/* Interactive Controls Sliders */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3.5 text-xs">
            {/* Zoom / Scale Control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="size-3.5 text-amber-400" />
                  <span>{isEn ? "Zoom / Scale:" : "Phóng to / Thu nhỏ:"}</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">{config.zoom}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfig(p => ({ ...p, zoom: Math.max(50, p.zoom - 5) }))}
                  className="size-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="1"
                  value={config.zoom}
                  onChange={(e) => setConfig(p => ({ ...p, zoom: Number(e.target.value) }))}
                  className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setConfig(p => ({ ...p, zoom: Math.min(200, p.zoom + 5) }))}
                  className="size-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfig(p => ({ ...p, zoom: 100 }))}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-amber-200 shrink-0 cursor-pointer"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Vertical Alignment (Y Position) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3.5 text-amber-400" />
                  <span>{isEn ? "Vertical Position (Up / Down):" : "Vị trí theo chiều dọc (Lên / Xuống):"}</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">{config.offsetY}%</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.offsetY}
                  onChange={(e) => setConfig(p => ({ ...p, offsetY: Number(e.target.value) }))}
                  className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
                {/* Quick Presets */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetY: 0 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetY === 0 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Top" : "Đỉnh (0%)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetY: 50 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetY === 50 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Center" : "Giữa (50%)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetY: 100 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetY === 100 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Bottom" : "Đáy (100%)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Alignment (X Position) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3.5 text-amber-400" />
                  <span>{isEn ? "Horizontal Position (Left / Right):" : "Vị trí theo chiều ngang (Trái / Phải):"}</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">{config.offsetX}%</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.offsetX}
                  onChange={(e) => setConfig(p => ({ ...p, offsetX: Number(e.target.value) }))}
                  className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetX: 0 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetX === 0 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Left" : "Trái"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetX: 50 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetX === 50 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Center" : "Giữa"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, offsetX: 100 }))}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      config.offsetX === 100 ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    {isEn ? "Right" : "Phải"}
                  </button>
                </div>
              </div>
            </div>

            {/* Fit Mode & Aspect Ratio Options */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Fit Mode */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] font-medium">
                  {isEn ? "Fit Mode:" : "Kiểu hiển thị:"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, fitMode: 'cover' }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                      config.fitMode === 'cover'
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-xs'
                        : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isEn ? "Fill (Cover)" : "Lấp đầy khung (Cover)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(p => ({ ...p, fitMode: 'contain' }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                      config.fitMode === 'contain'
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-xs'
                        : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isEn ? "Whole Photo (Contain)" : "Thấy trọn ảnh (Contain)"}
                  </button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] font-medium">
                  {isEn ? "Frame Ratio:" : "Tỉ lệ khung:"}
                </span>
                <div className="flex items-center gap-1">
                  {(['16/10', '16/9', '4/3', '1/1'] as const).map(ratio => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setConfig(p => ({ ...p, aspectRatio: ratio }))}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                        (config.aspectRatio || '16/10') === ratio
                          ? 'bg-red-700 text-white font-bold'
                          : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer border border-white/10"
            title={isEn ? "Reset to default" : "Đặt lại mặc định"}
          >
            <RotateCcw className="size-3.5 text-neutral-400" />
            <span>{isEn ? "Reset Defaults" : "Đặt Lại Mặc Định"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {isEn ? "Cancel" : "Hủy"}
            </button>
            <Button
              type="button"
              variant="carnival"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 cursor-pointer shadow-md"
            >
              <Check className="size-4" />
              <span>{isEn ? "Save & Apply" : "Lưu & Áp Dụng"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
