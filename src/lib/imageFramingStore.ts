export interface ImageFramingConfig {
  zoom: number; // 50 to 200 (%)
  offsetX: number; // 0 to 100 (%) or px shift
  offsetY: number; // 0 to 100 (%) or px shift
  fitMode: 'cover' | 'contain';
  aspectRatio?: '16/10' | '16/9' | '4/3' | '1/1' | 'auto';
}

export const DEFAULT_FRAMING: ImageFramingConfig = {
  zoom: 100,
  offsetX: 50, // center
  offsetY: 50, // center
  fitMode: 'cover',
  aspectRatio: '16/10',
};

const STORAGE_KEY = 'pocket_circus_image_framings';

export const getImageFraming = (key: string): ImageFramingConfig => {
  if (typeof window === 'undefined') return { ...DEFAULT_FRAMING };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FRAMING };
    const parsed = JSON.parse(raw);
    return parsed[key] ? { ...DEFAULT_FRAMING, ...parsed[key] } : { ...DEFAULT_FRAMING };
  } catch {
    return { ...DEFAULT_FRAMING };
  }
};

export const saveImageFraming = (key: string, config: ImageFramingConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    // Dispatch custom event so all listeners update immediately
    window.dispatchEvent(new CustomEvent('circus-image-framing-updated', { detail: { key, config } }));
  } catch {
    // ignore
  }
};

export const resetImageFraming = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    delete parsed[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new CustomEvent('circus-image-framing-updated', { detail: { key, config: DEFAULT_FRAMING } }));
  } catch {
    // ignore
  }
};
