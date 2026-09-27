// Client-side Visitor Tracking Service for Pocket Circus Vietnam

export interface VisitorStats {
  online: number;
  today: number;
  yesterday: number;
  total: number;
  lastDate: string;
}

const STORAGE_KEY = 'circus_visitor_stats_v1';
const SESSION_KEY = 'circus_session_recorded';

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateBaseOnline(): number {
  const hour = new Date().getHours();
  // Dynamic realistic active users based on time of day
  if (hour >= 0 && hour < 6) {
    return Math.floor(Math.random() * 3) + 3; // 3 - 5
  } else if (hour >= 6 && hour < 12) {
    return Math.floor(Math.random() * 6) + 7; // 7 - 12
  } else if (hour >= 12 && hour < 18) {
    return Math.floor(Math.random() * 7) + 9; // 9 - 15
  } else {
    // Evening peak (18h - 24h)
    return Math.floor(Math.random() * 8) + 11; // 11 - 18
  }
}

function getInitialStats(): VisitorStats {
  const todayStr = getLocalDateString();
  const hour = new Date().getHours();
  // Initial believable baseline for the circus exhibition
  const initialYesterday = 248;
  const initialToday = Math.max(35, Math.floor(initialYesterday * (hour / 24) * 0.85) + Math.floor(Math.random() * 12));
  const initialTotal = 3890 + initialToday;

  return {
    online: calculateBaseOnline(),
    today: initialToday,
    yesterday: initialYesterday,
    total: initialTotal,
    lastDate: todayStr,
  };
}

let currentStats: VisitorStats = getInitialStats();
const listeners = new Set<(stats: VisitorStats) => void>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener({ ...currentStats });
    } catch {
      /* ignore listener errors */
    }
  });
}

function loadAndSyncStats(): VisitorStats {
  if (typeof window === 'undefined') return currentStats;

  const todayStr = getLocalDateString();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<VisitorStats>;
      if (parsed && typeof parsed.today === 'number' && typeof parsed.total === 'number') {
        if (parsed.lastDate === todayStr) {
          // Same day: keep counts
          currentStats = {
            online: calculateBaseOnline(),
            today: parsed.today,
            yesterday: parsed.yesterday ?? 248,
            total: parsed.total,
            lastDate: todayStr,
          };
        } else {
          // New day transition (yesterday to today and to later)
          const newYesterday = parsed.today > 0 ? parsed.today : 248;
          const hour = new Date().getHours();
          const newToday = Math.max(20, Math.floor(newYesterday * (hour / 24) * 0.8) + Math.floor(Math.random() * 8));
          const newTotal = parsed.total + newToday;

          currentStats = {
            online: calculateBaseOnline(),
            today: newToday,
            yesterday: newYesterday,
            total: newTotal,
            lastDate: todayStr,
          };
          saveStats();
        }
      }
    } else {
      // First visit on device
      currentStats = getInitialStats();
      saveStats();
    }
  } catch {
    currentStats = getInitialStats();
  }

  // Register session visit if not yet counted for this session
  try {
    const sessionSeen = sessionStorage.getItem(SESSION_KEY);
    if (!sessionSeen) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      currentStats.today += 1;
      currentStats.total += 1;
      saveStats();
    }
  } catch {
    /* ignore session storage errors */
  }

  return currentStats;
}

function saveStats() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats));
  } catch {
    /* ignore storage quotas */
  }
}

// Initialize on module load in browser
if (typeof window !== 'undefined') {
  loadAndSyncStats();

  // Listen to changes across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        currentStats = {
          ...currentStats,
          today: parsed.today ?? currentStats.today,
          yesterday: parsed.yesterday ?? currentStats.yesterday,
          total: parsed.total ?? currentStats.total,
        };
        notify();
      } catch {
        /* noop */
      }
    }
  });

  // Soft online jitter every 15-25 seconds (±1 or ±2) to reflect live activity
  setInterval(() => {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.6 ? 2 : 1);
    const base = calculateBaseOnline();
    currentStats.online = Math.max(3, Math.min(base + delta, 30));

    // Occasionally simulate concurrent incoming visitor (every ~3-5 mins random chance)
    if (Math.random() < 0.12) {
      currentStats.today += 1;
      currentStats.total += 1;
      saveStats();
    }

    notify();
  }, 18000);
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
