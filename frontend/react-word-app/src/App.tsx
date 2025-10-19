import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Sparkles,
  Moon,
  Sun,
  Zap,
  X,
  Volume2,
  Copy,
  Plus,
  Check,
  Filter,
  Puzzle,
  List,
  TrendingUp
} from 'lucide-react';
import WordSearch from './components/WordSearch';
import WordResults from './components/WordResults';
import AdvancedSearch from './components/AdvancedSearch';
import PuzzleSolver from './components/PuzzleSolver';
import BrowseWords from './components/BrowseWords';
import PerformanceStats from './components/PerformanceStats';
import BackgroundEffects from './components/BackgroundEffects';
import Dashboard from './components/Dashboard';
import FloatingWords from './components/FloatingWords';
import { wordService } from './services/WordService';
import type { WordStats, SearchResult } from './types/WordTypes';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween' as any,
  ease: 'anticipate' as any,
  duration: 0.5
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut' as any
    }
  }
};

const App: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced' | 'puzzle' | 'browse' | 'dashboard'>('dashboard');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [wordStats, setWordStats] = useState<WordStats | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Using the exported wordService instance

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    fetchWordStats();
  }, []);

  const fetchWordStats = async () => {
    try {
      const stats = await wordService.getWordStats();
      setWordStats(stats);
    } catch (err) {
      console.error('Failed to fetch word stats:', err);
      setError('Failed to load word statistics.');
    }
  };

  const handleSearch = async (word: string, filters?: any, length?: number, pattern?: string) => {
    setIsSearching(true);
    setSearchResult(null);
    setError(null);
    try {
      let result: SearchResult | string[] | null = null;
      if (searchMode === 'basic') {
        result = await wordService.searchBasicWord(word);
        setSearchResult(result as SearchResult);
      } else if (searchMode === 'advanced' && filters) {
        result = await wordService.getFilteredWords(filters);
            setSearchResult({ word: 'Filtered Results', inCollection: false, oxford: undefined, filteredWords: result as string[] });
      } else if (searchMode === 'puzzle' && length && pattern) {
        result = await wordService.getInteractiveWords(length, pattern);
        setSearchResult({ word: 'Puzzle Results', inCollection: false, oxford: undefined, filteredWords: result as string[] });
      } else if (searchMode === 'browse' && length) {
        const browseResult = await wordService.getWordsByLength(length);
        setSearchResult({ word: `Words of length ${length}`, inCollection: false, oxford: undefined, filteredWords: browseResult.words });
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.detail || 'An unexpected error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddWord = async (word: string) => {
    try {
      const response = await wordService.addWordWithValidation(word);
      if (response.success) {
        alert(`Word "${word}" ${response.was_new ? 'added' : 'already exists'}!`);
        fetchWordStats(); // Refresh stats after adding word
      } else {
        alert(`Failed to add word: ${response.message}`);
      }
    } catch (err: any) {
      console.error('Failed to add word:', err);
      alert(`Error adding word: ${err.response?.data?.detail || 'An unexpected error occurred.'}`);
    }
  };

  const handleExploreWord = async (word: string) => {
    setSearchMode('basic');
    handleSearch(word);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const fetchPerformanceStats = async () => {
    try {
      const stats = await wordService.getPerformanceStats();
      setPerformanceStats(stats);
      setShowPerformanceStats(true);
    } catch (err) {
      console.error('Failed to fetch performance stats:', err);
      setError('Failed to load performance statistics.');
    }
  };

  const searchModes = [
    { key: 'dashboard', label: '🏠 Home', icon: TrendingUp, component: Dashboard, description: 'Your word adventure hub!' },
    { key: 'basic', label: '🔍 Search', icon: Search, component: WordSearch, description: 'Find amazing words!' },
    { key: 'advanced', label: '🎯 Filter', icon: Filter, component: AdvancedSearch, description: 'Find words by patterns!' },
    { key: 'puzzle', label: '🧩 Puzzle', icon: Puzzle, component: PuzzleSolver, description: 'Solve word puzzles!' },
    { key: 'browse', label: '📚 Browse', icon: List, component: BrowseWords, description: 'Explore by length!' },
  ];

  const CurrentSearchComponent = searchModes.find(mode => mode.key === searchMode && mode.key !== 'dashboard')?.component || WordSearch;

  return (
    <div className="min-h-screen">
      {/* Starfall-style Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="starfall-header"
      >
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white"
            >
              ←
            </motion.button>
            <h1 className="starfall-logo">
              Word<span className="text-yellow-400">★</span>Explorer
            </h1>
          </div>

          {/* Center - Stats */}
          <div className="stats-container text-white">
            <div className="stat-item">
              <div className="stat-value">{wordStats?.total_words?.toLocaleString() || '0'}</div>
              <div className="stat-label">Total Words</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{wordStats?.avg_length?.toFixed(1) || '0.0'}</div>
              <div className="stat-label">Avg Length</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{wordStats?.max_length || '0'}</div>
              <div className="stat-label">Max Length</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{wordStats?.min_length || '0'}</div>
              <div className="stat-label">Min Length</div>
            </div>
          </div>

          {/* Right side - Menu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white text-2xl"
          >
            ☰
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content - Horizontal Word Search */}
      <main className="container mx-auto px-6 py-8">
        {/* Word Search Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Word Search</h2>
          
          {/* Horizontal Search Options */}
          <div className="flex flex-row justify-center items-center gap-2 mb-8 max-w-6xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchMode('basic')}
              className="starfall-activity-button horizontal"
            >
              <span className="starfall-character text-2xl">🔍</span>
              <div>
                <div className="starfall-button-title">Basic Search</div>
                <div className="starfall-button-subtitle">Find any word</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchMode('advanced')}
              className="starfall-activity-button horizontal"
            >
              <span className="starfall-character text-2xl">🎯</span>
              <div>
                <div className="starfall-button-title">Advanced Filter</div>
                <div className="starfall-button-subtitle">Smart word finder</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchMode('browse')}
              className="starfall-activity-button horizontal"
            >
              <span className="starfall-character text-2xl">📚</span>
              <div>
                <div className="starfall-button-title">Browse Words</div>
                <div className="starfall-button-subtitle">Explore by length</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchMode('puzzle')}
              className="starfall-activity-button horizontal"
            >
              <span className="starfall-character text-2xl">🧩</span>
              <div>
                <div className="starfall-button-title">Word Puzzles</div>
                <div className="starfall-button-subtitle">Solve fun puzzles</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Basic Search Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="starfall-column">
            <h3 className="starfall-column-title mb-6">Search for Words</h3>
            
            {searchMode === 'basic' && (
              <WordSearch onSearch={handleSearch} isSearching={isSearching} />
            )}
            {searchMode === 'advanced' && (
              <AdvancedSearch onSearch={handleSearch} isSearching={isSearching} />
            )}
            {searchMode === 'browse' && (
              <BrowseWords onSearch={handleSearch} isSearching={isSearching} />
            )}
            {searchMode === 'puzzle' && (
              <PuzzleSolver onSearch={handleSearch} isSearching={isSearching} />
            )}
          </div>
        </motion.div>
      </main>

      {/* Search Results Modal */}
      <AnimatePresence mode="wait">
        {searchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <WordResults
                result={searchResult}
                onAddWord={async (word: string) => {
                  try {
                    const response = await wordService.addWordWithValidation(word);
                    if (response.success) {
                      alert(`Word "${word}" ${response.was_new ? 'added' : 'already exists'}!`);
                      fetchWordStats();
                    } else {
                      alert(`Failed to add word: ${response.message}`);
                    }
                    return response;
                  } catch (err: any) {
                    console.error('Failed to add word:', err);
                    alert(`Error adding word: ${err.response?.data?.detail || 'An unexpected error occurred.'}`);
                    throw err;
                  }
                }}
                onExploreWord={handleExploreWord}
              />
              <motion.button
                onClick={() => setSearchResult(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50"
          >
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Stats Modal */}
      <AnimatePresence>
        {showPerformanceStats && (
          <PerformanceStats
            stats={performanceStats}
            onClose={() => setShowPerformanceStats(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;