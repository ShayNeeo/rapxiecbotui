// Service for comments and suggestions with Gmail authentication

export interface CommentUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'gmail';
}

export type CommentTag = 'suggestion' | 'appreciation' | 'question';

export interface CircusComment {
  id: string;
  user: CommentUser;
  content: string;
  rating: number; // 1 to 5
  tag: CommentTag;
  createdAt: string; // ISO date string
  likes: number;
  likedByMe?: boolean;
}

const USER_STORAGE_KEY = 'circus_gmail_user_v1';
const COMMENTS_STORAGE_KEY = 'circus_user_comments_v2';
const LIKES_STORAGE_KEY = 'circus_user_liked_comments_v1';

const INITIAL_COMMENTS: CircusComment[] = [];

export function getCurrentUser(): CommentUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CommentUser;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: CommentUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getComments(): CircusComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    let comments: CircusComment[] = raw ? JSON.parse(raw) : [];

    // Filter out any mock/seed comments
    comments = comments.filter((c) => !['cmt-1', 'cmt-2', 'cmt-3'].includes(c.id));

    // Check likes
    const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likedIds: string[] = likedRaw ? JSON.parse(likedRaw) : [];

    comments = comments.map((c) => ({
      ...c,
      likedByMe: likedIds.includes(c.id),
    }));

    return comments;
  } catch {
    return [];
  }
}

export function addComment(commentData: {
  user: CommentUser;
  content: string;
  rating: number;
  tag: CommentTag;
}): CircusComment {
  const newComment: CircusComment = {
    id: `cmt-${Date.now()}`,
    user: commentData.user,
    content: commentData.content,
    rating: commentData.rating,
    tag: commentData.tag,
    createdAt: new Date().toISOString(),
    likes: 1,
    likedByMe: true,
  };

  const existing = getComments();
  const updated = [newComment, ...existing];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));

      // Mark as liked by author
      const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
      const likedIds: string[] = likedRaw ? JSON.parse(likedRaw) : [];
      likedIds.push(newComment.id);
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      /* ignore */
    }
  }

  return newComment;
}

export function toggleLikeComment(commentId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    let likedIds: string[] = likedRaw ? JSON.parse(likedRaw) : [];
    const isLiked = likedIds.includes(commentId);

    const comments = getComments();
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          likedByMe: !isLiked,
        };
      }
      return c;
    });

    if (isLiked) {
      likedIds = likedIds.filter((id) => id !== commentId);
    } else {
      likedIds.push(commentId);
    }

    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));

    return !isLiked;
  } catch {
    return false;
  }
}
