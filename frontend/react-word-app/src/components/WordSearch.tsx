import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import type { SearchComponentProps } from '../types/WordTypes';

const quickSuggestions = [
  { word: 'butterfly', category: 'fun' as const },
  { word: 'rainbow', category: 'fun' as const },
  { word: 'adventure', category: 'fun' as const },
  { word: 'serendipity', category: 'fun' as const },
  { word: 'galaxy', category: 'fun' as const },
  { word: 'whisper', category: 'fun' as const },
  { word: 'enigma', category: 'fun' as const },
  { word: 'harmony', category: 'fun' as const },
];

const WordSearch: React.FC<SearchComponentProps> = ({ onSearch, isSearching, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      onSearch(term.trim());
      const newRecentSearches = [term.trim(), ...recentSearches.filter(s => s !== term.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className={`space-y-8 ${className}`}
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-display font-bold text-center text-gradient mb-4">
        Basic Word Search
      </motion.h2>
      <motion.p variants={itemVariants} className="text-center text-base text-gray-600 max-w-2xl mx-auto">
        Enter any word to get its definitions, pronunciations, examples, and synonyms.
      </motion.p>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-lg mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type a word..."
          className="input-glass flex-grow text-lg"
          disabled={isSearching}
        />
        <motion.button
          type="submit"
          className="btn-primary flex items-center space-x-2"
          disabled={isSearching}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSearching ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>Search</span>
        </motion.button>
      </motion.form>

      {/* Quick Suggestions */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Quick Suggestions:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {quickSuggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setSearchTerm(suggestion.word);
                handleSearch(suggestion.word);
              }}
              className="suggestion-pill flex items-center space-x-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{suggestion.word}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Recent Searches:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <AnimatePresence>
              {recentSearches.map((word, index) => (
                <motion.button
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setSearchTerm(word);
                    handleSearch(word);
                  }}
                  className="suggestion-pill flex items-center space-x-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{word}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Search Tips */}
      <motion.div variants={itemVariants} className="glass-card p-4 max-w-2xl mx-auto text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pro Tip:</h3>
        <p className="text-gray-600 text-sm">
          Use the "Advanced Filter" mode for more complex searches, like finding words that start with 'un' and end with 'able'!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WordSearch;