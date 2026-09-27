// Service for comments and suggestions with Google / Gmail authentication and Public Cloud Sync

export interface CommentUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'gmail' | 'google';
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
const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/efbfaca';

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
    inMemoryComments = parsed.filter((c) => !['cmt-1', 'cmt-2', 'cmt-3'].includes(c.id));
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

// Push to Cloud Bin
async function syncToCloud(comments: CircusComment[]): Promise<boolean> {
  try {
    const res = await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comments }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not sync comments to cloud store', err);
    return false;
  }
}

// Fetch comments from Cloud Bin and merge
export async function fetchRemoteComments(): Promise<CircusComment[]> {
  try {
    // Add timestamp to bypass caching
    const res = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`);
    if (!res.ok) return getComments();

    const data = await res.json();
    if (data && Array.isArray(data.comments)) {
      const remoteComments: CircusComment[] = data.comments;
      
      // Update in-memory and local cache
      inMemoryComments = remoteComments;
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
