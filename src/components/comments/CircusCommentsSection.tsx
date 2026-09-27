import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Star,
  Heart,
  Send,
  LogOut,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  HelpCircle,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { GoogleIcon } from '@/src/components/icons/GoogleIcon';
import {
  CircusComment,
  CommentTag,
  CommentUser,
  addComment,
  deleteComment,
  clearCurrentUser,
  getComments,
  getCurrentUser,
  toggleLikeComment,
  subscribeComments,
  fetchRemoteComments,
} from '@/src/lib/commentsService';
import { GmailLoginModal } from './GmailLoginModal';

interface CircusCommentsSectionProps {
  isEn?: boolean;
}

export const CircusCommentsSection: React.FC<CircusCommentsSectionProps> = ({ isEn = false }) => {
  const [currentUser, setCurrentUser] = useState<CommentUser | null>(null);
  const [comments, setComments] = useState<CircusComment[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Form states
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [tag, setTag] = useState<CommentTag>('suggestion');
  const [filterTag, setFilterTag] = useState<'all' | CommentTag>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setComments(getComments());

    // Subscribe to cloud and local comment updates
    const unsubscribe = subscribeComments((updatedComments) => {
      setComments(updatedComments);
    });

    fetchRemoteComments().catch(() => {});

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRemoteComments();
    setIsRefreshing(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) return;

    setIsSubmitting(true);

    try {
      await addComment({
        user: currentUser,
        content: trimmed,
        rating,
        tag,
      });

      setContent('');
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;

    if (deleteConfirmId !== commentId) {
      setDeleteConfirmId(commentId);
      setTimeout(() => {
        setDeleteConfirmId((prev) => (prev === commentId ? null : prev));
      }, 4000);
      return;
    }

    const success = await deleteComment(commentId, currentUser.email);
    setDeleteConfirmId(null);
    if (success) {
      setToastNotice(isEn ? 'Your comment has been deleted.' : 'Đã xóa bình luận của bạn thành công.');
      setTimeout(() => setToastNotice(null), 3000);
    }
  };

  const handleToggleLike = (commentId: string) => {
    toggleLikeComment(commentId);
  };

  const filteredComments = filterTag === 'all'
    ? comments
    : comments.filter((c) => c.tag === filterTag);

  const getTagBadge = (cmtTag: CommentTag) => {
    switch (cmtTag) {
      case 'suggestion':
        return {
          icon: <Lightbulb className="size-3 text-amber-400" />,
          label: isEn ? 'Suggestion' : 'Đóng góp ý kiến',
          bg: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
        };
      case 'appreciation':
        return {
          icon: <ThumbsUp className="size-3 text-emerald-400" />,
          label: isEn ? 'Appreciation' : 'Cảm nhận & Khen ngợi',
          bg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
        };
      case 'question':
        return {
          icon: <HelpCircle className="size-3 text-sky-400" />,
          label: isEn ? 'Idea / Q&A' : 'Đề xuất & Hỏi đáp',
          bg: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
        };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffMin < 2) return isEn ? 'Just now' : 'Vừa xong';
    if (diffMin < 60) return isEn ? `${diffMin}m ago` : `${diffMin} phút trước`;
    if (diffHr < 24) return isEn ? `${diffHr}h ago` : `${diffHr} giờ trước`;
    if (diffDays === 1) return isEn ? 'Yesterday' : 'Hôm qua';
    if (diffDays < 30) return isEn ? `${diffDays} days ago` : `${diffDays} ngày trước`;
    return new Date(isoString).toLocaleDateString(isEn ? 'en-US' : 'vi-VN');
  };

  // Mask email for privacy (e.g. "lan***@gmail.com")
  const maskEmail = (emailStr: string) => {
    const parts = emailStr.split('@');
    if (parts.length < 2) return emailStr;
    const namePart = parts[0];
    const masked = namePart.length > 3 ? `${namePart.substring(0, 3)}***` : `${namePart}***`;
    return `${masked}@${parts[1]}`;
  };

  return (
    <section
      id="comments-section"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6"
      aria-label={isEn ? 'Comments and Suggestions' : 'Bình luận và đóng góp ý kiến'}
    >
      {/* Section Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/10 border border-red-800/30 text-red-900 text-xs font-bold uppercase tracking-wider shadow-xs">
          <MessageSquarePlus className="size-3.5 text-red-800" />
          <span>{isEn ? 'Community Feedback' : 'Ý Kiến Độc Giả'}</span>
        </div>
        <h3 className="font-circus text-2xl sm:text-3xl text-red-950 tracking-wide">
          {isEn ? 'COMMENTS & SUGGESTIONS' : 'BÌNH LUẬN & ĐÓNG GÓP Ý KIẾN'}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-700 max-w-xl mx-auto leading-relaxed font-medium">
          {isEn
            ? 'Connect with your Gmail account to leave comments. All comments are synced publicly so every visitor can see them!'
            : 'Đăng nhập tài khoản Gmail để gửi đánh giá và đóng góp ý kiến. Bình luận được đồng bộ trực tuyến để mọi khán giả cùng theo dõi!'}
        </p>
      </div>

      {/* Main Comment Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#3a0808] via-[#240404] to-[#140202] border-4 border-amber-400 p-5 sm:p-7 shadow-2xl space-y-5 text-white">
        {/* User bar / Login prompt */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-400/20">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="size-10 rounded-full border-2 border-amber-400/70 object-cover shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-amber-200">
                    <span>{currentUser.name}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-emerald-400 font-medium border border-emerald-400/30">
                      <GoogleIcon className="size-2.5" />
                      <span>{currentUser.email}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {isEn ? 'Connected with Google Account' : 'Đã kết nối tài khoản Google Gmail'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer border border-white/10"
                title={isEn ? 'Sign out' : 'Đăng xuất'}
              >
                <LogOut className="size-3 text-neutral-400" />
                <span className="hidden sm:inline">{isEn ? 'Sign out' : 'Đăng xuất'}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 w-full bg-gradient-to-r from-amber-500/15 via-red-950/40 to-amber-500/15 border-2 border-amber-400/50 rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0 shadow-md">
                  <GoogleIcon className="size-5.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                    {isEn ? 'Sign in with Gmail to comment' : 'Đăng nhập tài khoản Gmail để bình luận'}
                  </h4>
                  <p className="text-[11px] text-amber-100/80">
                    {isEn
                      ? 'Connect your exact Gmail to post public suggestions and manage your comments.'
                      : 'Kết nối đúng tài khoản Gmail để đăng ý kiến công khai và tự xóa khi viết nhầm.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-red-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-amber-400/30 cursor-pointer shrink-0 hover:scale-102 active:scale-98 border border-amber-200/50"
              >
                <GoogleIcon className="size-4" />
                <span>{isEn ? 'Sign in with Gmail' : 'Đăng Nhập Bằng Gmail'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Controls: Rating & Category Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-300">
                {isEn ? 'Rating:' : 'Đánh giá:'}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-120 transition-transform cursor-pointer"
                    title={`${star} sao`}
                  >
                    <Star
                      className={`size-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tag */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-amber-300 mr-1">
                {isEn ? 'Topic:' : 'Chủ đề:'}
              </span>
              {[
                { id: 'suggestion' as CommentTag, label: isEn ? '💡 Suggestion' : '💡 Đóng góp ý kiến' },
                { id: 'appreciation' as CommentTag, label: isEn ? '❤️ Appreciation' : '❤️ Cảm nhận' },
                { id: 'question' as CommentTag, label: isEn ? '❓ Idea / Q&A' : '❓ Đề xuất' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTag(t.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    tag === t.id
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                      : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                currentUser
                  ? isEn
                    ? 'Write your feedback, suggestions, or impressions about the website...'
                    : 'Nhập ý kiến đóng góp, cảm nghĩ hoặc đề xuất cải tiến về mô hình 3D, tư liệu lịch sử...'
                  : isEn
                  ? 'Please sign in with Gmail above to write a comment...'
                  : 'Vui lòng đăng nhập Gmail ở trên để bắt đầu gửi ý kiến đóng góp...'
              }
              disabled={!currentUser}
              className="w-full px-4 py-3 rounded-2xl bg-[#260505]/90 border-2 border-amber-400/50 focus:border-amber-300 focus:bg-[#300606] focus:outline-none text-amber-50 text-xs sm:text-sm placeholder:text-amber-200/50 transition-all resize-none shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Bottom Bar: Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-amber-200/70">
              {content.length > 0 && `${content.length} ký tự`}
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !currentUser || !content.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-amber-300/40"
            >
              <Send className="size-3.5" />
              <span>
                {isSubmitting
                  ? isEn
                    ? 'Sending...'
                    : 'Đang gửi...'
                  : isEn
                  ? 'Submit Feedback'
                  : 'Gửi Ý Kiến Đóng Góp'}
              </span>
            </button>
          </div>
        </form>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>
              {isEn
                ? 'Thank you! Your feedback has been posted publicly and is visible to all visitors.'
                : 'Cảm ơn bạn! Bình luận của bạn đã được đăng công khai cho mọi người cùng xem!'}
            </span>
          </div>
        )}

        {/* Action Notice Toast */}
        {toastNotice && (
          <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-400/60 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in duration-300">
            <AlertCircle className="size-4 text-amber-400 shrink-0" />
            <span>{toastNotice}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
          <Sparkles className="size-3.5 text-red-700" />
          <span>
            {isEn ? `All Comments (${filteredComments.length})` : `Tất cả bình luận (${filteredComments.length})`}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 rounded-md hover:bg-neutral-200 text-neutral-600 transition-colors ml-1 cursor-pointer"
            title={isEn ? 'Refresh comments' : 'Cập nhật bình luận mới nhất'}
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: isEn ? 'All' : 'Tất cả' },
            { id: 'suggestion', label: isEn ? '💡 Suggestions' : '💡 Đóng góp' },
            { id: 'appreciation', label: isEn ? '❤️ Appreciation' : '❤️ Cảm nhận' },
            { id: 'question', label: isEn ? '❓ Ideas' : '❓ Đề xuất' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTag(tab.id as typeof filterTag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                filterTag === tab.id
                  ? 'bg-red-800 text-white border-red-800 shadow-xs'
                  : 'bg-white/80 text-neutral-700 border-neutral-300 hover:bg-neutral-100 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3.5">
        {filteredComments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-red-900/25 p-8 text-center text-neutral-600 text-xs sm:text-sm bg-white/80 backdrop-blur-xs space-y-1.5 shadow-xs">
            <p className="font-bold text-red-950 text-sm">
              {isEn ? 'No comments yet' : 'Chưa có bình luận nào'}
            </p>
            <p className="text-xs text-neutral-600">
              {isEn ? 'Be the first to sign in with Gmail and share your feedback!' : 'Hãy đăng nhập Gmail và là người đầu tiên chia sẻ cảm nhận hoặc đóng góp ý kiến!'}
            </p>
          </div>
        ) : (
          filteredComments.map((cmt) => {
            const badge = getTagBadge(cmt.tag);
            const isMyComment = currentUser && currentUser.email.toLowerCase() === cmt.user.email.toLowerCase();
            const isConfirmingDelete = deleteConfirmId === cmt.id;

            return (
              <div
                key={cmt.id}
                className="rounded-2xl bg-gradient-to-b from-[#2e0606]/95 to-[#1c0303]/95 border-2 border-amber-400/40 hover:border-amber-400/80 p-4 sm:p-5 text-white shadow-md transition-all space-y-3"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cmt.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.user.name)}&background=ea4335&color=fff`}
                      alt={cmt.user.name}
                      className="size-9 rounded-full border border-amber-400/50 object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-amber-200">
                          {cmt.user.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-neutral-300 font-mono border border-white/10">
                          <GoogleIcon className="size-2.5" />
                          <span>{maskEmail(cmt.user.email)}</span>
                        </span>
                        {isMyComment && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-[10px] text-amber-300 border border-amber-400/40 font-semibold">
                            {isEn ? 'You' : 'Bình luận của bạn'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Clock className="size-2.5 text-neutral-500" />
                          <span>{formatRelativeTime(cmt.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Topic Badge */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < cmt.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-transparent text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal whitespace-pre-line pl-12">
                  {cmt.content}
                </p>

                {/* Footer Actions: Like / Heart & Delete Own Comment */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 pl-12">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(cmt.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      cmt.likedByMe
                        ? 'bg-red-600/30 text-red-300 border border-red-500/50'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Heart
                      className={`size-3.5 ${
                        cmt.likedByMe ? 'fill-red-500 text-red-500' : 'text-neutral-400'
                      }`}
                    />
                    <span>{cmt.likes}</span>
                    <span className="text-[10px] font-normal">
                      {isEn ? 'Helpful' : 'Hữu ích'}
                    </span>
                  </button>

                  {/* Feature: Automatically delete your own comment if you write it wrong */}
                  {isMyComment && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(cmt.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        isConfirmingDelete
                          ? 'bg-red-600 text-white border-red-500 animate-pulse'
                          : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border-red-500/30'
                      }`}
                      title={isEn ? 'Delete this comment' : 'Xóa bình luận này (nếu viết nhầm)'}
                    >
                      <Trash2 className="size-3" />
                      <span>
                        {isConfirmingDelete
                          ? isEn
                            ? 'Confirm Delete?'
                            : 'Xác nhận xóa?'
                          : isEn
                          ? 'Delete comment'
                          : 'Xóa bình luận'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gmail Login Modal */}
      <GmailLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
        isEn={isEn}
      />
    </section>
  );
};
