import bannerImg from "@/src/assets/images/circus_history_banner_1790173992374.jpg";

export interface HistoryPhoto {
  id: string;
  url: string;
  caption: string;
  captionEn?: string;
  eraId: string; // 'overview' | 'ancient-circus' | 'classical-circus' | 'contemporary-circus' | 'vietnam-century-circus'
  isCover?: boolean;
  isDefault?: boolean;
  dateAdded?: string;
}

export const DEFAULT_OVERVIEW_COVER = bannerImg;

// All 4 milestones initially have NO cover photo (empty by default as requested)
export const DEFAULT_MILESTONE_PHOTOS: Record<string, HistoryPhoto[]> = {
  "ancient-circus": [],
  "classical-circus": [],
  "contemporary-circus": [],
  "vietnam-century-circus": [],
};

const STORAGE_KEY_COVER = "circus_history_custom_cover";
const STORAGE_KEY_MILESTONE_COVERS = "circus_history_milestone_covers_v2";
const STORAGE_KEY_PHOTOS = "circus_history_custom_photos_v2";

export function getOverviewCover(): string {
  if (typeof window === "undefined") return DEFAULT_OVERVIEW_COVER;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_COVER);
    if (saved) return saved;
  } catch {}
  return DEFAULT_OVERVIEW_COVER;
}

export function saveOverviewCover(url: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_COVER, url);
  } catch (e) {
    console.warn("Error saving cover", e);
  }
}

export function resetOverviewCover(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_COVER);
  } catch {}
}

export function getMilestoneCover(eraId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONE_COVERS);
    if (saved) {
      const map = JSON.parse(saved);
      if (map[eraId]) return map[eraId];
    }
  } catch {}
  return null;
}

export function saveMilestoneCover(eraId: string, url: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONE_COVERS);
    const map = saved ? JSON.parse(saved) : {};
    map[eraId] = url;
    localStorage.setItem(STORAGE_KEY_MILESTONE_COVERS, JSON.stringify(map));
  } catch (e) {
    console.warn("Failed to save milestone cover", e);
  }
}

export function removeMilestoneCover(eraId: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONE_COVERS);
    if (saved) {
      const map = JSON.parse(saved);
      delete map[eraId];
      localStorage.setItem(STORAGE_KEY_MILESTONE_COVERS, JSON.stringify(map));
    }
  } catch (e) {
    console.warn("Failed to remove milestone cover", e);
  }
}

export function getMilestonePhotos(eraId: string): HistoryPhoto[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (saved) {
      const allCustom: HistoryPhoto[] = JSON.parse(saved);
      return allCustom.filter((p) => p.eraId === eraId);
    }
  } catch {}

  return [];
}

export function addCustomPhoto(photo: Omit<HistoryPhoto, "id" | "dateAdded">): HistoryPhoto {
  const newPhoto: HistoryPhoto = {
    ...photo,
    id: `custom-photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    dateAdded: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      const current: HistoryPhoto[] = saved ? JSON.parse(saved) : [];
      const updated = [newPhoto, ...current];
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to store custom photo in localStorage", e);
    }
  }

  return newPhoto;
}

export function deleteCustomPhoto(photoId: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (saved) {
      const current: HistoryPhoto[] = saved ? JSON.parse(saved) : [];
      const updated = current.filter((p) => p.id !== photoId);
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn("Failed to remove custom photo", e);
  }
}
