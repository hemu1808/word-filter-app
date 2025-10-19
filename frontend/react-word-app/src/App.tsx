import React, { useState, useEffect } from 'react';
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

  const handleFilterSearch = async () => {
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
  };

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
    <div className="starfall-page">
      {/* Starfall Header */}
      <header className="starfall-header sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/10" aria-label="Back">←</button>
            <div className="starfall-logo">Word★Explorer</div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <button className="nav-item">Apps</button>
            <button className="nav-item">Store</button>
            <button className="nav-item">Parents & Teachers</button>
            <button className="nav-item">How to Join</button>
            <button className="nav-item">Sign In</button>
          </nav>
          <button className="md:hidden p-2 rounded hover:bg-white/10" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Starfall Main */}
      <main className="starfall-main">
        <h2 className="starfall-panel-title mb-4">Grades 1, 2, 3 — Language Arts & Music</h2>
        <div className="starfall-columns">
          {/* Left Column (Math-like panel repurposed to Filters) */}
          <aside className="starfall-panel">
            <div className="starfall-panel-title">Tools</div>
            <div className="starfall-grid">
              <button className="starfall-activity" onClick={() => setShowFilters((v) => !v)}>
                <span className="icon">⚙️</span>
                <div>
                  <div className="title">Advanced Filters</div>
                  <div className="subtitle">Length, pattern, contains</div>
                </div>
              </button>
              <button className="starfall-activity" onClick={() => {
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
          </aside>
          {/* Center Column (Activities: Basic/Advanced/Browse/Puzzles) + Search */}
          <section className="space-y-4">
            <div className="starfall-panel">
              <div className="starfall-panel-title">Activities</div>
              <div className="grid sm:grid-cols-2 gap-2">
                <button className="starfall-activity" onClick={(e) => { e.preventDefault(); }}>
                  <span className="icon">🔍</span>
                  <div>
                    <div className="title">Basic Search</div>
                    <div className="subtitle">Look up any word</div>
                  </div>
                </button>
                <button className="starfall-activity" onClick={() => setShowFilters(true)}>
                  <span className="icon">🎯</span>
                  <div>
                    <div className="title">Advanced</div>
                    <div className="subtitle">Smart filtering</div>
                  </div>
                </button>
                <button className="starfall-activity" onClick={() => setFilters({ ...filters, minLength: '5', maxLength: '7' })}>
                  <span className="icon">📚</span>
                  <div>
                    <div className="title">Browse by Length</div>
                    <div className="subtitle">Quick presets</div>
                  </div>
                </button>
                <button className="starfall-activity" onClick={() => setFilters({ ...filters, contains: 'tion' })}>
                  <span className="icon">🧩</span>
                  <div>
                    <div className="title">Pattern Match</div>
                    <div className="subtitle">Find by pattern</div>
                  </div>
                </button>
              </div>
            </div>
            {/* Search Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Search className="w-5 h-5 mr-2 text-gray-900" />
                Quick Search
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter a word..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <Loader className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-900" />
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSearching || !searchTerm.trim()}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>

              {/* Quick Suggestions */}
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
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
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Filters Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-3"
              >
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-gray-900" />
                  Advanced Filters
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Min Length</label>
                        <input
                          type="number"
                          value={filters.minLength}
                          onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Max Length</label>
                        <input
                          type="number"
                          value={filters.maxLength}
                          onChange={(e) => setFilters({...filters, maxLength: e.target.value})}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Starts With</label>
                      <input
                        type="text"
                        value={filters.startsWith}
                        onChange={(e) => setFilters({...filters, startsWith: e.target.value})}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., un"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ends With</label>
                      <input
                        type="text"
                        value={filters.endsWith}
                        onChange={(e) => setFilters({...filters, endsWith: e.target.value})}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., ing"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Contains</label>
                      <input
                        type="text"
                        value={filters.contains}
                        onChange={(e) => setFilters({...filters, contains: e.target.value})}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., tion"
                      />
                    </div>
                    
                    <button
                      onClick={handleFilterSearch}
                      disabled={isSearching}
                      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Apply Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats Card (inside center column) */}
            {wordStats && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-900" />
                  Database Stats
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Words:</span>
                    <span className="font-semibold text-gray-900">{wordStats.total_words.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Length:</span>
                    <span className="font-semibold text-gray-900">{wordStats.avg_length.toFixed(2)} letters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shortest Word:</span>
                    <span className="font-semibold text-gray-900">{wordStats.min_length} letter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longest Word:</span>
                    <span className="font-semibold text-gray-900">{wordStats.max_length} letters</span>
                  </div>
                </div>
              </div>
            )}

          </section>

          </section>

          {/* Right Column (Results) */}
          <section>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between"
              >
                <span className="text-sm">{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {searchResult ? (
              searchResult.filteredWords && searchResult.filteredWords.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Results</h3>
                    <span className="text-xs text-gray-500">{searchResult.filteredWords.length.toLocaleString()} found</span>
                  </div>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-auto">
                      {searchResult.filteredWords.slice(0, 500).map((w, idx) => (
                        <li key={w + idx}>
                          <button
                            onClick={() => handleExploreWord(w)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span className="text-gray-900">{w}</span>
                            <span className="text-gray-400 text-xs">Explore →</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {searchResult.filteredWords.length > 500 && (
                    <p className="mt-3 text-xs text-gray-500">Showing first 500 results. Refine filters to narrow results.</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Result</h3>
                  </div>
                  <WordResults
                    result={searchResult}
                    onAddWord={handleAddWord}
                    onExploreWord={handleExploreWord}
                  />
                </motion.div>
              )
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Exploring Words</h3>
                <p className="text-gray-600 mb-6">
                  Search for any word to see definitions, pronunciations, examples, and more.
                </p>
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-4">Try searching for:</p>
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
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
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
