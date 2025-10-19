import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, TrendingUp, X, ChevronDown, Loader, Menu } from 'lucide-react';
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
    <div className="ios-page">
      {/* iOS Header */}
      <header className="ios-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-all" aria-label="Back">
              <span className="text-white text-xl">←</span>
            </button>
            <div className="ios-logo">Word★Explorer</div>
          </div>
          <nav className="hidden md:flex items-center gap-3">
            <button className="nav-item">Apps</button>
            <button className="nav-item">Store</button>
            <button className="nav-item">Parents & Teachers</button>
            <button className="nav-item">How to Join</button>
            <button className="nav-item">Sign In</button>
          </nav>
          <button className="md:hidden p-2 rounded-full hover:bg-white/10 transition-all" aria-label="Menu">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* iOS Main */}
      <main className="ios-main">
        <h2 className="text-center text-white text-2xl font-semibold mb-8 opacity-90">Grades 1, 2, 3 — Language Arts & Music</h2>
        <div className="ios-columns">
          {/* Left Column - Tools */}
          <aside className="ios-panel">
            <div className="ios-panel-title">Tools</div>
            <div className="ios-panel-content">
              <div className="ios-grid">
                <button className="ios-activity" onClick={() => setShowFilters((v) => !v)}>
                  <span className="icon">⚙️</span>
                  <div>
                    <div className="title">Advanced Filters</div>
                    <div className="subtitle">Length, pattern, contains</div>
                  </div>
                </button>
                <button className="ios-activity" onClick={() => {
                  const sample = ['serendipity','galaxy','harmony','magnificent'];
                  setSearchTerm(sample[Math.floor(Math.random()*sample.length)]);
                  setTimeout(() => document.querySelector('form')?.dispatchEvent(new Event('submit', {cancelable:true,bubbles:true})), 50);
                }}>
                  <span className="icon">🎲</span>
                  <div>
                    <div className="title">Surprise Me</div>
                    <div className="subtitle">Search a random word</div>
                  </div>
                </button>
              </div>
            </div>
          </aside>
          {/* Center Column - Activities & Search */}
          <section className="space-y-6">
            <div className="ios-panel">
              <div className="ios-panel-title">Activities</div>
              <div className="ios-panel-content">
                <div className="ios-grid">
                  <button className="ios-activity" onClick={(e) => { e.preventDefault(); }}>
                    <span className="icon">🔍</span>
                    <div>
                      <div className="title">Basic Search</div>
                      <div className="subtitle">Look up any word</div>
                    </div>
                  </button>
                  <button className="ios-activity" onClick={() => setShowFilters(true)}>
                    <span className="icon">🎯</span>
                    <div>
                      <div className="title">Advanced</div>
                      <div className="subtitle">Smart filtering</div>
                    </div>
                  </button>
                  <button className="ios-activity" onClick={() => setFilters({ ...filters, minLength: '5', maxLength: '7' })}>
                    <span className="icon">📚</span>
                    <div>
                      <div className="title">Browse by Length</div>
                      <div className="subtitle">Quick presets</div>
                    </div>
                  </button>
                  <button className="ios-activity" onClick={() => setFilters({ ...filters, contains: 'tion' })}>
                    <span className="icon">🧩</span>
                    <div>
                      <div className="title">Pattern Match</div>
                      <div className="subtitle">Find by pattern</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* Search Card */}
            <div className="ios-panel">
              <div className="ios-panel-title">Quick Search</div>
              <div className="ios-panel-content">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter a word..."
                      className="ios-input"
                      disabled={isSearching}
                    />
                    {isSearching && (
                      <Loader className="absolute right-3 top-3 w-5 h-5 animate-spin text-white" />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSearching || !searchTerm.trim()}
                    className="ios-button w-full"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {/* Quick Suggestions */}
                <div className="mt-6">
                  <p className="text-sm text-white/80 mb-3">Quick suggestions:</p>
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
                        className="ios-chip"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Card */}
            <div className="ios-panel">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between text-lg font-semibold text-white mb-3 ios-panel-title"
              >
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-white" />
                  Advanced Filters
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform text-white ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-white/80 mb-2">Min Length</label>
                            <input
                              type="number"
                              value={filters.minLength}
                              onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                              className="ios-input"
                              placeholder="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-white/80 mb-2">Max Length</label>
                            <input
                              type="number"
                              value={filters.maxLength}
                              onChange={(e) => setFilters({...filters, maxLength: e.target.value})}
                              className="ios-input"
                              placeholder="20"
                            />
                          </div>
                        </div>
                    
                        <div>
                          <label className="block text-sm text-white/80 mb-2">Starts With</label>
                          <input
                            type="text"
                            value={filters.startsWith}
                            onChange={(e) => setFilters({...filters, startsWith: e.target.value})}
                            className="ios-input"
                            placeholder="e.g., un"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-white/80 mb-2">Ends With</label>
                          <input
                            type="text"
                            value={filters.endsWith}
                            onChange={(e) => setFilters({...filters, endsWith: e.target.value})}
                            className="ios-input"
                            placeholder="e.g., ing"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-white/80 mb-2">Contains</label>
                          <input
                            type="text"
                            value={filters.contains}
                            onChange={(e) => setFilters({...filters, contains: e.target.value})}
                            className="ios-input"
                            placeholder="e.g., tion"
                          />
                        </div>
                        
                        <button
                          onClick={handleFilterSearch}
                          disabled={isSearching}
                          className="ios-button w-full"
                        >
                          Apply Filters
                        </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats Card */}
            {wordStats && (
              <div className="ios-stats">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-white" />
                  Database Stats
                </h2>
                <div className="space-y-3">
                  <div className="ios-stat-item">
                    <span className="ios-stat-label">Total Words:</span>
                    <span className="ios-stat-value">{wordStats.total_words.toLocaleString()}</span>
                  </div>
                  <div className="ios-stat-item">
                    <span className="ios-stat-label">Average Length:</span>
                    <span className="ios-stat-value">{wordStats.avg_length.toFixed(2)} letters</span>
                  </div>
                  <div className="ios-stat-item">
                    <span className="ios-stat-label">Shortest Word:</span>
                    <span className="ios-stat-value">{wordStats.min_length} letter</span>
                  </div>
                  <div className="ios-stat-item">
                    <span className="ios-stat-label">Longest Word:</span>
                    <span className="ios-stat-value">{wordStats.max_length} letters</span>
                  </div>
                </div>
              </div>
            )}

          </section>

          {/* Right Column - Results */}
          <section>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-4 flex items-center justify-between backdrop-blur-sm"
              >
                <span className="text-sm">{error}</span>
                <button onClick={() => setError(null)} className="text-red-100 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {searchResult ? (
              searchResult.filteredWords && searchResult.filteredWords.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ios-results"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Results</h3>
                    <span className="text-sm text-white/80">{searchResult.filteredWords.length.toLocaleString()} found</span>
                  </div>
                  <div className="ios-results-list">
                    {searchResult.filteredWords.slice(0, 500).map((w, idx) => (
                      <div key={w + idx} className="ios-result-item" onClick={() => handleExploreWord(w)}>
                        <span className="text-white">{w}</span>
                        <span className="text-white/60 text-xs">Explore →</span>
                      </div>
                    ))}
                  </div>
                  {searchResult.filteredWords.length > 500 && (
                    <p className="mt-3 text-xs text-white/60">Showing first 500 results. Refine filters to narrow results.</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ios-results"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white">Result</h3>
                  </div>
                  <WordResults
                    result={searchResult}
                    onAddWord={handleAddWord}
                    onExploreWord={handleExploreWord}
                  />
                </motion.div>
              )
            ) : (
              <div className="ios-empty">
                <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Start Exploring Words</h3>
                <p className="text-white/80 mb-6">
                  Search for any word to see definitions, pronunciations, examples, and more.
                </p>
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-white/60 mb-4">Try searching for:</p>
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
                        className="ios-chip"
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
