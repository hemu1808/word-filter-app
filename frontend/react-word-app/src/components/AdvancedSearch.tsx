import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Check,
  Clock,
  Star,
  TrendingUp,
  BookOpen,
  Volume2,
  Copy,
  Heart,
  Bookmark,
  Share2,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Layers,
  Grid,
  List,
  Sliders,
  Settings,
  HelpCircle,
  Lightbulb,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Wand,
  Scroll,
  Book,
  Library,
  Archive,
  Folder,
  File,
  Tag,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  CreditCard,
  ShoppingCart,
  Package,
  Truck,
  Home,
  Building,
  Factory,
  Store,
  Hospital,
  School,
  University,
  Church,
  Theater,
  Sun,
  Moon,
  Star as StarIcon,
  Satellite,
  Rocket,
  Laptop as LaptopIcon,
  Monitor as MonitorIcon,
  Keyboard,
  Mouse,
  Headphones as HeadphonesIcon,
  Mic,
  Camera as CameraIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw as RotateCcwIcon,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Eraser,
  Pen,
  Pencil,
  Brush,
  Palette,
  Paintbrush,
  Highlighter,
  Droplet,
  Contrast,
  Filter as FilterIcon,
  Layers as LayersIcon,
  Blend,
  Merge,
  Split,
  Combine,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Grid as GridIcon
} from 'lucide-react';
import type { SearchComponentProps } from '../types/WordTypes';

const AdvancedSearch: React.FC<SearchComponentProps> = ({ onSearch, isSearching, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startsWith: '',
    endsWith: '',
    contains: '',
    length: '',
    minLength: '',
    maxLength: '',
    excludeLetters: '',
    includeLetters: '',
    pattern: '',
    category: '',
    difficulty: '',
    language: 'english',
    sortBy: 'alphabetical',
    sortOrder: 'asc',
    limit: 50
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const categories = [
    'All', 'Nouns', 'Verbs', 'Adjectives', 'Adverbs', 'Prepositions', 'Conjunctions', 'Interjections',
    'Technical', 'Scientific', 'Medical', 'Legal', 'Business', 'Academic', 'Literary', 'Poetic',
    'Slang', 'Informal', 'Formal', 'Archaic', 'Rare', 'Common', 'Frequent', 'Uncommon'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'];
  const sortOptions = ['Alphabetical', 'Length', 'Frequency', 'Difficulty', 'Date Added', 'Popularity'];

  useEffect(() => {
    const stored = localStorage.getItem('advancedSearchHistory');
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsTyping(true);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        // Simulate API call for suggestions
        const mockSuggestions = [
          `${searchTerm}able`, `${searchTerm}ing`, `${searchTerm}ed`, `${searchTerm}er`, `${searchTerm}ly`,
          `un${searchTerm}`, `re${searchTerm}`, `pre${searchTerm}`, `over${searchTerm}`, `under${searchTerm}`
        ].filter(s => s.length > 3);
        
        setSuggestions(mockSuggestions.slice(0, 8));
        setIsTyping(false);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsTyping(false);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (!searchTerm.trim() && !Object.values(filters).some(f => f)) return;
    
    const searchData = {
      word: searchTerm,
      ...filters
    };
    
    onSearch(searchTerm);
    
    // Add to history
    const newHistory = [
      { ...searchData, timestamp: Date.now(), id: Math.random() },
      ...searchHistory.slice(0, 9)
    ];
    setSearchHistory(newHistory);
    localStorage.setItem('advancedSearchHistory', JSON.stringify(newHistory));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const clearFilters = () => {
    setFilters({
      startsWith: '',
      endsWith: '',
      contains: '',
      length: '',
      minLength: '',
      maxLength: '',
      excludeLetters: '',
      includeLetters: '',
      pattern: '',
      category: '',
      difficulty: '',
      language: 'english',
      sortBy: 'alphabetical',
      sortOrder: 'asc',
      limit: 50
    });
  };

  const saveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (searchName) {
      setSavedSearches([...savedSearches, searchName]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Advanced Word Search</h2>
        <p className="text-gray-600">Use powerful filters and patterns to find exactly what you're looking for</p>
      </motion.div>

      {/* Main Search Bar */}
      <motion.div variants={itemVariants} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter a word or pattern..."
            className="input-glass text-lg pr-20"
            disabled={isSearching}
          />
          <motion.button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-primary p-3 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter Toggle */}
      <motion.div variants={itemVariants} className="flex items-center justify-center">
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Advanced Filters</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pattern Filters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Pattern Filters</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starts with</label>
                  <input
                    type="text"
                    value={filters.startsWith}
                    onChange={(e) => setFilters({ ...filters, startsWith: e.target.value })}
                    placeholder="e.g., 'un'"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ends with</label>
                  <input
                    type="text"
                    value={filters.endsWith}
                    onChange={(e) => setFilters({ ...filters, endsWith: e.target.value })}
                    placeholder="e.g., 'ing'"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contains</label>
                  <input
                    type="text"
                    value={filters.contains}
                    onChange={(e) => setFilters({ ...filters, contains: e.target.value })}
                    placeholder="e.g., 'tion'"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern (regex)</label>
                  <input
                    type="text"
                    value={filters.pattern}
                    onChange={(e) => setFilters({ ...filters, pattern: e.target.value })}
                    placeholder="e.g., '^[aeiou].*[aeiou]$'"
                    className="input-glass"
                  />
                </div>
              </div>

              {/* Length Filters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Length Filters</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exact length</label>
                  <input
                    type="number"
                    value={filters.length}
                    onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                    placeholder="e.g., 5"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum length</label>
                  <input
                    type="number"
                    value={filters.minLength}
                    onChange={(e) => setFilters({ ...filters, minLength: e.target.value })}
                    placeholder="e.g., 3"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum length</label>
                  <input
                    type="number"
                    value={filters.maxLength}
                    onChange={(e) => setFilters({ ...filters, maxLength: e.target.value })}
                    placeholder="e.g., 10"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include letters</label>
                  <input
                    type="text"
                    value={filters.includeLetters}
                    onChange={(e) => setFilters({ ...filters, includeLetters: e.target.value })}
                    placeholder="e.g., 'aeiou'"
                    className="input-glass"
                  />
                </div>
              </div>

              {/* Category & Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Options</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="input-glass"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="input-glass"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff.toLowerCase()}>{diff}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="input-glass"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Results limit</label>
                  <input
                    type="number"
                    value={filters.limit}
                    onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
                    min="1"
                    max="1000"
                    className="input-glass"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear All</span>
                </motion.button>
                
                <motion.button
                  onClick={saveSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Search</span>
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Searches</span>
          </h3>
          
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map((search, index) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  setSearchTerm(search.word || '');
                  setFilters({ ...filters, ...search });
                  onSearch(search.word || '');
                }}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {search.word || 'Advanced search'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(search.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Tips */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <span>Search Tips</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Use wildcards</p>
                <p className="text-xs text-gray-600">Use * for any characters, ? for single characters</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Regex patterns</p>
                <p className="text-xs text-gray-600">Use regular expressions for complex patterns</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Combine filters</p>
                <p className="text-xs text-gray-600">Use multiple filters for precise results</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Save searches</p>
                <p className="text-xs text-gray-600">Save frequently used search patterns</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSearch;