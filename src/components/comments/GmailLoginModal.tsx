import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, User, Sparkles } from 'lucide-react';
import { GoogleIcon } from '@/src/components/icons/GoogleIcon';
import { CommentUser, saveCurrentUser } from '@/src/lib/commentsService';

declare global {
  interface Window {
    google?: any;
  }
}

interface GmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CommentUser) => void;
  isEn?: boolean;
}

export const GmailLoginModal: React.FC<GmailLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isEn = false,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const gisButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Check if GIS is available and client ID is provided
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id && gisButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              try {
                // Decode JWT payload
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);
                const googleUser: CommentUser = {
                  name: payload.name || payload.given_name || payload.email.split('@')[0],
                  email: payload.email.toLowerCase(),
                  avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=ea4335&color=fff`,
                  provider: 'google',
                };
                saveCurrentUser(googleUser);
                onSuccess(googleUser);
                onClose();
              } catch (err) {
                console.warn('Could not decode Google GIS token', err);
              }
            }
          },
        });

        window.google.accounts.id.renderButton(gisButtonRef.current, {
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: 320,
        });
      } catch (err) {
        console.warn('Google GIS initialize error', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(isEn ? 'Please enter your Gmail address.' : 'Vui lòng nhập địa chỉ Gmail của bạn.');
      return;
    }

    // Auto-append @gmail.com if user only types the username part
    if (!trimmedEmail.includes('@')) {
      trimmedEmail = `${trimmedEmail}@gmail.com`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(isEn ? 'Invalid Gmail address format.' : 'Định dạng địa chỉ Gmail không hợp lệ.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Derive a friendly display name from the email (e.g. "minh.tuan" -> "minh.tuan")
      const rawName = trimmedEmail.split('@')[0];
      const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      // Deterministic colorful avatar with initial
      const colors = ['ea4335', '4285f4', 'fbbc05', '34a853', '9c27b0', 'ff6d00'];
      const colorIndex = (displayName.charCodeAt(0) || 0) % colors.length;
      const avatarColor = colors[colorIndex];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=${avatarColor}&color=fff&size=128&bold=true`;

      const user: CommentUser = {
        name: displayName,
        email: trimmedEmail,
        avatar: avatarUrl,
        provider: 'gmail',
      };

      saveCurrentUser(user);
      setIsSubmitting(false);
      onSuccess(user);
      onClose();
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#3d0909] via-[#260505] to-[#150202] border-4 border-amber-400 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-amber-300/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isEn ? 'Close' : 'Đóng'}
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="mx-auto size-13 rounded-2xl bg-white flex items-center justify-center shadow-lg p-2.5">
            <GoogleIcon className="size-8" />
          </div>
          <h3 className="font-circus text-lg sm:text-xl text-amber-300 tracking-wider">
            {isEn ? 'Connect with Gmail' : 'Kết Nối Bằng Gmail'}
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-sm mx-auto">
            {isEn
              ? 'Enter your Gmail address to verify and post comments, reviews, and suggestions on the website.'
              : 'Nhập địa chỉ Gmail của bạn để xác thực và gửi bình luận, đánh giá đóng góp ý kiến vào website.'}
          </p>
        </div>

        {/* Optional Google One Tap Container */}
        <div ref={gisButtonRef} className="flex justify-center empty:hidden" />

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs flex items-center gap-2">
              <span className="shrink-0 size-2 rounded-full bg-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-amber-400" />
                <span>{isEn ? 'Your Gmail Address' : 'Địa chỉ Gmail của bạn'}</span>
                <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-amber-300/70 font-normal">
                {isEn ? 'e.g. yourname@gmail.com' : 'Ví dụ: tenban@gmail.com'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isEn ? 'Enter your Gmail address...' : 'Nhập Gmail của bạn (vd: abc@gmail.com)...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a0505]/90 border-2 border-amber-400/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 focus:outline-none text-amber-100 text-xs sm:text-sm placeholder:text-amber-200/50 transition-all shadow-inner pr-10"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400/60">
                <Mail className="size-4" />
              </div>
            </div>
            <p className="text-[11px] text-amber-200/70 italic">
              {isEn
                ? '💡 Tip: You can just type "yourname" and we will auto-format "@gmail.com".'
                : '💡 Mẹo: Bạn chỉ cần gõ phần tên và hệ thống sẽ tự hoàn thiện đuôi @gmail.com nếu thiếu.'}
            </p>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-amber-400/30 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] border border-amber-200/50"
            >
              <GoogleIcon className="size-4" />
              <span>
                {isSubmitting
                  ? isEn
                    ? 'Connecting...'
                    : 'Đang kết nối...'
                  : isEn
                  ? 'Confirm Gmail & Continue'
                  : 'Xác Nhận Gmail & Tiếp Tục'}
              </span>
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>
            {isEn
              ? 'Public Community Board • Connected with Supabase Database'
              : 'Cộng đồng Rạp Xiếc Bỏ Túi • Lưu trữ và đồng bộ cùng Supabase'}
          </span>
        </div>
      </div>
    </div>
  );
};

