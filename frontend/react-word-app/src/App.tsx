import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, TrendingUp, X, ChevronDown, Loader, Menu, Sun, Moon } from 'lucide-react';
import { wordService } from './services/WordService';
import type { SearchResult, WordStats } from './types/WordTypes';
import WordResults from './components/WordResults';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [wordStats, setWordStats] = useState<WordStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

    setIsSearching(true);
    setError(null);
    try {
      const result = await wordService.searchBasicWord(searchTerm.trim());
      setSearchResult(result);
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

  return (
    <div className={`kid-page ${isDarkMode ? 'dark' : ''}`}>
      {/* Kid-Friendly Header */}
      <header className="kid-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-black/10 transition-all" aria-label="Back">
              <span className="text-2xl">←</span>
            </button>
            <div className="kid-logo">Word★Explorer</div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
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
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Database Stats
                </h2>
                <div className="space-y-3">
                  <div className="kid-stat-item">
                    <span className="kid-stat-label">Total Words:</span>
                    <span className="kid-stat-value">{wordStats.total_words.toLocaleString()}</span>
                  </div>
                  <div className="kid-stat-item">
                    <span className="kid-stat-label">Average Length:</span>
                    <span className="kid-stat-value">{wordStats.avg_length.toFixed(2)} letters</span>
                  </div>
                  <div className="kid-stat-item">
                    <span className="kid-stat-label">Shortest Word:</span>
                    <span className="kid-stat-value">{wordStats.min_length} letter</span>
                  </div>
                  <div className="kid-stat-item">
                    <span className="kid-stat-label">Longest Word:</span>
                    <span className="kid-stat-value">{wordStats.max_length} letters</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
          {/* Main Content - Search Section */}
          <section>
            {/* Highlighted Search Section */}
            <div className="kid-search-section">
              <h2 className="text-2xl font-bold mb-6 text-center">🔍 Word Search Adventure</h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
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
                    <Loader className="absolute right-3 top-3 w-5 h-5 animate-spin" />
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
              <div className="mt-6">
                <p className="text-sm mb-3 font-semibold">Try these fun words:</p>
                <div className="flex flex-wrap gap-2">
                  {['hello', 'world', 'python', 'javascript', 'beautiful'].map((word) => (
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
                      className="kid-chip"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="kid-button w-full"
                >
                  <Filter className="w-4 h-4 mr-2 inline" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 ml-2 inline transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-2 font-semibold">Min Length</label>
                          <input
                            type="number"
                            value={filters.minLength}
                            onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                            className="kid-input"
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 font-semibold">Max Length</label>
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
                        <label className="block text-sm mb-2 font-semibold">Starts With</label>
                        <input
                          type="text"
                          value={filters.startsWith}
                          onChange={(e) => setFilters({...filters, startsWith: e.target.value})}
                          className="kid-input"
                          placeholder="e.g., un"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2 font-semibold">Ends With</label>
                        <input
                          type="text"
                          value={filters.endsWith}
                          onChange={(e) => setFilters({...filters, endsWith: e.target.value})}
                          className="kid-input"
                          placeholder="e.g., ing"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2 font-semibold">Contains</label>
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
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">🌟 Start Your Word Adventure!</h3>
                <p className="mb-6">
                  Type any word above to discover its meaning, pronunciation, and more fun facts!
                </p>
                <div className="max-w-md mx-auto">
                  <p className="text-sm mb-4 font-semibold">Try these exciting words:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['serendipity', 'ephemeral', 'eloquent', 'magnificent', 'wonderful'].map((word) => (
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
                        className="kid-chip"
                      >
                        {word}
                      </button>
                    ))}
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
