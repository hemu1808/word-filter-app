import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Sparkles, Zap, Target } from 'lucide-react';

interface RefinedSearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: {
    minLength: string;
    maxLength: string;
    startsWith: string;
    endsWith: string;
    contains: string;
  };
  setFilters: (filters: any) => void;
  onFilterSearch: () => void;
  onSuggestionClick: (word: string) => void;
}

const RefinedSearchSection: React.FC<RefinedSearchSectionProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  isSearching,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  onFilterSearch,
  onSuggestionClick,
}) => {
  const suggestions = ['hello', 'world', 'python', 'javascript', 'beautiful'];
  const advancedSuggestions = ['serendipity', 'ephemeral', 'eloquent', 'magnificent', 'wonderful'];

  return (
    <motion.section 
      className="card-refined transform-3d"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Header */}
      <div className="text-center space-refined-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="typography-display text-5xl mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            ✨ Word Search Adventure ✨
          </h2>
          <p className="typography-body text-xl text-white/80 max-w-2xl mx-auto">
            Discover the magic of words with our interactive explorer. Find meanings, pronunciations, and fascinating word facts.
          </p>
        </motion.div>

        {/* Floating Icons */}
        <div className="flex justify-center space-x-4 mt-6">
          {[Sparkles, Zap, Target].map((Icon, index) => (
            <motion.div
              key={index}
              className="p-3 rounded-full glass-advanced"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search Form */}
      <motion.form 
        onSubmit={onSearch} 
        className="space-refined-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="relative">
          <motion.input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type any word to explore..."
            className="w-full p-6 text-lg glass-advanced border-0 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300"
            disabled={isSearching}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            animate={{ rotate: isSearching ? 360 : 0 }}
            transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}
          >
            {isSearching ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-white/60" />
            )}
          </motion.div>
        </div>

        <motion.button
          type="submit"
          disabled={isSearching || !searchTerm.trim()}
          className="btn-refined btn-primary w-full text-lg py-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSearching ? 'Searching...' : '🚀 Search Word'}
        </motion.button>
      </motion.form>

      {/* Quick Suggestions */}
      <motion.div 
        className="space-refined"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="typography-heading text-xl text-center text-white/90">
          ✨ Try these magical words ✨
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((word, index) => (
            <motion.button
              key={word}
              onClick={() => onSuggestionClick(word)}
              className="px-6 py-3 glass-advanced text-white font-semibold rounded-xl hover:scale-110 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span className="mr-2">✨</span>
              {word}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div 
        className="space-refined"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-refined btn-secondary w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-5 h-5" />
          Advanced Filters
          <motion.div
            animate={{ rotate: showFilters ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-refined-sm p-6 glass-advanced rounded-2xl mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block typography-body text-sm mb-2 text-white/80">Min Length</label>
                    <input
                      type="number"
                      value={filters.minLength}
                      onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                      className="w-full p-3 glass-advanced border-0 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block typography-body text-sm mb-2 text-white/80">Max Length</label>
                    <input
                      type="number"
                      value={filters.maxLength}
                      onChange={(e) => setFilters({...filters, maxLength: e.target.value})}
                      className="w-full p-3 glass-advanced border-0 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      placeholder="20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block typography-body text-sm mb-2 text-white/80">Starts With</label>
                  <input
                    type="text"
                    value={filters.startsWith}
                    onChange={(e) => setFilters({...filters, startsWith: e.target.value})}
                    className="w-full p-3 glass-advanced border-0 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    placeholder="e.g., un"
                  />
                </div>
                
                <div>
                  <label className="block typography-body text-sm mb-2 text-white/80">Ends With</label>
                  <input
                    type="text"
                    value={filters.endsWith}
                    onChange={(e) => setFilters({...filters, endsWith: e.target.value})}
                    className="w-full p-3 glass-advanced border-0 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    placeholder="e.g., ing"
                  />
                </div>
                
                <div>
                  <label className="block typography-body text-sm mb-2 text-white/80">Contains</label>
                  <input
                    type="text"
                    value={filters.contains}
                    onChange={(e) => setFilters({...filters, contains: e.target.value})}
                    className="w-full p-3 glass-advanced border-0 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    placeholder="e.g., tion"
                  />
                </div>
                
                <motion.button
                  onClick={onFilterSearch}
                  className="btn-refined btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Suggestions */}
      <motion.div 
        className="space-refined"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h3 className="typography-heading text-lg text-center text-white/80">
          🎯 Advanced Word Suggestions
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {advancedSuggestions.map((word, index) => (
            <motion.button
              key={word}
              onClick={() => onSuggestionClick(word)}
              className="px-4 py-2 glass-advanced text-white/90 text-sm font-medium rounded-lg hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
            >
              <span className="mr-1">🎯</span>
              {word}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default RefinedSearchSection;
