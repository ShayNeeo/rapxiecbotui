// Service for comments and suggestions with Google / Gmail authentication and Public Cloud Sync

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
const PRIMARY_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1124a55850ba2';
const SECONDARY_CLOUD_URL = 'https://extendsclass.com/api/json-storage/bin/efbfaca';

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

function loadFromLocalStorage(): CircusComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const parsed: CircusComment[] = raw ? JSON.parse(raw) : [];
    const valid = Array.isArray(parsed)
      ? parsed.filter((c) => c && c.id && !['cmt-1', 'cmt-2', 'cmt-3'].includes(c.id))
      : [];

    const map = new Map<string, CircusComment>();
    inMemoryComments.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });
    valid.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });

    inMemoryComments = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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

export function createGuestUser(rawName: string): CommentUser {
  const trimmedName = rawName.trim();
  const slugName = trimmedName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  const userEmail = `${slugName || 'user'}@guest.com`;
  const colors = ['ea4335', '4285f4', 'fbbc05', '34a853', '9c27b0', 'ff6d00'];
  const colorIndex = (trimmedName.charCodeAt(0) || 0) % colors.length;
  const avatarColor = colors[colorIndex];
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    trimmedName
  )}&background=${avatarColor}&color=fff&size=128&bold=true`;

  return {
    name: trimmedName,
    email: userEmail,
    avatar: avatarUrl,
    provider: 'guest',
  };
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

// Push to Cloud Stores (primary: restful-api.dev with full CORS, secondary: extendsclass)
async function syncToCloud(comments: CircusComment[]): Promise<boolean> {
  let success = false;
  try {
    const res = await fetch(PRIMARY_CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'circus_comments_store',
        data: { comments },
      }),
    });
    if (res.ok) success = true;
  } catch (err) {
    console.warn('Could not sync comments to primary cloud store', err);
  }

  // Backup sync (best effort)
  try {
    fetch(SECONDARY_CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comments }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }

  return success;
}

// Fetch comments from Cloud and merge without losing any local or in-memory comments
export async function fetchRemoteComments(): Promise<CircusComment[]> {
  try {
    let remoteComments: CircusComment[] | null = null;

    // 1. Fetch from primary cloud store
    try {
      const res = await fetch(`${PRIMARY_CLOUD_URL}?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.comments && Array.isArray(json.data.comments)) {
          remoteComments = json.data.comments;
        }
      }
    } catch (e) {
      console.warn('Primary cloud fetch failed, falling back:', e);
    }

    // 2. Fallback to secondary store if primary is unavailable
    if (!remoteComments) {
      try {
        const res2 = await fetch(`${SECONDARY_CLOUD_URL}?t=${Date.now()}`);
        if (res2.ok) {
          const json2 = await res2.json();
          if (json2?.comments && Array.isArray(json2.comments)) {
            remoteComments = json2.comments;
          }
        }
      } catch {
        /* ignore */
      }
    }

    if (remoteComments && Array.isArray(remoteComments)) {
      // Hợp nhất bình luận: Remote + LocalStorage + In-Memory để không bao giờ bị mất bất kỳ bình luận nào
      const localComments = loadFromLocalStorage();
      const commentMap = new Map<string, CircusComment>();

      // Đưa bình luận remote vào map
      for (const c of remoteComments) {
        if (c && c.id) commentMap.set(c.id, c);
      }

      // Đưa bình luận local vào map (giữ lại các bình luận vừa đăng mà remote chưa kịp sync)
      for (const c of localComments) {
        if (c && c.id) commentMap.set(c.id, c);
      }

      // Đưa bình luận in-memory vào map (bảo vệ các bình luận vừa tạo trong phiên hiện tại)
      for (const c of inMemoryComments) {
        if (c && c.id) commentMap.set(c.id, c);
      }

      const merged = Array.from(commentMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      inMemoryComments = merged;
      saveToLocalStorage(inMemoryComments);
      notifyListeners();

      if (commentsChannel) {
        try {
          commentsChannel.postMessage({ type: 'comments_updated' });
        } catch {
          /* ignore */
        }
      }

      // Nếu local có bình luận mới mà remote chưa có, tự động đẩy lên cloud ngay
      if (merged.length > remoteComments.length) {
        syncToCloud(merged).catch(() => {});
      }

      return getComments();
    }
  } catch (err) {
    console.warn('Failed to fetch remote comments', err);
  }
  return getComments();
}

// Add a new comment (stores locally + cloud sync)
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

  // Push to cloud so everyone will see it immediately
  syncToCloud(updated).catch(() => {});

  return newComment;
}

// Delete own comment
export async function deleteComment(commentId: string, currentUserEmail: string): Promise<boolean> {
  const current = getComments();
  const target = current.find((c) => c.id === commentId);

  if (!target) return false;

  // Verify that the email matches the author
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

  // Update cloud
  syncToCloud(updated).catch(() => {});

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
    inMemoryComments = updated;
    saveToLocalStorage(updated);
    notifyListeners();

    // Sync likes to cloud
    syncToCloud(updated).catch(() => {});

    return !isLiked;
  } catch {
    return false;
  }
}

// Initialize and start periodic cloud synchronization (every 4 seconds)
if (typeof window !== 'undefined') {
  loadFromLocalStorage();
  fetchRemoteComments().catch(() => {});

  setInterval(() => {
    fetchRemoteComments().catch(() => {});
  }, 4000);
}
