import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Link as LinkIcon, Sparkles } from "lucide-react";
import { circusAudio } from "@/src/utils/audio";
import confetti from "canvas-confetti";

interface AddPhotoDialogProps {
  isOpen: boolean;
  initialEraId?: string;
  isCoverMode?: boolean;
  customTitle?: string;
  onClose: () => void;
  onSavePhoto: (data: {
    url: string;
    caption: string;
    eraId: string;
    isCover?: boolean;
  }) => void;
  isEn: boolean;
}

export const AddPhotoDialog: React.FC<AddPhotoDialogProps> = ({
  isOpen,
  initialEraId = "overview",
  isCoverMode = false,
  customTitle,
  onClose,
  onSavePhoto,
  isEn,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [selectedEra, setSelectedEra] = useState<string>(initialEraId);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedEra(initialEraId);
      setPreviewUrl("");
      setCaption("");
      setErrorMsg(null);
    }
  }, [isOpen, initialEraId]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg(isEn ? "Please select a valid image file." : "Vui lòng chọn tệp hình ảnh hợp lệ.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setPreviewUrl(compressedDataUrl);
        } else {
          setPreviewUrl(result);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setPreviewUrl(result);
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setErrorMsg(isEn ? "Failed to read image file." : "Không thể đọc tệp hình ảnh.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewUrl) {
      setErrorMsg(isEn ? "Please upload or provide an image URL." : "Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh.");
      return;
    }

    circusAudio.playApplause();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });

    onSavePhoto({
      url: previewUrl,
      caption: caption.trim() || (isEn ? "Historical Circus Photo" : "Ảnh tư liệu lịch sử xiếc"),
      eraId: selectedEra,
      isCover: isCoverMode,
    });

    onClose();
  };

  const dialogTitle = customTitle || (
    isCoverMode
      ? initialEraId === "overview"
        ? isEn ? "Overview Photo" : "Tư Liệu Ảnh Triển Lãm"
        : isEn ? "Milestone Photo" : "Tư Liệu Ảnh Cột Mốc"
      : isEn ? "Add Historical Photo" : "Thêm Ảnh Tư Liệu Lịch Sử"
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-base font-bold shadow-xs">
              📷
            </span>
            <div>
              <h3 className="font-circus text-lg sm:text-xl text-neutral-900">
                {dialogTitle}
              </h3>
              <p className="text-[11px] text-neutral-600">
                {isEn ? "Upload an image from your device or paste an image URL" : "Tải ảnh từ máy tính/điện thoại hoặc dán link URL"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selection: Upload vs URL */}
        <div className="flex items-center gap-2 p-1 bg-amber-50 rounded-2xl border border-amber-200">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-amber-400 text-amber-950 shadow-xs"
                : "text-neutral-700 hover:bg-amber-100/60"
            }`}
          >
            <Upload className="size-3.5" />
            <span>{isEn ? "Upload from Device" : "Tải lên từ thiết bị"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "url"
                ? "bg-amber-400 text-amber-950 shadow-xs"
                : "text-neutral-700 hover:bg-amber-100/60"
            }`}
          >
            <LinkIcon className="size-3.5" />
            <span>{isEn ? "Image Link (URL)" : "Đường dẫn ảnh (URL)"}</span>
          </button>
        </div>

        {/* Tab 1: File Upload */}
        {activeTab === "upload" && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="size-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Upload className="size-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-800 block">
                  {isEn ? "Click to browse and upload photo" : "Bấm vào đây để chọn ảnh từ máy"}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  PNG, JPG, WebP, GIF (tối ưu tự động)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: URL Input */}
        {activeTab === "url" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 block">
              {isEn ? "Image URL:" : "Liên kết ảnh (URL):"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => {
                  setPreviewUrl(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="https://images.unsplash.com/... hoặc https://..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-neutral-50"
              />
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewUrl("")}
                  className="text-xs text-neutral-500 hover:text-red-600 px-2"
                >
                  {isEn ? "Clear" : "Xóa"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Image Preview Box */}
        {previewUrl && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 bg-neutral-900 max-h-48 flex items-center justify-center shadow-xs">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 w-full object-cover"
              onError={() => setErrorMsg(isEn ? "Could not load image from this URL." : "Không thể tải ảnh từ liên kết này.")}
            />
            <span className="absolute top-2 left-2 bg-neutral-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-700">
              {isEn ? "Preview" : "Xem trước ảnh"}
            </span>
          </div>
        )}

        {/* Caption Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 block">
            {isEn ? "Photo Caption (Optional):" : "Chú thích ảnh (Tùy chọn):"}
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={
              isCoverMode
                ? isEn ? "e.g., Grand Performance in 1923" : "Ví dụ: Tiết mục nhào lộn đặc sắc..."
                : isEn ? "e.g., Performance at Hanoi Circus" : "Ví dụ: Buổi diễn tại Rạp Xiếc Hà Nội..."
            }
            className="w-full px-3.5 py-2 rounded-xl text-xs border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-neutral-50"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            {isEn ? "Cancel" : "Hủy bỏ"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!previewUrl || isProcessing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-md disabled:opacity-50 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5" />
            <span>
              {isCoverMode
                ? isEn ? "Save Photo" : "Lưu Ảnh"
                : isEn ? "Add Photo" : "Lưu Ảnh"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
