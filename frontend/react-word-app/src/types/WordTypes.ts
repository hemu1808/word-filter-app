export interface WordStats {
  total_words: number;
  min_length: number;
  max_length: number;
  avg_length: number;
}

export interface WordFilter {
  contains?: string;
  starts_with?: string;
  ends_with?: string;
  min_length?: number;
  max_length?: number;
  exact_length?: number;
  exclude_letters?: string;
  limit?: number;
}

export interface OxfordData {
  definitions: string[];
  pronunciations: {
    prefix?: string;
    ipa: string;
    url?: string;
  }[];
  examples: string[];
  synonyms: string[];
  word_forms: string[];
}

export interface SearchResult {
  word: string;
  inCollection: boolean;
  oxford?: OxfordData;
  filteredWords?: string[]; // For advanced, puzzle, browse results
}

export interface AddWordResponse {
  success: boolean;
  message: string;
  was_new: boolean;
}

export interface PerformanceStats {
  words_loaded: number;
  thread_pool_workers: number;
  process_pool_workers: number;
  memory_usage: {
    words_list_size: number;
    words_set_size: number;
  };
  optimization_features: string[];
}

export interface InteractiveSearchParams {
  word_length: number;
  pattern: string;
}

export interface WordsByLengthResponse {
  words: string[];
  count: number;
}

export type SearchMode = 'basic' | 'advanced' | 'puzzle' | 'browse';

export interface QuickSuggestion {
  word: string;
  category: 'fun' | 'common' | 'challenging';
}

export interface WordCardProps {
  word: string;
  definition?: string;
  pronunciation?: string;
  synonyms?: string[];
  examples?: string[];
  isInCollection?: boolean;
  onAddToCollection?: (word: string) => void;
  onExplore?: (word: string) => void;
  className?: string;
}

export interface SearchComponentProps {
  onSearch: (word: string) => void;
  isSearching: boolean;
  className?: string;
}

export interface ResultsComponentProps {
  result: SearchResult;
  onAddWord: (word: string) => void;
  onExploreWord: (word: string) => void;
  className?: string;
}

export interface DialogSize {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
}

export interface AnimationVariants {
  initial: any;
  animate: any;
  exit: any;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface WordServiceConfig {
  baseURL: string;
}

export interface SearchHistoryItem {
  word: string;
  timestamp: Date;
  result: SearchResult;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  searchMode: SearchMode;
  showPerformanceStats: boolean;
  enableAnimations: boolean;
  searchHistory: SearchHistoryItem[];
}
