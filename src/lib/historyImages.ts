import bannerImg from "@/src/assets/images/kham_pha_lich_su_cover_muc_tim.jpg";
import milestone1CoverImg from "@/src/assets/images/milestone_1_ancient_circus_cover.jpg";
import milestone2CoverImg from "@/src/assets/images/milestone_2_classical_circus_cover.jpg";
import philipAstleyImg from "@/src/assets/images/philip_astley_classical_circus.jpg";
import milestone3CoverImg from "@/src/assets/images/milestone_3_contemporary_circus_cover.jpg";
import milestone4CoverImg from "@/src/assets/images/milestone_4_vietnam_century_circus_cover.jpg";

export interface HistoryPhoto {
  id: string;
  url: string;
  caption: string;
  captionEn?: string;
  sourceUrl?: string;
  eraId: string; // 'overview' | 'ancient-circus' | 'classical-circus' | 'contemporary-circus' | 'vietnam-century-circus'
  isCover?: boolean;
  isDefault?: boolean;
  dateAdded?: string;
}

export const DEFAULT_OVERVIEW_COVER = bannerImg;

export const DEFAULT_MILESTONE_COVERS: Record<string, string> = {
  "ancient-circus": milestone1CoverImg,
  "classical-circus": philipAstleyImg,
  "contemporary-circus": milestone3CoverImg,
  "vietnam-century-circus": milestone4CoverImg,
};

// Default milestone gallery photos
export const DEFAULT_MILESTONE_PHOTOS: Record<string, HistoryPhoto[]> = {
  "ancient-circus": [
    {
      id: "photo-milestone-1-cover",
      url: milestone1CoverImg,
      caption: "Nguồn gốc xiếc thời cổ đại",
      captionEn: "Ancient circus origins",
      sourceUrl: "https://en.baodanang.vn/nguoi-sang-tao-rap-xiec-hien-dai-3282905.html",
      eraId: "ancient-circus",
      isCover: true,
      isDefault: true,
    }
  ],
  "classical-circus": [
    {
      id: "photo-philip-astley-classical-circus",
      url: philipAstleyImg,
      caption: "Philip Astley (1742 – 1814) – Kỵ sĩ người Anh, Cha đẻ của Nghệ thuật Xiếc Cổ điển (1768)",
      captionEn: "Philip Astley (1742 – 1814) – English equestrian master, Father of Classical Circus (1768)",
      sourceUrl: "https://www.alamy.com",
      eraId: "classical-circus",
      isCover: true,
      isDefault: true,
    },
    {
      id: "photo-milestone-2-cover",
      url: milestone2CoverImg,
      caption: "Tư liệu nghệ thuật xiếc cổ điển",
      captionEn: "Classical circus archival photo",
      sourceUrl: "https://36pho.com/xiec-o-ha-noi-xua-1936.html",
      eraId: "classical-circus",
      isCover: false,
      isDefault: true,
    }
  ],
  "contemporary-circus": [
    {
      id: "photo-milestone-3-cover",
      url: milestone3CoverImg,
      caption: "Nguồn gốc xiếc đương đại",
      captionEn: "Contemporary circus origins",
      sourceUrl: "https://chinhsachcuocsong.vnanet.vn/nghe-thuat-xiec-qua-goc-nhin-cua-nghe-sy-nhiep-anh-nha-bao-thanh-ha/16876.html",
      eraId: "contemporary-circus",
      isCover: true,
      isDefault: true,
    }
  ],
  "vietnam-century-circus": [
    {
      id: "photo-milestone-4-cover",
      url: milestone4CoverImg,
      caption: "Hành trình 100 năm: Sự hình thành các gánh xiếc bản địa",
      captionEn: "100-Year Journey: Formation of Indigenous Vietnamese Circus Troupes",
      sourceUrl: "https://arttimes.vn/san-khau-dien-anh/ky-niem-100-nam-xiec-viet-nam-ton-vinh-ong-to-cua-nganh-xiec-chuyen-nghiep-c17a18668.html",
      eraId: "vietnam-century-circus",
      isCover: true,
      isDefault: true,
    }
  ],
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
  const defaultCover = DEFAULT_MILESTONE_COVERS[eraId] || null;
  if (typeof window === "undefined") return defaultCover;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONE_COVERS);
    if (saved) {
      const map = JSON.parse(saved);
      if (map[eraId] === "__REMOVED__") return null;
      if (map[eraId] && !map[eraId].includes("milestone_2_classical_circus_cover.jpg")) {
        return map[eraId];
      }
    }
  } catch {}
  return defaultCover;
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
    const map = saved ? JSON.parse(saved) : {};
    map[eraId] = "__REMOVED__";
    localStorage.setItem(STORAGE_KEY_MILESTONE_COVERS, JSON.stringify(map));
  } catch (e) {
    console.warn("Failed to remove milestone cover", e);
  }
}

export function getMilestonePhotos(eraId: string): HistoryPhoto[] {
  const defaultList = DEFAULT_MILESTONE_PHOTOS[eraId] || [];
  if (typeof window === "undefined") return defaultList;

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (saved) {
      const allCustom: HistoryPhoto[] = JSON.parse(saved);
      const customForEra = allCustom.filter((p) => p.eraId === eraId);
      if (customForEra.length > 0) {
        if (eraId === "classical-circus" && !customForEra.some(p => p.id === "photo-philip-astley-classical-circus" || p.url.includes("philip_astley"))) {
          return [defaultList[0], ...customForEra];
        }
        return customForEra;
      }
      return defaultList;
    }
  } catch {}

  return defaultList;
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
