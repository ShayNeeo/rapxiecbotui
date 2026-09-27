// Global Scroll Position Preserver for Pocket Circus Vietnam
// Preserves both vertical window scroll and horizontal (sideways) scroll positions across visits and exits.

const STAGE_SCROLL_KEY = 'circus_stage_scroll_y';
const HORIZONTAL_SCROLL_PREFIX = 'circus_scroll_x_';

let isRestoring = false;
let userScrolledManually = false;

// 1. Get and Save Vertical Scroll
export function saveStageScrollY(scrollY?: number): void {
  if (typeof window === 'undefined') return;
  const y = typeof scrollY === 'number' ? scrollY : window.scrollY;
  try {
    sessionStorage.setItem(STAGE_SCROLL_KEY, String(y));
  } catch {
    /* ignore */
  }
}

export function getSavedStageScrollY(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = sessionStorage.getItem(STAGE_SCROLL_KEY);
    return val ? Number(val) : 0;
  } catch {
    return 0;
  }
}

export function restoreStageScrollY(): void {
  if (typeof window === 'undefined') return;
  const targetY = getSavedStageScrollY();
  if (targetY <= 0) return;

  isRestoring = true;
  userScrolledManually = false;

  const attemptScroll = () => {
    if (userScrolledManually) return;
    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = targetY;
    if (document.body) document.body.scrollTop = targetY;
  };

  attemptScroll();
  requestAnimationFrame(attemptScroll);

  setTimeout(attemptScroll, 40);
  setTimeout(attemptScroll, 120);
  setTimeout(() => {
    attemptScroll();
    isRestoring = false;
  }, 250);
}

// 2. Horizontal Scroll Management (Sideways items on the website)
function getElementKey(el: HTMLElement, index: number): string {
  if (el.dataset.scrollId) {
    return el.dataset.scrollId;
  }
  if (el.id) {
    return el.id;
  }
  // Deterministic tag + class signature
  const parentId = el.parentElement?.id || el.parentElement?.className?.slice(0, 20) || 'root';
  const tag = el.tagName.toLowerCase();
  return `${parentId}_${tag}_${index}_${el.className.slice(0, 30)}`;
}

export function saveHorizontalScroll(el: HTMLElement, index: number = 0): void {
  if (typeof window === 'undefined' || !el) return;
  const key = getElementKey(el, index);
  try {
    sessionStorage.setItem(`${HORIZONTAL_SCROLL_PREFIX}${key}`, String(el.scrollLeft));
  } catch {
    /* ignore */
  }
}

export function restoreHorizontalScroll(el: HTMLElement, index: number = 0): void {
  if (typeof window === 'undefined' || !el) return;
  const key = getElementKey(el, index);
  try {
    const saved = sessionStorage.getItem(`${HORIZONTAL_SCROLL_PREFIX}${key}`);
    if (saved) {
      const scrollLeft = Number(saved);
      if (scrollLeft > 0) {
        el.scrollLeft = scrollLeft;
        requestAnimationFrame(() => {
          el.scrollLeft = scrollLeft;
        });
      }
    }
  } catch {
    /* ignore */
  }
}

// Scan and restore all horizontal scroll containers on page
export function restoreAllHorizontalScrolls(): void {
  if (typeof document === 'undefined') return;
  const elements = document.querySelectorAll<HTMLElement>('.overflow-x-auto, [data-scroll-id]');
  elements.forEach((el, index) => {
    restoreHorizontalScroll(el, index);
  });
}

// Initialize global auto-listener
if (typeof window !== 'undefined') {
  // Listen for user wheel/touch to avoid overriding manual scroll during restore
  const handleUserTouch = () => {
    if (!isRestoring) {
      userScrolledManually = true;
    }
  };
  window.addEventListener('wheel', handleUserTouch, { passive: true });
  window.addEventListener('touchmove', handleUserTouch, { passive: true });

  // Passive listener on all horizontal scroll elements
  const attachedElements = new WeakSet<HTMLElement>();

  const attachHorizontalScrollListeners = () => {
    const elements = document.querySelectorAll<HTMLElement>('.overflow-x-auto, [data-scroll-id]');
    elements.forEach((el, index) => {
      if (!attachedElements.has(el)) {
        attachedElements.add(el);
        // Restore previous position
        restoreHorizontalScroll(el, index);

        // Listen for scroll changes
        el.addEventListener(
          'scroll',
          () => {
            saveHorizontalScroll(el, index);
          },
          { passive: true }
        );
      }
    });
  };

  // Run on DOM loaded and on mutation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHorizontalScrollListeners);
  } else {
    attachHorizontalScrollListeners();
  }

  // MutationObserver to catch dynamically rendered carousels/lists
  const observer = new MutationObserver(() => {
    attachHorizontalScrollListeners();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}
