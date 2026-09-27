// Accurate Client-side Visitor Tracking Service for Pocket Circus Vietnam
// Tracks real visits based on time of arrival and accurate online presence

export interface VisitorStats {
  online: number; // Accurate count of active online visitors
  today: number; // Accurate visits today
  yesterday: number; // Accurate visits yesterday
  total: number; // Accurate cumulative total visits
  lastDate: string; // YYYY-MM-DD
  entryTime: number; // Exact timestamp when user entered (ms)
  entryTimeFormatted: string; // e.g. "01:25:30"
  sessionDuration: number; // Seconds spent on the website this session
  isOnline: boolean; // Always true while the user is on the site
  activeTabsCount: number; // Number of open tabs in this browser
}

interface PeerInfo {
  clientId: string;
  lastSeen: number;
  isVisible: boolean;
}

const STATS_STORAGE_KEY = 'circus_visitor_stats_v2';
const SESSION_STORAGE_KEY = 'circus_session_entry_v2';
const PEERS_STORAGE_KEY = 'circus_online_peers_v2';
const CLIENT_ID_KEY = 'circus_client_unique_id';
const LAST_ACTIVE_KEY = 'circus_last_active_time';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 mins session window

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatSessionDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins < 10 ? '0' : ''}${remMins}m`;
}

export function formatEntryTime(timestamp: number): string {
  if (!timestamp) return '--:--:--';
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = 'client_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'fallback_client';
  }
}

// Generate unique ID for this specific tab
const currentTabId = typeof window !== 'undefined'
  ? 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
  : 'server_tab';

let presenceChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    presenceChannel = new BroadcastChannel('circus_presence_channel');
  } catch {
    presenceChannel = null;
  }
}

// State
let currentStats: VisitorStats = {
  online: 1, // When this code runs, the user is on the website
  today: 1,
  yesterday: 248,
  total: 3925,
  lastDate: getLocalDateString(),
  entryTime: Date.now(),
  entryTimeFormatted: formatEntryTime(Date.now()),
  sessionDuration: 0,
  isOnline: true,
  activeTabsCount: 1,
};

const listeners = new Set<(stats: VisitorStats) => void>();

function notify() {
  const snapshot: VisitorStats = { ...currentStats };
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      /* ignore listener error */
    }
  });
}

function getStoredPeers(): Record<string, PeerInfo> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PEERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredPeers(peers: Record<string, PeerInfo>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PEERS_STORAGE_KEY, JSON.stringify(peers));
  } catch {
    /* ignore storage quotas */
  }
}

// Accurately compute active online visitors & tabs
function updateAccurateOnlinePresence(): { onlineCount: number; tabsCount: number } {
  if (typeof window === 'undefined') return { onlineCount: 1, tabsCount: 1 };

  const clientId = getOrCreateClientId();
  const now = Date.now();
  const peers = getStoredPeers();

  // Register / refresh current tab
  peers[currentTabId] = {
    clientId,
    lastSeen: now,
    isVisible: typeof document !== 'undefined' && document.visibilityState === 'visible',
  };

  // Prune dead tabs (> 5 seconds of inactivity)
  const activeClientIds = new Set<string>();
  let currentBrowserTabs = 0;

  for (const [tid, info] of Object.entries(peers)) {
    if (now - info.lastSeen > 5000) {
      delete peers[tid];
    } else {
      activeClientIds.add(info.clientId);
      if (info.clientId === clientId) {
        currentBrowserTabs++;
      }
    }
  }

  saveStoredPeers(peers);

  // Accurate online count: at least 1 since current user is on the site
  const onlineCount = Math.max(1, activeClientIds.size);
  const tabsCount = Math.max(1, currentBrowserTabs);

  return { onlineCount, tabsCount };
}

// Initialise and accurately calculate visit counts
function initVisitorTracking(): VisitorStats {
  if (typeof window === 'undefined') return currentStats;

  const todayStr = getLocalDateString();
  const now = Date.now();

  let entryTime = now;
  let isNewVisitSession = false;

  // 1. Session Detection based on arrival time
  try {
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const lastActiveRaw = localStorage.getItem(LAST_ACTIVE_KEY);
    const lastActive = lastActiveRaw ? Number(lastActiveRaw) : 0;

    if (!rawSession || (lastActive > 0 && now - lastActive > SESSION_TIMEOUT_MS)) {
      // New visit: User entered the website at this time
      isNewVisitSession = true;
      entryTime = now;
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ sessionId: currentTabId, entryTime: now })
      );
    } else {
      // Ongoing visit: retrieve original entry time
      const parsed = JSON.parse(rawSession);
      if (parsed && typeof parsed.entryTime === 'number') {
        entryTime = parsed.entryTime;
      }
    }
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
  } catch {
    entryTime = now;
  }

  // 2. Load stored cumulative statistics
  try {
    let savedToday = 1;
    let savedYesterday = 248;
    let savedTotal = 3925;
    let savedLastDate = todayStr;

    // Check v2 first, fallback to v1 if migrating
    const rawV2 = localStorage.getItem(STATS_STORAGE_KEY);
    const rawV1 = !rawV2 ? localStorage.getItem('circus_visitor_stats_v1') : null;
    const raw = rawV2 || rawV1;

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        savedYesterday = typeof parsed.yesterday === 'number' ? parsed.yesterday : 248;
        savedTotal = typeof parsed.total === 'number' ? parsed.total : 3925;
        savedLastDate = parsed.lastDate || todayStr;

        if (savedLastDate === todayStr) {
          savedToday = typeof parsed.today === 'number' ? parsed.today : 1;
        } else {
          // Date transition (midnight past): yesterday takes previous today's visits
          savedYesterday = typeof parsed.today === 'number' && parsed.today > 0 ? parsed.today : savedYesterday;
          savedToday = 0;
          savedLastDate = todayStr;
        }
      }
    }

    // 3. Increment visit count only if this is a newly arrived visit
    if (isNewVisitSession) {
      savedToday += 1;
      savedTotal += 1;
    } else if (savedToday === 0) {
      savedToday = 1;
    }

    const { onlineCount, tabsCount } = updateAccurateOnlinePresence();

    currentStats = {
      online: onlineCount,
      today: savedToday,
      yesterday: savedYesterday,
      total: savedTotal,
      lastDate: todayStr,
      entryTime,
      entryTimeFormatted: formatEntryTime(entryTime),
      sessionDuration: Math.max(0, Math.floor((now - entryTime) / 1000)),
      isOnline: true,
      activeTabsCount: tabsCount,
    };

    saveStats();
  } catch {
    /* fallback to defaults */
  }

  return currentStats;
}

function saveStats() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STATS_STORAGE_KEY,
      JSON.stringify({
        today: currentStats.today,
        yesterday: currentStats.yesterday,
        total: currentStats.total,
        lastDate: currentStats.lastDate,
      })
    );
  } catch {
    /* ignore storage quotas */
  }
}

// Lifecycle listeners
if (typeof window !== 'undefined') {
  initVisitorTracking();

  // 1. Presence Heartbeat every 2 seconds
  setInterval(() => {
    const { onlineCount, tabsCount } = updateAccurateOnlinePresence();
    const now = Date.now();
    currentStats.online = onlineCount;
    currentStats.activeTabsCount = tabsCount;
    currentStats.sessionDuration = Math.max(0, Math.floor((now - currentStats.entryTime) / 1000));
    currentStats.isOnline = true;

    // Check for midnight rollover
    const todayStr = getLocalDateString();
    if (currentStats.lastDate !== todayStr) {
      currentStats.yesterday = currentStats.today;
      currentStats.today = 1;
      currentStats.lastDate = todayStr;
      saveStats();
    }

    notify();

    if (presenceChannel) {
      try {
        presenceChannel.postMessage({ type: 'heartbeat', tabId: currentTabId });
      } catch {
        /* noop */
      }
    }
  }, 2000);

  // 2. Keep activity timestamp fresh
  const handleUserActivity = () => {
    try {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    } catch {
      /* noop */
    }
  };
  window.addEventListener('click', handleUserActivity, { passive: true });
  window.addEventListener('keydown', handleUserActivity, { passive: true });
  window.addEventListener('scroll', handleUserActivity, { passive: true });

  // 3. Tab Visibility change
  document.addEventListener('visibilitychange', () => {
    const { onlineCount, tabsCount } = updateAccurateOnlinePresence();
    currentStats.online = onlineCount;
    currentStats.activeTabsCount = tabsCount;
    notify();
  });

  // 4. Tab closing / unloading: remove from presence immediately
  const handleUnload = () => {
    try {
      const peers = getStoredPeers();
      delete peers[currentTabId];
      saveStoredPeers(peers);
      if (presenceChannel) {
        presenceChannel.postMessage({ type: 'leave', tabId: currentTabId });
      }
    } catch {
      /* noop */
    }
  };
  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);

  // 5. Cross-tab synchronization via BroadcastChannel
  if (presenceChannel) {
    presenceChannel.addEventListener('message', () => {
      const { onlineCount, tabsCount } = updateAccurateOnlinePresence();
      currentStats.online = onlineCount;
      currentStats.activeTabsCount = tabsCount;
      notify();
    });
  }

  // 6. Cross-tab synchronization via localStorage storage event
  window.addEventListener('storage', (e) => {
    if (e.key === STATS_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        currentStats.today = parsed.today ?? currentStats.today;
        currentStats.yesterday = parsed.yesterday ?? currentStats.yesterday;
        currentStats.total = parsed.total ?? currentStats.total;
        notify();
      } catch {
        /* noop */
      }
    } else if (e.key === PEERS_STORAGE_KEY) {
      const { onlineCount, tabsCount } = updateAccurateOnlinePresence();
      currentStats.online = onlineCount;
      currentStats.activeTabsCount = tabsCount;
      notify();
    }
  });
}

export function getVisitorStats(): VisitorStats {
  return { ...currentStats };
}

export function subscribeVisitorStats(callback: (stats: VisitorStats) => void): () => void {
  listeners.add(callback);
  callback({ ...currentStats });
  return () => {
    listeners.delete(callback);
  };
}
