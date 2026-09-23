export type Language = 'vi' | 'en';

export type CircusActId = 
  | 'stage' 
  | 'about'
  | 'promo'
  | 'archive'
  | 'history'
  | 'circus3d'
  | 'quiz'
  | 'map'
  | 'ticket'
  | 'chat';

export interface CircusBadge {
  id: string;
  name: string;
  vietnameseName: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  unlocked: boolean;
}

export interface CircusPerformance {
  id: CircusActId;
  title: string;
  subtitle: string;
  character: string;
  difficulty: 'Dễ' | 'Trung Bình' | 'Thử Thách';
  score: number;
  highScore: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
  triviaFact: string;
  triviaFactEn?: string;
}

export interface CircusVenue {
  id: string;
  name: string;
  nameEn?: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  city: string;
  cityEn?: string;
  address: string;
  addressEn?: string;
  establishedYear: number;
  eraId: string;
  eraName: string;
  eraNameEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  description: string;
  descriptionEn?: string;
  icon: string;
  latRatio: number; // 0 to 1 for visual SVG pin positioning
  lonRatio: number;
  mapUrl?: string;
}

export interface HistoryDetailedItem {
  name: string;
  nameEn?: string;
  artists?: string;
  artistsEn?: string;
  achievement: string;
  achievementEn?: string;
  badge?: string;
  badgeEn?: string;
}

export interface HistoryDetailedSection {
  number: number;
  title: string;
  titleEn?: string;
  categoryBadge?: string;
  categoryBadgeEn?: string;
  icon?: string;
  summary?: string;
  summaryEn?: string;
  items?: HistoryDetailedItem[];
}

export interface HistorySubsection {
  id: string;
  tag?: string;
  tagEn?: string;
  title: string;
  titleEn?: string;
  period?: string;
  periodEn?: string;
  description: string;
  descriptionEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  figures?: string[];
  figuresEn?: string[];
  icon?: string;
  structuredSections?: HistoryDetailedSection[];
  quote?: string;
  quoteAuthor?: string;
  quoteEn?: string;
  quoteAuthorEn?: string;
}

export interface HistoryFeaturedQuote {
  quote: string;
  quoteEn?: string;
  author: string;
  authorEn?: string;
  context?: string;
  contextEn?: string;
}

export interface HistoryEra {
  id: string;
  era: string;
  eraEn?: string;
  period: string;
  periodEn?: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  keyFigures: string[];
  keyFiguresEn?: string[];
  quote?: string;
  quoteEn?: string;
  featuredQuotes?: HistoryFeaturedQuote[];
  imageIcon: string;
  sectionNumber?: string;
  referenceLinks?: { title: string; url: string }[];
  subsections?: HistorySubsection[];
  sections?: { heading: string; headingEn?: string; items: string[]; itemsEn?: string[] }[];
  videoUrl?: string;
  videoTitle?: string;
}
