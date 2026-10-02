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
  const [name, setName] = useState('');
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

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(isEn ? 'Please enter your name.' : 'Vui lòng nhập tên của bạn.');
      return;
    }

    // Auto-generate consistent email/id identifier based on user's name
    const slugName = trimmedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    const userEmail = `${slugName || 'user'}@guest.com`;

    setIsSubmitting(true);

    setTimeout(() => {
      // Deterministic colorful avatar with initial
      const colors = ['ea4335', '4285f4', 'fbbc05', '34a853', '9c27b0', 'ff6d00'];
      const colorIndex = (trimmedName.charCodeAt(0) || 0) % colors.length;
      const avatarColor = colors[colorIndex];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        trimmedName
      )}&background=${avatarColor}&color=fff&size=128&bold=true`;

      const user: CommentUser = {
        name: trimmedName,
        email: userEmail,
        avatar: avatarUrl,
        provider: 'guest',
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
          <div className="mx-auto size-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shadow-md p-2.5">
            <User className="size-6 text-amber-300" />
          </div>
          <h3 className="font-circus text-lg sm:text-xl text-amber-300 tracking-wider">
            {isEn ? 'Enter Your Name' : 'Nhập Tên Của Bạn'}
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-sm mx-auto">
            {isEn
              ? 'Enter your name to leave comments, ratings, and suggestions. Everyone will see your contribution!'
              : 'Nhập tên của bạn để để lại bình luận và đóng góp ý kiến. Mọi người xem sẽ cùng thấy ý kiến của bạn!'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs flex items-center gap-2">
              <span className="shrink-0 size-2 rounded-full bg-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <User className="size-3.5 text-amber-400" />
              <span>{isEn ? 'Your Name' : 'Nhập tên của bạn'}</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'Enter your name...' : 'Nhập tên của bạn...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a0505]/90 border-2 border-amber-400/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 focus:outline-none text-amber-100 text-xs sm:text-sm placeholder:text-amber-200/50 transition-all shadow-inner"
              autoFocus
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-red-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-amber-400/30 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] border border-amber-200/50"
            >
              <User className="size-4" />
              <span>
                {isSubmitting
                  ? isEn
                    ? 'Saving...'
                    : 'Đang lưu...'
                  : isEn
                  ? 'Confirm & Continue'
                  : 'Xác Nhận Tên Của Bạn'}
              </span>
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>
            {isEn
              ? 'Public Community Board • Comments synced in real-time'
              : 'Cộng đồng Rạp Xiếc Bỏ Túi • Bình luận được đồng bộ công khai'}
          </span>
        </div>
      </div>
    </div>
  );
};
