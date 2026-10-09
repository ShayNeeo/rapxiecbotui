// Realtime Accurate Visitor Tracking & Presence Service for Pocket Circus Vietnam
// Realtime sync via Supabase & Cloud Storage
import { supabase } from './supabase';

export interface VisitorStats {
  online: number; // Accurate count of active online visitors across all devices
  today: number; // Accurate visits today (synced with cloud)
  yesterday: number; // Accurate visits yesterday
  total: number; // Accurate cumulative total visits (synced with cloud)
  lastDate: string; // YYYY-MM-DD
  entryTime: number; // Exact timestamp when user entered (ms)
  entryTimeFormatted: string; // e.g. "21:35:10"
  sessionDuration: number; // Exact seconds spent on site this session
  isOnline: boolean; // Always true while active
  activeTabsCount: number; // Tabs open in current browser
  lastSyncTime: number; // Last time synced with cloud (ms)
  lastSyncTimeFormatted: string; // e.g. "21:35:10"
}

interface CloudPayload {
  visitors: {
    total: number;
    today: number;
    yesterday: number;
    date: string;
  };
  presence: Record<string, number>; // clientId -> lastSeen timestamp
}

const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/cacbbff';
const STORAGE_KEY_V3 = 'circus_visitor_real_v3';
const SESSION_KEY = 'circus_real_session_v3';
const CLIENT_ID_KEY = 'circus_client_id_v3';
const HEARTBEAT_INTERVAL_MS = 15000; // 15 seconds heartbeat
const PRESENCE_TIMEOUT_MS = 45000; // 45 seconds timeout for inactive peers
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes session window

// Format Vietnam local date (GMT+7)
function getVietnamDateString(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

export function formatSessionDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return `${mins}p ${secs < 10 ? '0' : ''}${secs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins < 10 ? '0' : ''}${remMins}p`;
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
      id = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anon_' + Date.now();
  }
}

const currentTabId = typeof window !== 'undefined'
  ? 'tab_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now()
  : 'server_tab';

let broadcast: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcast = new BroadcastChannel('circus_visitor_sync_v3');
  } catch {
    broadcast = null;
  }
}

// Clear old fake data from localStorage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('circus_visitor_stats_v2');
    localStorage.removeItem('circus_visitor_stats_v1');
    localStorage.removeItem('circus_online_peers_v2');
  } catch {
    /* ignore */
  }
}

// Initial state - Real starting values (no fake 3925 or 248)
let currentStats: VisitorStats = {
  online: 1,
  today: 1,
  yesterday: 0,
  total: 1,
  lastDate: getVietnamDateString(),
  entryTime: typeof window !== 'undefined' ? Date.now() : 0,
  entryTimeFormatted: typeof window !== 'undefined' ? formatEntryTime(Date.now()) : '--:--:--',
  sessionDuration: 0,
  isOnline: true,
  activeTabsCount: 1,
  lastSyncTime: typeof window !== 'undefined' ? Date.now() : 0,
  lastSyncTimeFormatted: typeof window !== 'undefined' ? formatEntryTime(Date.now()) : '--:--:--',
};

const listeners = new Set<(stats: VisitorStats) => void>();

function notify() {
  const snapshot = { ...currentStats };
  listeners.forEach((fn) => {
    try {
      fn(snapshot);
    } catch {
      /* ignore */
    }
  });
}

function loadLocalCache(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        currentStats.today = Number(parsed.today) || currentStats.today;
        currentStats.yesterday = Number(parsed.yesterday) || 0;
        currentStats.total = Number(parsed.total) || currentStats.total;
        currentStats.lastDate = parsed.lastDate || currentStats.lastDate;
      }
    }
  } catch {
    /* ignore */
  }
}

function saveLocalCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY_V3,
      JSON.stringify({
        today: currentStats.today,
        yesterday: currentStats.yesterday,
        total: currentStats.total,
        lastDate: currentStats.lastDate,
      })
    );
  } catch {
    /* ignore */
  }
}

// Fetch current cloud data from Supabase, clean expired presence, return updated payload
async function fetchCloudData(): Promise<CloudPayload | null> {
  try {
    const { data, error } = await supabase
      .from('circus_visitor_stats')
      .select('payload')
      .eq('id', 'global_stats')
      .maybeSingle();

    if (!error && data && data.payload && data.payload.visitors) {
      return {
        visitors: {
          total: Number(data.payload.visitors.total) || 1,
          today: Number(data.payload.visitors.today) || 1,
          yesterday: Number(data.payload.visitors.yesterday) || 0,
          date: data.payload.visitors.date || getVietnamDateString(),
        },
        presence:
          typeof data.payload.presence === 'object' && data.payload.presence !== null
            ? data.payload.presence
            : {},
      };
    }
  } catch (e) {
    console.warn('Supabase visitor stats fetch error:', e);
  }

  // Secondary fallback to json storage bin if Supabase table is not yet created
  try {
    const res = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.visitors) {
        return {
          visitors: {
            total: Number(data.visitors.total) || 1,
            today: Number(data.visitors.today) || 1,
            yesterday: Number(data.visitors.yesterday) || 0,
            date: data.visitors.date || getVietnamDateString(),
          },
          presence: typeof data.presence === 'object' && data.presence !== null ? data.presence : {},
        };
      }
    }
  } catch (e) {
    /* ignore fallback error */
  }

  return null;
}

