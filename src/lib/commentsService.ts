// Service for comments and suggestions with Supabase Database & Realtime Sync + Local Cache Fallback
import { supabase } from './supabase';

export interface CommentUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'gmail' | 'google' | 'guest';
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

let inMemoryComments: CircusComment[] = [];
const commentListeners = new Set<(comments: CircusComment[]) => void>();

let commentsChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    commentsChannel = new BroadcastChannel('circus_comments_channel_v1');
    commentsChannel.onmessage = (event) => {
      if (event.data?.type === 'comments_updated') {
        loadFromLocalStorage();
        notifyListeners();
      }
    };
  } catch {
    commentsChannel = null;
  }
}

function notifyListeners() {
  const snapshot = getComments();
  commentListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      /* ignore */
    }
  });
}

const isValidComment = (c: any): c is CircusComment => {
  return Boolean(
    c &&
    typeof c === 'object' &&
    typeof c.id === 'string' &&
    !['cmt-1', 'cmt-2', 'cmt-3'].includes(c.id) &&
    c.user &&
    typeof c.user === 'object' &&
    typeof c.user.name === 'string' &&
    c.user.name.trim().length > 0
  );
};

function loadFromLocalStorage(): CircusComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const parsed: any[] = raw ? JSON.parse(raw) : [];
    inMemoryComments = Array.isArray(parsed) ? parsed.filter(isValidComment) : [];
    return inMemoryComments;
  } catch {
    return inMemoryComments;
  }
}

function saveToLocalStorage(comments: CircusComment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  } catch {
    /* ignore */
  }
}

// Current User management
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

// Get comments with likedByMe flag for current device
export function getComments(): CircusComment[] {
  if (inMemoryComments.length === 0) {
    loadFromLocalStorage();
  }

  let likedIds: string[] = [];
  if (typeof window !== 'undefined') {
    try {
      const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
      likedIds = likedRaw ? JSON.parse(likedRaw) : [];
    } catch {
      likedIds = [];
    }
  }

  return inMemoryComments.map((c) => ({
    ...c,
    likedByMe: likedIds.includes(c.id),
  }));
}

// Subscribe to comment changes (cloud sync, local edits, new comments)
export function subscribeComments(callback: (comments: CircusComment[]) => void): () => void {
  commentListeners.add(callback);
  callback(getComments());
  return () => {
    commentListeners.delete(callback);
  };
}

// Fetch comments from Supabase Database
export async function fetchRemoteComments(): Promise<CircusComment[]> {
  try {
    const { data, error } = await supabase
      .from('circus_comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const mappedComments: CircusComment[] = data.map((row) => ({
        id: row.id,
        user: {
          name: row.user_name || 'Khán giả',
          email: row.user_email || '',
          avatar: row.user_avatar || '',
          provider: (row.user_provider as any) || 'guest',
        },
        content: row.content,
        rating: Number(row.rating) || 5,
        tag: (row.tag as CommentTag) || 'suggestion',
        createdAt: row.created_at || new Date().toISOString(),
        likes: Number(row.likes) || 0,
      })).filter(isValidComment);

      inMemoryComments = mappedComments;
      saveToLocalStorage(inMemoryComments);
      notifyListeners();

      if (commentsChannel) {
        try {
          commentsChannel.postMessage({ type: 'comments_updated' });
        } catch {
          /* ignore */
        }
      }

      return getComments();
    }
  } catch (err) {
    console.warn('Failed to fetch comments from Supabase, using local cache', err);
  }

  return getComments();
}

// Add a new comment (writes to Supabase + local cache)
export async function addComment(commentData: {
  user: CommentUser;
  content: string;
  rating: number;
  tag: CommentTag;
}): Promise<CircusComment> {
  const newComment: CircusComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user: commentData.user,
    content: commentData.content,
    rating: commentData.rating,
    tag: commentData.tag,
    createdAt: new Date().toISOString(),
    likes: 1,
    likedByMe: true,
  };

  // Immediate optimistic update
  const existing = getComments();
  const updated = [newComment, ...existing.filter((c) => c.id !== newComment.id)];
  inMemoryComments = updated;
  saveToLocalStorage(updated);

  if (typeof window !== 'undefined') {
    try {
      const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
      const likedIds: string[] = likedRaw ? JSON.parse(likedRaw) : [];
      likedIds.push(newComment.id);
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      /* ignore */
    }
  }

  notifyListeners();

  if (commentsChannel) {
    try {
      commentsChannel.postMessage({ type: 'comments_updated' });
    } catch {
      /* ignore */
    }
  }

  // Insert into Supabase table
  try {
    const { error } = await supabase.from('circus_comments').insert([
      {
        id: newComment.id,
        user_name: newComment.user.name,
        user_email: newComment.user.email,
        user_avatar: newComment.user.avatar || '',
        user_provider: newComment.user.provider || 'guest',
        content: newComment.content,
        rating: newComment.rating,
        tag: newComment.tag,
        likes: newComment.likes,
        created_at: newComment.createdAt,
      },
    ]);

    if (error) {
      console.warn('Supabase comment insert warning (table might not exist yet):', error.message);
    }
  } catch (err) {
    console.warn('Supabase comment insert exception:', err);
  }

  return newComment;
}

// Delete own comment
export async function deleteComment(commentId: string, currentUserEmail: string): Promise<boolean> {
  const current = getComments();
  const target = current.find((c) => c.id === commentId);

  if (!target) return false;

  if (target.user.email.toLowerCase() !== currentUserEmail.toLowerCase()) {
    console.warn('Unauthorized delete attempt: author email does not match');
    return false;
  }

  const updated = current.filter((c) => c.id !== commentId);
  inMemoryComments = updated;
  saveToLocalStorage(updated);
  notifyListeners();

  if (commentsChannel) {
    try {
      commentsChannel.postMessage({ type: 'comments_updated' });
    } catch {
      /* ignore */
    }
  }

  // Delete from Supabase
  try {
    await supabase.from('circus_comments').delete().eq('id', commentId);
  } catch (err) {
    console.warn('Supabase comment delete error:', err);
  }

  return true;
}

// Toggle like for a comment
export function toggleLikeComment(commentId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const likedRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    let likedIds: string[] = likedRaw ? JSON.parse(likedRaw) : [];
    const isLiked = likedIds.includes(commentId);

    const comments = getComments();
    let newLikes = 0;
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        newLikes = isLiked ? Math.max(0, c.likes - 1) : c.likes + 1;
        return {
          ...c,
          likes: newLikes,
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
    inMemoryComments = updated;
    saveToLocalStorage(updated);
    notifyListeners();

    // Update like count in Supabase
    supabase
      .from('circus_comments')
      .update({ likes: newLikes })
      .eq('id', commentId)
      .then();

    return !isLiked;
  } catch {
    return false;
  }
}

// Initialize Supabase Realtime Listener & Periodic Polling
if (typeof window !== 'undefined') {
  loadFromLocalStorage();
  fetchRemoteComments().catch(() => {});

  // Setup Supabase Realtime subscription
  try {
    supabase
      .channel('public:circus_comments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'circus_comments' },
        () => {
          fetchRemoteComments().catch(() => {});
        }
      )
      .subscribe();
  } catch (e) {
    console.warn('Supabase realtime subscription error:', e);
  }

  // Backup sync every 6 seconds
  setInterval(() => {
    fetchRemoteComments().catch(() => {});
  }, 6000);
}
