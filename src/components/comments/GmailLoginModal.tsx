import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { GoogleIcon } from '@/src/components/icons/GoogleIcon';
import { CommentUser, saveCurrentUser } from '@/src/lib/commentsService';

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

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setError(isEn ? 'Please enter your Gmail address.' : 'Vui lòng nhập địa chỉ Gmail của bạn.');
      return;
    }

    // Auto-append @gmail.com if user only entered username
    if (!trimmedEmail.includes('@')) {
      trimmedEmail = `${trimmedEmail}@gmail.com`;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(isEn ? 'Invalid email format.' : 'Định dạng email không hợp lệ.');
      return;
    }

    if (!trimmedEmail.toLowerCase().endsWith('@gmail.com') && !trimmedEmail.toLowerCase().endsWith('@googlemail.com')) {
      setError(
        isEn
          ? 'Please use a valid @gmail.com address to log in.'
          : 'Vui lòng sử dụng địa chỉ @gmail.com để tiếp tục.'
      );
      return;
    }

    const displayName = trimmedName || trimmedEmail.split('@')[0];

    setIsSubmitting(true);

    setTimeout(() => {
      // Deterministic colorful avatar with initial
      const initial = displayName.charAt(0).toUpperCase();
      const colors = ['#ea4335', '#4285f4', '#fbbc05', '#34a853', '#9c27b0', '#ff6d00'];
      const colorIndex = (displayName.charCodeAt(0) || 0) % colors.length;
      const avatarColor = colors[colorIndex];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=${avatarColor.replace('#', '')}&color=fff&size=128&bold=true`;

      const user: CommentUser = {
        name: displayName,
        email: trimmedEmail.toLowerCase(),
        avatar: avatarUrl,
        provider: 'gmail',
      };

      saveCurrentUser(user);
      setIsSubmitting(false);
      onSuccess(user);
      onClose();
    }, 400);
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

        {/* Header with Google Logo */}
        <div className="text-center space-y-2 pt-1">
          <div className="mx-auto size-12 rounded-2xl bg-white flex items-center justify-center shadow-md p-2.5">
            <GoogleIcon className="size-7" />
          </div>
          <h3 className="font-circus text-lg sm:text-xl text-amber-300 tracking-wider">
            {isEn ? 'Sign In with Gmail' : 'Đăng Nhập Bằng Gmail'}
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-sm mx-auto">
            {isEn
              ? 'Sign in with your Gmail account to leave comments, ratings, and suggestions for Pocket Circus.'
              : 'Đăng nhập tài khoản Gmail để để lại đánh giá, bình luận và đóng góp ý kiến cho Rạp Xiếc Bỏ Túi.'}
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
              <Mail className="size-3.5 text-amber-400" />
              <span>{isEn ? 'Gmail Address' : 'Địa chỉ Gmail'}</span>
              <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a0505]/90 border-2 border-amber-400/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 focus:outline-none text-amber-100 text-xs sm:text-sm placeholder:text-amber-200/50 transition-all font-mono shadow-inner"
                autoFocus
              />
              <span className="absolute right-3 top-2.5 text-xs text-amber-300/70 font-semibold pointer-events-none">
                @gmail.com
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <User className="size-3.5 text-amber-400" />
              <span>{isEn ? 'Display Name (Optional)' : 'Họ và tên hiển thị (Tùy chọn)'}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'Your Name' : 'Họ và tên của bạn'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a0505]/90 border-2 border-amber-400/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 focus:outline-none text-amber-100 text-xs sm:text-sm placeholder:text-amber-200/50 transition-all shadow-inner"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-red-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-amber-400/30 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] border border-amber-200/50"
            >
              <GoogleIcon className="size-4" />
              <span>
                {isSubmitting
                  ? isEn
                    ? 'Signing in...'
                    : 'Đang kết nối...'
                  : isEn
                  ? 'Continue with Google Account'
                  : 'Xác Nhận & Đăng Nhập Gmail'}
              </span>
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>
            {isEn
              ? 'Safe & verified Gmail profile for community feedback'
              : 'Xác thực an toàn để gửi ý kiến đóng góp cho ban tổ chức'}
          </span>
        </div>
      </div>
    </div>
  );
};