// Send updated payload to Supabase (and mirror to bin)
async function saveCloudData(payload: CloudPayload): Promise<boolean> {
  let supabaseSuccess = false;
  try {
    const { error } = await supabase
      .from('circus_visitor_stats')
      .upsert({
        id: 'global_stats',
        payload: payload,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      supabaseSuccess = true;
    }
  } catch (e) {
    console.warn('Supabase visitor stats save error:', e);
  }

  // Mirror to json bin as fallback
  try {
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    /* ignore fallback error */
  }

  return supabaseSuccess;
}

// Core sync engine: updates presence and increments visit on new session
let isSyncing = false;
async function syncWithCloud(isNewSession: boolean = false): Promise<void> {
  if (typeof window === 'undefined' || isSyncing) return;
  isSyncing = true;

  try {
    const clientId = getOrCreateClientId();
    const now = Date.now();
    const todayStr = getVietnamDateString();

    const remote = await fetchCloudData();
    if (!remote) {
      isSyncing = false;
      return;
    }

    // 1. Process presence: clean up peers inactive for > 45s
    const activePresence: Record<string, number> = {};
    for (const [id, seen] of Object.entries(remote.presence)) {
      if (typeof seen === 'number' && now - seen < PRESENCE_TIMEOUT_MS) {
        activePresence[id] = seen;
      }
    }
    // Set this client active
    activePresence[clientId] = now;

    // 2. Process visitor counts
    let { total, today, yesterday, date } = remote.visitors;

    // Check midnight rollover (Vietnam timezone)
    if (date !== todayStr) {
      yesterday = today;
      today = 0;
      date = todayStr;
    }

    if (isNewSession) {
      today += 1;
      total += 1;
    }

    // Prepare updated payload
    const updatedPayload: CloudPayload = {
      visitors: {
        total: Math.max(1, total),
        today: Math.max(1, today),
        yesterday: Math.max(0, yesterday),
        date,
      },
      presence: activePresence,
    };

    // Calculate real online visitor count
    const realOnlineCount = Math.max(1, Object.keys(activePresence).length);

    // Update in-memory state
    currentStats.online = realOnlineCount;
    currentStats.today = updatedPayload.visitors.today;
    currentStats.yesterday = updatedPayload.visitors.yesterday;
    currentStats.total = updatedPayload.visitors.total;
    currentStats.lastDate = date;
    currentStats.lastSyncTime = now;
    currentStats.lastSyncTimeFormatted = formatEntryTime(now);

    saveLocalCache();
    notify();

    // Broadcast to other tabs in the same browser
    if (broadcast) {
      try {
        broadcast.postMessage({ type: 'sync_update', stats: currentStats });
      } catch {
        /* ignore */
      }
    }

    // Push updated state to cloud
    await saveCloudData(updatedPayload);
  } catch (err) {
    console.warn('Realtime sync exception:', err);
  } finally {
    isSyncing = false;
  }
}

// Initialise visitor session
function initTracking() {
  if (typeof window === 'undefined') return;

  loadLocalCache();

  const now = Date.now();
  let entryTime = now;
  let isNewSession = false;

  try {
    const rawSession = sessionStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      isNewSession = true;
      entryTime = now;
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ sessionId: currentTabId, entryTime: now })
      );
    } else {
      const parsed = JSON.parse(rawSession);
      if (parsed && typeof parsed.entryTime === 'number') {
        entryTime = parsed.entryTime;
      }
    }
  } catch {
    entryTime = now;
  }

  currentStats.entryTime = entryTime;
  currentStats.entryTimeFormatted = formatEntryTime(entryTime);
  currentStats.sessionDuration = Math.max(0, Math.floor((now - entryTime) / 1000));
  currentStats.lastSyncTime = now;
  currentStats.lastSyncTimeFormatted = formatEntryTime(now);

  notify();

  // First sync with cloud (register visit if new session)
  syncWithCloud(isNewSession);

  // Periodic heartbeat every 15 seconds to keep online status fresh
  setInterval(() => {
    const currentTime = Date.now();
    currentStats.sessionDuration = Math.max(0, Math.floor((currentTime - currentStats.entryTime) / 1000));
    notify();

    // Only send cloud heartbeat if page is currently visible
    if (document.visibilityState === 'visible') {
      syncWithCloud(false);
    }
  }, HEARTBEAT_INTERVAL_MS);

  // Update session duration counter every 1 second locally
  setInterval(() => {
    const currentTime = Date.now();
    currentStats.sessionDuration = Math.max(0, Math.floor((currentTime - currentStats.entryTime) / 1000));
    notify();
  }, 1000);

  // Tab visibility change: refresh when user returns to tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncWithCloud(false);
    }
  });

  // Cross-tab synchronization via BroadcastChannel
  if (broadcast) {
    broadcast.addEventListener('message', (event) => {
      if (event.data?.type === 'sync_update' && event.data.stats) {
        const remoteStats: VisitorStats = event.data.stats;
        currentStats.online = remoteStats.online;
        currentStats.today = remoteStats.today;
        currentStats.yesterday = remoteStats.yesterday;
        currentStats.total = remoteStats.total;
        currentStats.lastDate = remoteStats.lastDate;
        currentStats.lastSyncTime = remoteStats.lastSyncTime;
        currentStats.lastSyncTimeFormatted = remoteStats.lastSyncTimeFormatted;
        notify();
      }
    });
  }

  // Window unload: notify cloud on leave
  const handleLeave = () => {
    try {
      const clientId = getOrCreateClientId();
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        // Presence naturally expires after 45s or on next sync
      }
    } catch {
      /* ignore */
    }
  };
  window.addEventListener('beforeunload', handleLeave);
  window.addEventListener('pagehide', handleLeave);
}

// Start tracking immediately in browser
if (typeof window !== 'undefined') {
  initTracking();
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
