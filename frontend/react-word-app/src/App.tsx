import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, TrendingUp, X, ChevronDown, Loader, Menu, Sun, Moon, Palette } from 'lucide-react';
import { wordService } from './services/WordService';
import type { SearchResult, WordStats } from './types/WordTypes';
import WordResults from './components/WordResults';
import FloatingParticles from './components/FloatingParticles';
import MagicalEffects from './components/MagicalEffects';
import RefinedHeader from './components/RefinedHeader';
import RefinedSearchSection from './components/RefinedSearchSection';
import RefinedStats from './components/RefinedStats';
import useSound from './hooks/useSound';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [wordStats, setWordStats] = useState<WordStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const { playSound } = useSound();
  const [filters, setFilters] = useState({
    minLength: '',
    maxLength: '',
    startsWith: '',
    endsWith: '',
    contains: ''
  });

  useEffect(() => {
    fetchWordStats();
  }, []);

  const fetchWordStats = async () => {
    try {
      const stats = await wordService.getWordStats();
      setWordStats(stats);
    } catch (err) {
      console.error('Failed to fetch word stats:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    playSound('magic');
    setIsSearching(true);
    setError(null);
    try {
      const result = await wordService.searchBasicWord(searchTerm.trim());
      setSearchResult(result);
      playSound('success');
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.detail || 'Search failed. Please try again.');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterSearch = useCallback(async () => {
    setIsSearching(true);
    setError(null);
    try {
      const filterParams: any = {};
      if (filters.minLength) filterParams.min_length = parseInt(filters.minLength);
      if (filters.maxLength) filterParams.max_length = parseInt(filters.maxLength);
      if (filters.startsWith) filterParams.starts_with = filters.startsWith;
      if (filters.endsWith) filterParams.ends_with = filters.endsWith;
      if (filters.contains) filterParams.contains = filters.contains;

      const words = await wordService.getFilteredWords(filterParams);
      setSearchResult({
        query: 'Filtered Results',
        found: words.length > 0,
        word: words[0] || null,
        filteredWords: words
      });
    } catch (err: any) {
      console.error('Filter search failed:', err);
      setError('Filter search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  const handleAddWord = async (word: string) => {
    try {
      const response = await wordService.addWordWithValidation(word);
      if (response.success) {
        fetchWordStats();
      }
      return response;
    } catch (err: any) {
      console.error('Failed to add word:', err);
      throw err;
    }
  };

  const handleExploreWord = (word: string) => {
    setSearchTerm(word);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleThemeChange = (theme: string) => {
    playSound('theme');
    setCurrentTheme(theme);
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  };

  return (
    <div className={`kid-page ${currentTheme} ${isDarkMode ? 'dark' : ''}`}>
      <FloatingParticles />
      <MagicalEffects theme={currentTheme} />
      {/* Refined Header */}
      <RefinedHeader
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        isThemeSelectorOpen={isThemeSelectorOpen}
        onThemeToggle={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
        onBack={() => window.history.back()}
        onMenu={() => {}}
        onSettings={() => {}}
      />

      {/* Refined Main Content */}
      <main className="kid-main">
        <div className="kid-columns">
          {/* Left Column - Refined Stats */}
          <RefinedStats wordStats={wordStats} />
          
          {/* Main Content - Refined Search Section */}
          <RefinedSearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            isSearching={isSearching}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            onFilterSearch={handleFilterSearch}
            onSuggestionClick={(word) => {
              playSound('click');
              setSearchTerm(word);
              setTimeout(() => {
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }, 100);
            }}
          />

            {/* Results Section */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between"
              >
                <span className="text-sm font-semibold">{error}</span>
                <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {searchResult ? (
              searchResult.filteredWords && searchResult.filteredWords.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="kid-results"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🎯 Search Results</h3>
                    <span className="text-sm font-semibold">{searchResult.filteredWords.length.toLocaleString()} words found</span>
                  </div>
                  <div className="kid-results-list">
                    {searchResult.filteredWords.slice(0, 500).map((w, idx) => (
                      <div key={w + idx} className="kid-result-item" onClick={() => handleExploreWord(w)}>
                        <span className="font-semibold">{w}</span>
                        <span className="text-sm opacity-70">Click to explore →</span>
                      </div>
                    ))}
                  </div>
                  {searchResult.filteredWords.length > 500 && (
                    <p className="mt-3 text-sm opacity-70">Showing first 500 results. Use filters to narrow down!</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="kid-results"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">📖 Word Details</h3>
                  </div>
                  <WordResults
                    result={searchResult}
                    onAddWord={handleAddWord}
                    onExploreWord={handleExploreWord}
                  />
                </motion.div>
              )
            ) : (
              <div className="kid-empty">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Search className="w-20 h-20 mx-auto opacity-60 animate-pulse" />
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                    <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🌟</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    🌟 Start Your Word Adventure! 🌟
                  </h3>
                  <p className="text-lg mb-8 opacity-90">
                    Type any word above to discover its meaning, pronunciation, and more fun facts!
                  </p>
                  <div className="max-w-lg mx-auto">
                    <p className="text-lg mb-6 font-bold">✨ Try these exciting words ✨</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {['serendipity', 'ephemeral', 'eloquent', 'magnificent', 'wonderful'].map((word, index) => (
                        <button
                          key={word}
                          onClick={() => {
                            setSearchTerm(word);
                            setTimeout(() => {
                              const form = document.querySelector('form');
                              if (form) {
                                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                              }
                            }, 100);
                          }}
                          className="kid-chip transform hover:scale-110 transition-all duration-300"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <span className="mr-2">🎯</span>
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
