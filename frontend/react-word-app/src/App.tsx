import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, TrendingUp, X, ChevronDown, Loader, Menu, Sun, Moon, Palette } from 'lucide-react';
import { wordService } from './services/WordService';
import type { SearchResult, WordStats } from './types/WordTypes';
import WordResults from './components/WordResults';
import FloatingParticles from './components/FloatingParticles';
import MagicalEffects from './components/MagicalEffects';
import ThemeSelector from './components/ThemeSelector';
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
      {/* Magical Header */}
      <header className="kid-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              className="p-2 rounded-full hover:bg-black/10 transition-all" 
              aria-label="Back"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">←</span>
            </motion.button>
            <motion.div 
              className="kid-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Word★Explorer
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              isOpen={isThemeSelectorOpen}
              onToggle={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
            />
            <nav className="hidden md:flex items-center gap-3">
              <button className="nav-item">Apps</button>
              <button className="nav-item">Store</button>
              <button className="nav-item">Parents & Teachers</button>
              <button className="nav-item">How to Join</button>
              <button className="nav-item">Sign In</button>
            </nav>
            <button className="md:hidden p-2 rounded-full hover:bg-black/10 transition-all" aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Kid-Friendly Main */}
      <main className="kid-main">
        <div className="kid-columns">
          {/* Left Column - Stats */}
          <aside>
            {wordStats && (
              <div className="kid-stats">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  📊 Database Stats
                </h2>
                <div className="space-y-4">
                  <div className="kid-stat-item transform hover:scale-105 transition-all duration-300">
                    <span className="kid-stat-label">✨ Total Words:</span>
                    <span className="kid-stat-value bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold">
                      {wordStats.total_words.toLocaleString()}
                    </span>
                  </div>
                  <div className="kid-stat-item transform hover:scale-105 transition-all duration-300">
                    <span className="kid-stat-label">📏 Average Length:</span>
                    <span className="kid-stat-value bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-bold">
                      {wordStats.avg_length.toFixed(2)} letters
                    </span>
                  </div>
                  <div className="kid-stat-item transform hover:scale-105 transition-all duration-300">
                    <span className="kid-stat-label">🔤 Shortest Word:</span>
                    <span className="kid-stat-value bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold">
                      {wordStats.min_length} letter
                    </span>
                  </div>
                  <div className="kid-stat-item transform hover:scale-105 transition-all duration-300">
                    <span className="kid-stat-label">📚 Longest Word:</span>
                    <span className="kid-stat-value bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-bold">
                      {wordStats.max_length} letters
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
          {/* Main Content - Search Section */}
          <section>
            {/* Highlighted Search Section */}
            <div className="kid-search-section">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  ✨ Word Search Adventure ✨
                </h2>
                <p className="text-xl opacity-90 font-medium">Discover the magic of words with our interactive explorer</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="text-2xl animate-bounce">🌟</span>
                  <span className="text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>📚</span>
                  <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🎯</span>
                  <span className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🚀</span>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type any word to explore..."
                    className="kid-input"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <Loader className="absolute right-4 top-4 w-6 h-6 animate-spin" />
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSearching || !searchTerm.trim()}
                  className="kid-button w-full"
                >
                  {isSearching ? 'Searching...' : '🚀 Search Word'}
                </button>
              </form>

              {/* Quick Suggestions */}
              <div className="mt-8">
                <p className="text-xl mb-6 font-bold text-center">✨ Try these magical words ✨</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {['hello', 'world', 'python', 'javascript', 'beautiful'].map((word, index) => (
                    <button
                      key={word}
                      onClick={() => {
                        playSound('click');
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
                      <span className="mr-2">✨</span>
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-8">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="kid-button w-full"
                >
                  <Filter className="w-5 h-5 mr-2 inline" />
                  Advanced Filters
                  <ChevronDown className={`w-5 h-5 ml-2 inline transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-3 font-semibold">Min Length</label>
                          <input
                            type="number"
                            value={filters.minLength}
                            onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                            className="kid-input"
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-3 font-semibold">Max Length</label>
                          <input
                            type="number"
                            value={filters.maxLength}
                            onChange={(e) => setFilters({...filters, maxLength: e.target.value})}
                            className="kid-input"
                            placeholder="20"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-3 font-semibold">Starts With</label>
                        <input
                          type="text"
                          value={filters.startsWith}
                          onChange={(e) => setFilters({...filters, startsWith: e.target.value})}
                          className="kid-input"
                          placeholder="e.g., un"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-3 font-semibold">Ends With</label>
                        <input
                          type="text"
                          value={filters.endsWith}
                          onChange={(e) => setFilters({...filters, endsWith: e.target.value})}
                          className="kid-input"
                          placeholder="e.g., ing"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-3 font-semibold">Contains</label>
                        <input
                          type="text"
                          value={filters.contains}
                          onChange={(e) => setFilters({...filters, contains: e.target.value})}
                          className="kid-input"
                          placeholder="e.g., tion"
                        />
                      </div>
                      
                      <button
                        onClick={handleFilterSearch}
                        disabled={isSearching}
                        className="kid-button w-full"
                      >
                        Apply Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

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
