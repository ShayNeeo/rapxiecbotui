import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { CircusBadge } from "@/src/types";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { 
  ArrowLeft, 
  Share2, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Ticket as TicketIcon,
  Download,
  Mail,
  Copy,
  Check,
  Smartphone,
  X,
  Loader2,
  Share,
  Send,
  Camera,
  RotateCcw
} from "lucide-react";
import { OFFICIAL_CIRCUS_LOGO } from "@/src/lib/logo";
import { CHATBOT_AI_URL, CIRCUS_3D_URL } from "@/src/lib/constants";
import { Link } from "react-router-dom";
import { Facebook } from "@/src/components/icons/Facebook";

interface CircusTicketProps {
  onBack: () => void;
  badges: CircusBadge[];
  onUnlockBadge: (badgeId: string) => void;
  logoUrl?: string;
  onUploadLogo?: (file: File) => void;
  onResetLogo?: () => void;
  onNavigateToAct?: (act: string) => void;
  onOpenMediaArchive?: () => void;
}

export const CircusTicket: React.FC<CircusTicketProps> = ({
  onBack,
  badges,
  onUnlockBadge,
  logoUrl,
  onUploadLogo,
  onResetLogo,
  onNavigateToAct,
  onOpenMediaArchive,
}) => {
  const { isEn } = useLanguage();
  const ticketRef = useRef<HTMLDivElement>(null);
  const ticketLogoInputRef = useRef<HTMLInputElement>(null);

  // Fixed official logo for ticket and export
  const activeLogo = OFFICIAL_CIRCUS_LOGO;
  const isCustomLogo = false;

  const [visitorName, setVisitorName] = useState(() => {
    try {
      const saved = localStorage.getItem("pocket_circus_visitor_name");
      if (saved) return saved;
    } catch {}
    return isEn ? "Circus Art Enthusiast" : "Khán Giả Yêu Xiếc";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(visitorName);
  const [isStamped, setIsStamped] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticketImageUrl, setTicketImageUrl] = useState<string | null>(null);
  const [ticketBlob, setTicketBlob] = useState<Blob | null>(null);
  const [activeModal, setActiveModal] = useState<'save' | 'share' | null>(null);

  const handleBadgeClick = (badge: CircusBadge) => {
    circusAudio.playBambooStep();
    if (badge.id === 'circus-ai-chatbot') {
      onUnlockBadge('circus-ai-chatbot');
      window.open(CHATBOT_AI_URL, '_blank', 'noopener,noreferrer');
    } else if (badge.id === 'circus-3d-explorer') {
      onUnlockBadge('circus-3d-explorer');
      window.location.assign(CIRCUS_3D_URL);
    } else if (badge.id === 'circus-digital-archive') {
      onUnlockBadge('circus-digital-archive');
      if (onOpenMediaArchive) {
        onOpenMediaArchive();
      } else if (onNavigateToAct) {
        onNavigateToAct('archive');
      }
    } else if (badge.id === 'circus-map-explorer') {
      onNavigateToAct?.('map');
    } else if (badge.id === 'circus-quiz-master') {
      onNavigateToAct?.('quiz');
    } else if (badge.id === 'circus-scholar') {
      onNavigateToAct?.('history');
    } else if (badge.id === 'circus-vip') {
      claimVipBadge();
    }
  };

  // Invalidate cached captured ticket whenever logo, name, or settings change
  useEffect(() => {
    setTicketImageUrl((prev) => (prev !== null ? null : prev));
    setTicketBlob((prev) => (prev !== null ? null : prev));
  }, [activeLogo, visitorName, isEn, isStamped]);

  const ticketSerial = "RXBT-2026-VIP-088";
  const currentDate = new Date().toLocaleDateString(isEn ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const captureTicketImage = async (): Promise<{ dataUrl: string; blob: Blob } | null> => {
    if (!ticketRef.current) return null;
    try {
      setIsGenerating(true);
      if (isEditingName) {
        setIsEditingName(false);
      }

      // Ensure fonts are ready in the browser before rasterizing
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // fallback gracefully
        }
      }

      // Ensure all images (including the circus logo) inside ticketRef are loaded and decoded
      const imgs = Array.from(ticketRef.current.querySelectorAll("img"));
      await Promise.all(
        imgs.map(async (img) => {
          if (!img.complete) {
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
          }
          if (img.decode) {
            try {
              await img.decode();
            } catch {
              // ignore decode error
            }
          }
        })
      );

      const node = ticketRef.current;
      const width = node.scrollWidth || node.clientWidth;
      const height = node.scrollHeight || node.clientHeight;

      // Explicitly set skipFonts: true & fontEmbedCSS: '' so html-to-image never
      // attempts to inspect remote stylesheets (e.g. Google Fonts), preventing 'cssRules' security errors.
      // cacheBust is set to false to prevent corrupting data: URLs and local assets.
      const options = {
        width,
        height,
        canvasWidth: width * 2,
        canvasHeight: height * 2,
        quality: 1,
        pixelRatio: 2,
        cacheBust: false,
        skipFonts: true,
        fontEmbedCSS: "",
        backgroundColor: "#FFFDF7",
        filter: (n: Node) => {
          if (n instanceof HTMLElement && (n.classList.contains("no-print") || n.classList.contains("ticket-no-capture"))) {
            return false;
          }
          return true;
        },
      };

      const dataUrl = await toPng(node, options);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      setTicketImageUrl(dataUrl);
      setTicketBlob(blob);
      return { dataUrl, blob };
    } catch (err) {
      console.error("Failed to capture ticket image:", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenSaveModal = async () => {
    circusAudio.playApplause();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActiveModal('save');
    if (!ticketImageUrl) {
      await captureTicketImage();
    }
  };

  const handleOpenShareModal = async () => {
    circusAudio.playMagicChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
    setActiveModal('share');
    if (!ticketImageUrl) {
      await captureTicketImage();
    }
  };

  const downloadBlobToComputer = async (blob: Blob, fileName: string) => {
    // 1. Modern File System Access API on desktop (allows selecting album/folder directly)
    if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "PNG Ticket Image",
              accept: { "image/png": [".png"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (pickerErr: any) {
        if (pickerErr.name === "AbortError") {
          return false; // User closed picker
        }
        // Fallback to blob download
      }
    }

    // 2. Reliable Blob URL download (works universally on macOS Safari, Chrome, Edge)
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = blobUrl;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 2000);
    return true;
  };

  const handleDirectDownloadImage = async () => {
    circusAudio.playApplause();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    try {
      setIsGenerating(true);
      const captured = await captureTicketImage();
      const currentBlob = captured?.blob || ticketBlob;

      if (currentBlob) {
        const fileName = `ve-rap-xiec-bo-tui-${ticketSerial}.png`;
        await downloadBlobToComputer(currentBlob, fileName);
        setActiveModal('save');
      }
    } catch (err) {
      console.error("Error saving ticket image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePhotoDirect = async () => {
    circusAudio.playApplause();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    let currentBlob = ticketBlob;
    if (!currentBlob) {
      const captured = await captureTicketImage();
      if (captured) {
        currentBlob = captured.blob;
      }
    }

    if (currentBlob) {
      const fileName = `ve-rap-xiec-bo-tui-${ticketSerial}.png`;
      const file = new File([currentBlob], fileName, { type: "image/png" });

      // Only trigger native share on touch mobile devices (iOS/Android)
      const isTouchMobile = typeof navigator !== "undefined" && 
        (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && !/Windows|Macintosh/i.test(navigator.userAgent)));

      if (isTouchMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: isEn ? "Pocket Circus Souvenir Ticket" : "Vé Kỷ Niệm Rạp Xiếc Bỏ Túi",
            text: isEn 
              ? "My honorary souvenir ticket to Pocket Circus Vietnam! 🎪✨"
              : "Vé danh dự kỷ niệm tham quan Rạp Xiếc Bỏ Túi Việt Nam! 🎪✨",
          });
          return;
        } catch (shareErr) {
          console.log("Share sheet closed, falling back to direct download", shareErr);
        }
      }

      // Direct file download on computer
      await downloadBlobToComputer(currentBlob, fileName);
    }
  };

  const handleShareToPlatforms = async () => {
    circusAudio.playMagicChime();
    let currentBlob = ticketBlob;
    let currentUrl = ticketImageUrl;
    if (!currentBlob || !currentUrl) {
      const captured = await captureTicketImage();
      if (captured) {
        currentBlob = captured.blob;
        currentUrl = captured.dataUrl;
      }
    }
    if (currentBlob) {
      const fileName = `ve-rap-xiec-bo-tui-${ticketSerial}.png`;
      const file = new File([currentBlob], fileName, { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: isEn ? "Pocket Circus Souvenir Ticket" : "Vé Kỷ Niệm Rạp Xiếc Bỏ Túi",
            text: isEn 
              ? "Check out my commemorative ticket to Pocket Circus Vietnam! 🎪✨"
              : "Khoe vé danh dự Rạp Xiếc Bỏ Túi Việt Nam của tôi nè! 🎪✨",
          });
          return;
        } catch (err) {
          console.log("Native share dismissed", err);
        }
      }
    }
    handleCopyLink();
  };

  const handleDownloadImage = () => {
    if (!ticketImageUrl) return;
    circusAudio.playBambooStep();
    const fileName = `ve-rap-xiec-bo-tui-${ticketSerial}.png`;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = ticketImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!ticketBlob) return;
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [ticketBlob.type]: ticketBlob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.warn("Copy image failed, downloading instead:", err);
      handleDownloadImage();
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn(e);
    }
  };

  const claimVipBadge = () => {
    onUnlockBadge('circus-vip');
    circusAudio.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 pb-12 select-none px-3 sm:px-4">
      {/* Top Controls */}
      <div className="no-print w-full max-w-2xl flex items-center justify-between gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white shadow-xs cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Download Image Button (Instant save .PNG on computer) */}
          <Button
            variant="carnival"
            size="sm"
            onClick={handleDirectDownloadImage}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 shadow-xs cursor-pointer text-xs sm:text-sm font-bold"
            title={isEn ? "Save high-definition ticket image (.PNG) to computer" : "Lưu ảnh vé kỷ niệm chất lượng cao (.PNG) về máy tính"}
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            <span>{isEn ? "Save Ticket (.PNG)" : "Lưu Ảnh Vé (.PNG)"}</span>
          </Button>

          {/* Share Button */}
          <Button
            variant="gold"
            size="sm"
            onClick={handleOpenShareModal}
            className="inline-flex items-center gap-1.5 shadow-xs cursor-pointer text-xs sm:text-sm"
          >
            <Share2 className="size-3.5" />
            <span>{isEn ? 'Share Ticket' : 'Chia Sẻ Vé'}</span>
          </Button>
        </div>
      </div>

      {/* The Souvenir Circus Ticket (Perforated Retro Aesthetic - Exact Match to Reference Image) */}
      <div 
        id="circus-ticket-card"
        ref={ticketRef}
        className="relative w-full max-w-[460px] mx-auto bg-[#FFFDF8] rounded-[28px] p-6 sm:p-7 border-4 border-amber-400 shadow-2xl overflow-hidden ticket-edge-left ticket-edge-right flex flex-col space-y-4 text-neutral-900"
      >
        {/* Background Watermark Tent (Bottom Right, matching reference image) */}
        <div className="absolute -bottom-4 -right-4 opacity-15 pointer-events-none select-none text-8xl">
          🎪
        </div>

        {/* Top Header Ticket Band (Logo on Left, Title & Subtitle on Right) */}
        <div className="w-full flex items-center gap-3.5 sm:gap-4 text-left relative z-10">
          {/* Left: Circus Logo Container (Fixed Official Logo in Square Frame) */}
          <div 
            id="circus-ticket-logo-frame"
            className="size-20 sm:size-22 rounded-2xl border-2 border-amber-400 overflow-hidden bg-white shadow-xs flex items-center justify-center p-1 shrink-0"
            title={isEn ? "Pocket Circus Official Logo" : "Logo Chính Thức Rạp Xiếc Bỏ Túi"}
          >
            <img 
              src={OFFICIAL_CIRCUS_LOGO} 
              alt="Logo Rạp Xiếc Bỏ Túi" 
              className="ticket-main-logo size-full object-contain rounded-xl"
              loading="eager"
              decoding="sync"
            />
          </div>

          {/* Right: Subtitle & Title */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-red-800 truncate">
              {isEn ? "★ Vietnamese Circus • Honorary Pass ★" : "RẠP XIẾC VIỆT NAM • VÉ DANH DỰ"}
            </div>
            <h2 className="font-circus text-2xl sm:text-3xl text-red-900 leading-tight tracking-wide whitespace-nowrap">
              {isEn ? "POCKET CIRCUS" : "RẠP XIẾC BỎ TÚI"}
            </h2>
            <div className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
              {isEn ? "Official Circus Certified" : "Chứng nhận Rạp Xiếc chính thức"}
            </div>
          </div>
        </div>

        {/* Ticket Serial & VIP Tier Badge */}
        <div className="w-full flex flex-col items-center justify-center gap-1 pt-1 relative z-10">
          <div className="font-mono font-bold text-amber-950 bg-amber-200/90 px-4 py-0.5 rounded-full border border-amber-300 text-sm shadow-2xs">
            {ticketSerial}
          </div>
          <div className="text-xs font-semibold text-neutral-700">
            {isEn ? "Tier: SPECIAL VIP" : "Hạng vé: VIP ĐẶC BIỆT"}
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="w-full border-b border-dashed border-amber-300/90 relative z-10" />

        {/* Visitor Name & Info */}
        <div className="w-full flex flex-col text-left space-y-1 relative z-10">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            {isEn ? "HONORARY GUEST" : "KHÁN GIẢ DANH DỰ"}
          </span>
          {!isEditingName ? (
            <div className="flex items-center justify-between gap-3">
              <span className="font-circus text-xl sm:text-2xl text-red-900 tracking-wide font-bold">
                {visitorName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTempName(visitorName);
                  setIsEditingName(true);
                  circusAudio.playBambooStep();
                }}
                className="no-print text-red-900 hover:text-red-700 underline text-xs sm:text-sm font-bold cursor-pointer transition-colors"
                title={isEn ? "Change ticket guest name" : "Đổi tên khán giả trên vé"}
                data-html2canvas-ignore="true"
              >
                {isEn ? "Change name" : "Đổi tên"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = tempName.trim();
                if (trimmed) {
                  setVisitorName(trimmed);
                  try {
                    localStorage.setItem("pocket_circus_visitor_name", trimmed);
                  } catch {}
                  circusAudio.playApplause();
                }
                setIsEditingName(false);
              }}
              className="no-print flex items-center gap-2 pt-0.5"
              data-html2canvas-ignore="true"
            >
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                placeholder={isEn ? "Enter your name..." : "Nhập tên khán giả..."}
                maxLength={32}
                className="flex-1 bg-amber-50/90 border-2 border-amber-400 rounded-lg px-2.5 py-1 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
              <Button
                type="submit"
                variant="carnival"
                size="sm"
                className="text-xs px-2.5 py-1 h-8 font-bold cursor-pointer"
              >
                {isEn ? "Save" : "Lưu"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTempName(visitorName);
                  setIsEditingName(false);
                }}
                className="text-xs px-2 py-1 h-8 cursor-pointer text-neutral-600 hover:bg-neutral-100"
              >
                {isEn ? "Cancel" : "Hủy"}
              </Button>
            </form>
          )}
        </div>

        {/* Seat location & Performance date (2 columns) */}
        <div className="w-full grid grid-cols-2 gap-4 text-left pt-1 relative z-10">
          <div>
            <span className="text-xs text-neutral-500 font-medium block">
              {isEn ? "Seat location:" : "Vị trí chỗ ngồi:"}
            </span>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">
              {isEn ? "Row A • Seat 01 (Center Ring)" : "Hàng A • Ghế Số 01 (Sân Trung Tâm)"}
            </p>
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-medium block">
              {isEn ? "Performance date:" : "Ngày biểu diễn:"}
            </span>
            <p className="font-bold text-neutral-900 text-sm mt-0.5">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Privileges */}
        <div className="w-full flex items-start gap-2 text-left pt-1 text-xs relative z-10">
          <div className="flex items-center gap-1 shrink-0 font-bold text-neutral-800">
            <span className="text-xs">🎟️</span>
            <span>{isEn ? "Privileges:" : "Quyền lợi:"}</span>
          </div>
          <p className="font-medium text-emerald-800 leading-relaxed">
            {isEn ? (
              <>
                Circus history,{" "}
                <Link to={CIRCUS_3D_URL} className="underline hover:text-emerald-950 font-bold">3D circus ↗</Link>,{" "}
                <a href={CHATBOT_AI_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-950 font-bold">chatbot AI ↗</a>, quiz & venues map
              </>
            ) : (
              <>
                Khám phá lịch sử,{" "}
                <Link to={CIRCUS_3D_URL} className="underline hover:text-emerald-950 font-bold">rạp xiếc 3D ↗</Link>,{" "}
                <a href={CHATBOT_AI_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-950 font-bold">chatbot AI ↗</a>, quiz kiến thức & bản đồ rạp xiếc toàn quốc
              </>
            )}
          </p>
        </div>

        {/* Large Golden Yellow Box with Red Wax Stamp */}
        <div className="w-full bg-[#FEF3C7]/70 rounded-2xl p-4 sm:p-5 border border-amber-300 flex flex-col items-center justify-center my-1 relative shadow-2xs z-10">
          <div className="size-20 sm:size-22 rounded-full border-4 border-red-700 bg-red-700 text-yellow-300 flex flex-col items-center justify-center shadow-lg transform rotate-[-4deg] hover:rotate-0 transition-transform">
            <span className="text-base">★</span>
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
              {isEn ? (
                <>POCKET<br/>CIRCUS<br/>CERTIFIED</>
              ) : (
                <>RẠP XIẾC<br/>BỎ TÚI<br/>CHỨNG NHẬN</>
              )}
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider mt-2">
            {isEn ? "Official Wax Seal" : "DẤU MỘC CHÍNH THỨC"}
          </span>
        </div>

        {/* Dashed Separator */}
        <div className="w-full border-b border-dashed border-amber-300/90 relative z-10" />

        {/* Ticket Perforated Barcode Footer */}
        <div className="w-full flex flex-col items-center justify-center gap-1.5 text-center pt-1 pb-1 relative z-10">
          <div className="font-mono tracking-widest text-xs text-neutral-700">
            ||| | |||| || ||| |||| | || ||||| |
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-600">
            {isEn ? "Thank you for accompanying Pocket Circus Vietnam!" : "Cảm ơn quý khán giả đã đồng hành cùng Rạp Xiếc Bỏ Túi Việt Nam!"}
          </p>
        </div>
      </div>

      {/* Collector Badges Section - Renamed to 'Bộ sưu tập huy hiệu khán giả yêu xiếc' */}
      <div className="no-print collector-badges-container w-full max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-circus text-xl sm:text-2xl text-neutral-900 flex items-center gap-2">
              <Award className="size-6 text-amber-500" />
              <span>{isEn ? "CIRCUS-LOVING AUDIENCE BADGE COLLECTION" : "BỘ SƯU TẬP HUY HIỆU KHÁN GIẢ YÊU XIẾC"}</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {isEn
                ? "Explore web features: AI Chatbot, 3D Circus Arena, Venues Map, 20 Quizzes, and Digital Archive to unlock badges!"
                : "Khám phá các tính năng trên web: Chatbot AI, Rạp Xiếc 3D, Bản Đồ Di Sản, 20 Câu Quiz và Kho Tư Liệu Số để nhận trọn bộ huy hiệu!"}
            </p>
          </div>

          {!badges.find((b) => b.id === 'circus-vip')?.unlocked && (
            <Button
              variant="carnival"
              size="sm"
              onClick={claimVipBadge}
              className="text-xs shrink-0 cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span>{isEn ? "Claim VIP Guest Badge" : "Nhận Huy Hiệu Khán Giả VIP"}</span>
            </Button>
          )}
        </div>

        {/* Badges Grid - 7 Badges with Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`rounded-2xl p-4 border-2 transition-all text-center flex flex-col items-center justify-between group cursor-pointer hover:shadow-md ${
                badge.unlocked
                  ? 'bg-amber-50/80 border-amber-400 shadow-xs hover:border-amber-500'
                  : 'bg-neutral-50/90 border-neutral-200 hover:border-amber-300'
              }`}
            >
              <div className="size-16 rounded-full flex items-center justify-center text-3xl mb-2 relative">
                <span className={badge.unlocked ? 'animate-bounce' : 'grayscale opacity-60 group-hover:scale-110 transition-transform'}>
                  {badge.icon}
                </span>
                {badge.unlocked && (
                  <CheckCircle2 className="size-5 text-emerald-600 fill-white absolute -top-1 -right-1 shadow-xs" />
                )}
              </div>

              <div className="w-full space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                  {isEn ? (badge.name || badge.vietnameseName) : badge.vietnameseName}
                </h4>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  {isEn && badge.descriptionEn ? badge.descriptionEn : badge.description}
                </p>
              </div>

              {/* Action Trigger / Status Button */}
              <div className="mt-3 w-full pt-2 border-t border-amber-100 flex flex-col items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    badge.unlocked
                      ? 'bg-amber-400 text-amber-950 font-bold'
                      : 'bg-neutral-200 text-neutral-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors'
                  }`}
                >
                  {badge.unlocked ? (isEn ? '✓ UNLOCKED' : '✓ ĐÃ NHẬN') : (isEn ? 'CLICK TO EXPLORE' : 'BẤM ĐỂ KHÁM PHÁ')}
                </span>

                {/* Specific CTA Label */}
                <span className="text-[10px] font-medium text-amber-800 group-hover:text-red-700 underline flex items-center justify-center gap-0.5">
                  {badge.id === 'circus-ai-chatbot' && (isEn ? "Open Chatbot AI ↗" : "Trò chuyện Chatbot AI ↗")}
                  {badge.id === 'circus-3d-explorer' && (isEn ? "Enter 3D Circus ↗" : "Vào Rạp Xiếc 3D ↗")}
                  {badge.id === 'circus-digital-archive' && (isEn ? "Open Archive ↗" : "Mở Kho Tư Liệu Số ↗")}
                  {badge.id === 'circus-map-explorer' && (isEn ? "Explore Map" : "Khám Phá Bản Đồ")}
                  {badge.id === 'circus-quiz-master' && (isEn ? "Play 20 Quizzes" : "Thử Thách 20 Quiz")}
                  {badge.id === 'circus-scholar' && (isEn ? "Explore History" : "Khám Phá Lịch Sử")}
                  {badge.id === 'circus-vip' && !badge.unlocked && (isEn ? "Claim VIP Badge" : "Nhận Huy Hiệu VIP")}
                  {badge.id === 'circus-vip' && badge.unlocked && (isEn ? "VIP Supporter" : "Khán Giả VIP")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information / Thông tin liên hệ */}
      <div 
        id="circus-contact-section"
        className="no-print w-full max-w-2xl mx-auto bg-gradient-to-br from-[#2b0808] via-[#1f0606] to-[#120303] rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl text-white relative overflow-hidden"
      >
        {/* Decorative corner stars and circus flourishes */}
        <div className="absolute top-3 right-4 text-amber-400/20 text-4xl select-none pointer-events-none">
          ★
        </div>
        <div className="absolute -bottom-4 -right-4 text-8xl text-red-700/10 select-none pointer-events-none">
          🎪
        </div>

        <div className="relative z-10 space-y-4">
          <div className="border-b border-white/15 pb-3">
            <h3 className="font-circus text-xl sm:text-2xl text-amber-300 tracking-wide flex items-center gap-2.5">
              <span>★</span>
              <span>{isEn ? "Contact Information" : "Thông tin liên hệ"}</span>
            </h3>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Letter sticker in front of rapxiecbotui@gmail.com, both in white */}
            <div className="flex items-center gap-3 group">
              <span 
                className="inline-flex items-center justify-center size-9 rounded-xl bg-white/15 border-2 border-white text-white shadow-md rotate-[-3deg] group-hover:rotate-0 transition-transform shrink-0"
                title="Email sticker"
              >
                <Mail className="size-5 text-white" strokeWidth={2.2} />
              </span>
              <a 
                href="mailto:rapxiecbotui@gmail.com" 
                className="text-white hover:text-amber-300 font-medium text-sm sm:text-base tracking-wide transition-colors underline-offset-4 hover:underline"
              >
                rapxiecbotui@gmail.com
              </a>
            </div>

            {/* Facebook logo in front of Rạp Xiếc Bỏ Túi, both in white */}
            <a 
              href="https://www.facebook.com/people/R%E1%BA%A1p-Xi%E1%BA%BFc-B%E1%BB%8F-T%C3%BAi/61591831813277/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group w-fit cursor-pointer"
            >
              <span 
                className="inline-flex items-center justify-center size-9 rounded-xl bg-white/15 border-2 border-white text-white shadow-md rotate-[3deg] group-hover:rotate-0 group-hover:scale-105 transition-all shrink-0"
                title="Facebook logo"
              >
                <Facebook className="size-5 text-white fill-white" strokeWidth={0} />
              </span>
              <span className="text-white group-hover:text-amber-300 font-medium text-sm sm:text-base tracking-wide transition-colors underline-offset-4 group-hover:underline">
                {isEn ? "Pocket Circus Vietnam" : "Rạp Xiếc Bỏ Túi"}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. Modal: Save Photo to Album (Triggered by "In vé kỷ niệm (kèm logo)") */}
      {activeModal === 'save' && (
        <div 
          className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-5 sm:p-7 border-4 border-amber-400 shadow-2xl relative my-auto space-y-4 animate-in zoom-in-95 duration-200 text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 size-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1 pr-6 pl-2">
              <h3 className="font-circus text-xl sm:text-2xl text-red-900 flex items-center justify-center gap-2">
                <span>🎪</span>
                <span>{isEn ? "Save Ticket to Photo Album" : "Lưu Vé Kỷ Niệm Vào Album"}</span>
              </h3>
              <p className="text-xs text-neutral-600">
                {isEn 
                  ? "Your honorary ticket with your logo is ready to save to your photo album or download." 
                  : "Ảnh vé danh dự kèm logo của bạn đã sẵn sàng để lưu vào album điện thoại hoặc tải về máy."}
              </p>
            </div>

            {/* Ticket Preview Card */}
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
              {isGenerating ? (
                <div className="py-8 flex flex-col items-center gap-3 text-amber-900 text-xs font-semibold">
                  <Loader2 className="size-8 animate-spin text-amber-600" />
                  <span>{isEn ? "Creating high-definition ticket image..." : "Đang tạo ảnh vé chất lượng cao..."}</span>
                </div>
              ) : ticketImageUrl ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <img
                    src={ticketImageUrl}
                    alt="Vé kỷ niệm Rạp Xiếc Bỏ Túi"
                    className="w-full max-h-[230px] sm:max-h-[270px] object-contain rounded-xl border border-amber-300/80 shadow-md"
                  />
                  <span className="text-[11px] text-amber-800 font-medium">
                    {isEn ? "✓ High-definition 2X PNG Ticket Photo" : "✓ Ảnh vé chất lượng cao 2X (.PNG)"}
                  </span>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-neutral-500">
                  {isEn ? "No preview generated yet" : "Chưa tạo ảnh vé"}
                </div>
              )}
            </div>

            {/* Action Buttons to Save Photo to Album / Computer */}
            <div className="space-y-2.5 pt-1">
              <Button
                variant="carnival"
                size="default"
                onClick={handleSavePhotoDirect}
                className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer text-sm font-bold shadow-md"
              >
                <Download className="size-4.5" />
                <span>{isEn ? "Save Ticket Photo (.PNG)" : "Lưu Ảnh Vé Vào Thiết Bị (.PNG)"}</span>
              </Button>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyImage}
                  className="flex items-center justify-center gap-1.5 bg-white border-amber-300 text-amber-950 hover:bg-amber-100/80 cursor-pointer text-xs py-2 shadow-xs font-semibold"
                >
                  {copiedImage ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5 text-amber-700" />
                  )}
                  <span>{copiedImage ? (isEn ? "Image Copied!" : "Đã Chép Ảnh!") : (isEn ? "Copy Image" : "Sao Chép Ảnh")}</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-amber-200/80 text-xs">
                <span className="text-neutral-500 text-[11px] text-center sm:text-left">
                  {isEn ? "💡 Tip: You can save high-definition ticket image or copy it directly" : "💡 Mẹo: Bạn có thể lưu ảnh vé chất lượng cao hoặc sao chép ảnh nhanh"}
                </span>

                <button
                  onClick={() => setActiveModal('share')}
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer hover:underline text-xs"
                >
                  <Share2 className="size-3.5" />
                  <span>{isEn ? "Share to platforms →" : "Chia sẻ đến nền tảng khác →"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Share Ticket via Other Platforms (Triggered by "Chia sẻ vé") */}
      {activeModal === 'share' && (
        <div 
          className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-5 sm:p-7 border-4 border-amber-400 shadow-2xl relative my-auto space-y-4 animate-in zoom-in-95 duration-200 text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 size-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1 pr-6 pl-2">
              <h3 className="font-circus text-xl sm:text-2xl text-red-900 flex items-center justify-center gap-2">
                <span>🎪</span>
                <span>{isEn ? "Share Circus Ticket" : "Chia Sẻ Vé Kỷ Niệm"}</span>
              </h3>
              <p className="text-xs text-neutral-600">
                {isEn 
                  ? "Share your honorary ticket with friends across social platforms and messaging apps." 
                  : "Chia sẻ vé danh dự Rạp Xiếc Bỏ Túi đến bạn bè qua các nền tảng mạng xã hội và ứng dụng."}
              </p>
            </div>

            {/* Ticket Preview Card */}
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
              {isGenerating ? (
                <div className="py-8 flex flex-col items-center gap-3 text-amber-900 text-xs font-semibold">
                  <Loader2 className="size-8 animate-spin text-amber-600" />
                  <span>{isEn ? "Preparing ticket for sharing..." : "Đang chuẩn bị ảnh vé..."}</span>
                </div>
              ) : ticketImageUrl ? (
                <div className="space-y-2 w-full flex flex-col items-center">
                  <img
                    src={ticketImageUrl}
                    alt="Vé kỷ niệm Rạp Xiếc Bỏ Túi"
                    className="w-full max-h-[220px] sm:max-h-[260px] object-contain rounded-xl border border-amber-300/80 shadow-md"
                  />
                  <span className="text-[11px] text-amber-800 font-medium">
                    {isEn ? "✓ Ready to share across platforms" : "✓ Sẵn sàng chia sẻ đến bạn bè"}
                  </span>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-neutral-500">
                  {isEn ? "No preview generated yet" : "Chưa tạo ảnh vé"}
                </div>
              )}
            </div>

            {/* Platform Sharing Options */}
            <div className="space-y-3 pt-1">
              {/* Native Send / Share across platforms */}
              <Button
                variant="carnival"
                size="default"
                onClick={handleShareToPlatforms}
                className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer text-sm font-bold shadow-md"
              >
                <Send className="size-4" />
                <span>{isEn ? "Send via Apps (Zalo, Messenger, AirDrop...)" : "Gửi Qua Các Ứng Dụng (Zalo, Messenger, Tin Nhắn...)"}</span>
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <Facebook className="size-4 fill-blue-600 text-blue-600" />
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.open(`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <span className="font-extrabold text-sm text-blue-600">Zalo</span>
                  <span>Chia sẻ Zalo</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-950 font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {copied ? <Check className="size-4 text-emerald-600" /> : <Share2 className="size-4 text-amber-700" />}
                  <span>{copied ? (isEn ? "Copied Link!" : "Đã Chép Link!") : (isEn ? "Copy Link" : "Chép Link Vé")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-950 font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {copiedImage ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4 text-amber-700" />}
                  <span>{copiedImage ? (isEn ? "Copied Image!" : "Đã Chép Ảnh!") : (isEn ? "Copy Image" : "Sao Chép Ảnh")}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-amber-200/80 text-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('save')}
                  className="text-xs text-amber-800 hover:text-red-700 font-semibold underline cursor-pointer"
                >
                  {isEn ? "← Save photo to phone album instead" : "← Chuyển sang Lưu ảnh vào album điện thoại"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
