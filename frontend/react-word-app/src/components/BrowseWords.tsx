import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Search, RotateCcw, Hash, TrendingUp } from 'lucide-react';
import type { SearchComponentProps } from '../types/WordTypes';

const BrowseWords: React.FC<SearchComponentProps> = ({ onSearch, isSearching, className = '' }) => {
  const [wordLength, setWordLength] = useState<number>(5);
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const length = parseInt(e.target.value) || 5;
    setWordLength(Math.max(1, Math.min(20, length)));
  };

  const handleBrowse = async () => {
    if (!wordLength || wordLength <= 0) {
      alert('Please enter a valid word length');
      return;
    }

    try {
      // This would normally call the API, but for now we'll simulate
      console.log('Browse words by length:', wordLength);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results for demonstration - generate words of specific length
      const mockResults = generateMockWords(wordLength);
      
      setResults(mockResults);
      setTotalCount(mockResults.length);
      setShowResults(true);
    } catch (error) {
      console.error('Error browsing words:', error);
    }
  };

  const generateMockWords = (length: number): string[] => {
    // This is a simplified mock - in reality, you'd get this from your API
    const wordLists: { [key: number]: string[] } = {
      3: ['cat', 'dog', 'run', 'sun', 'fun', 'big', 'red', 'hot', 'old', 'new'],
      4: ['love', 'hope', 'life', 'time', 'home', 'work', 'play', 'read', 'walk', 'talk'],
      5: ['happy', 'peace', 'dream', 'smile', 'light', 'music', 'beauty', 'grace', 'power', 'wisdom'],
      6: ['family', 'friend', 'nature', 'travel', 'adventure', 'freedom', 'courage', 'wisdom', 'beauty', 'harmony'],
      7: ['journey', 'freedom', 'courage', 'wisdom', 'beauty', 'harmony', 'passion', 'success', 'victory', 'triumph'],
      8: ['adventure', 'discovery', 'creativity', 'imagination', 'inspiration', 'motivation', 'dedication', 'education', 'generation', 'celebration'],
      9: ['beautiful', 'wonderful', 'fantastic', 'incredible', 'amazing', 'brilliant', 'magnificent', 'spectacular', 'extraordinary', 'remarkable'],
      10: ['imagination', 'inspiration', 'motivation', 'dedication', 'education', 'generation', 'celebration', 'exploration', 'innovation', 'transformation']
    };

    return wordLists[length] || wordLists[5] || [];
  };

  const handleClear = () => {
    setWordLength(5);
    setResults([]);
    setShowResults(false);
    setTotalCount(0);
  };

  const handleWordClick = (word: string) => {
    onSearch(word);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-6 ${className}`}
    >
      {/* Browse Controls */}
      <motion.div variants={itemVariants} className="card-glass">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <List className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
            Browse Words by Length
          </h3>
        </div>

        <div className="space-y-6">
          {/* Word Length Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Word Length:
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={wordLength}
                onChange={handleLengthChange}
                placeholder="5"
                min="1"
                max="20"
                className="input-glass w-32"
              />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {wordLength === 1 ? '1 letter' : `${wordLength} letters`}
              </div>
            </div>
          </motion.div>

          {/* Quick Length Buttons */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Quick Select:
            </label>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((length) => (
                <motion.button
                  key={length}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWordLength(length)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                    wordLength === length
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {length}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={handleBrowse}
              disabled={isSearching || !wordLength}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
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
              <span>{isSearching ? 'Browsing...' : 'Browse Words'}</span>
            </motion.button>

            <motion.button
              onClick={handleClear}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glass flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Clear</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="card-glass"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                  <Hash className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Found {totalCount} words of length {wordLength}:
                </h3>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span>Most common length</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {results.map((word, index) => (
                <motion.button
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word)}
                  className="word-chip"
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {/* Load More Button (for future implementation) */}
            {results.length >= 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-glass"
                >
                  Load More Words
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browse Tips */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="glass rounded-2xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <List className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Browse Tips
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Explore words by their length to discover new vocabulary. Perfect for writers, 
            students, and word game enthusiasts looking for words of specific lengths!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrowseWords;
