import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Search, RotateCcw, Shuffle, Hash } from 'lucide-react';
import type { SearchComponentProps } from '../types/WordTypes';

const PuzzleSolver: React.FC<SearchComponentProps> = ({ onSearch, isSearching, className = '' }) => {
  const [wordLength, setWordLength] = useState<number>(5);
  const [pattern, setPattern] = useState<string>('');
  const [letterBoxes, setLetterBoxes] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize letter boxes when word length changes
  useEffect(() => {
    const boxes = new Array(wordLength).fill('');
    setLetterBoxes(boxes);
    setPattern('');
    setResults([]);
    setShowResults(false);
  }, [wordLength]);

  // Update pattern when letter boxes change
  useEffect(() => {
    const newPattern = letterBoxes.map(letter => letter || '?').join('');
    setPattern(newPattern);
  }, [letterBoxes]);

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const length = parseInt(e.target.value) || 5;
    setWordLength(Math.max(1, Math.min(20, length)));
  };

  const handleLetterChange = (index: number, value: string) => {
    // Clean input: only letters, single character, lowercase
    let cleanValue = value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (cleanValue.length > 1) {
      cleanValue = cleanValue.charAt(0);
    }

    const newBoxes = [...letterBoxes];
    newBoxes[index] = cleanValue;
    setLetterBoxes(newBoxes);
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const cleanValue = value.replace(/[^a-z?]/g, '');
    
    // Update pattern
    setPattern(cleanValue);
    
    // Update letter boxes
    const newBoxes = new Array(wordLength).fill('');
    for (let i = 0; i < Math.min(cleanValue.length, wordLength); i++) {
      if (cleanValue[i] !== '?') {
        newBoxes[i] = cleanValue[i];
      }
    }
    setLetterBoxes(newBoxes);
  };

  const handleSolve = async () => {
    if (!wordLength || wordLength <= 0) {
      alert('Please enter a valid word length');
      return;
    }

    try {
      // This would normally call the API, but for now we'll simulate
      console.log('Puzzle solve:', { wordLength, pattern });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results for demonstration
      const mockResults = [
        'apple', 'ample', 'angle', 'ankle', 'argue', 'arise', 'aside', 'audio',
        'avoid', 'awake', 'award', 'aware', 'badly', 'basic', 'beach', 'began'
      ].filter(word => word.length === wordLength);
      
      setResults(mockResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error solving puzzle:', error);
    }
  };

  const handleClear = () => {
    setWordLength(5);
    setPattern('');
    setLetterBoxes(new Array(5).fill(''));
    setResults([]);
    setShowResults(false);
  };

  const handleRandomize = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const randomPattern = Array.from({ length: wordLength }, (_, i) => {
      // 30% chance of having a known letter, 70% chance of being unknown
      return Math.random() < 0.3 ? letters[Math.floor(Math.random() * letters.length)] : '?';
    }).join('');

    setPattern(randomPattern);
    
    const newBoxes = new Array(wordLength).fill('');
    for (let i = 0; i < randomPattern.length; i++) {
      if (randomPattern[i] !== '?') {
        newBoxes[i] = randomPattern[i];
      }
    }
    setLetterBoxes(newBoxes);
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
      {/* Puzzle Controls */}
      <motion.div variants={itemVariants} className="card-glass">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
            <Puzzle className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
            Word Puzzle Solver
          </h3>
        </div>

        <div className="space-y-6">
          {/* Word Length Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Word Length:
            </label>
            <input
              type="number"
              value={wordLength}
              onChange={handleLengthChange}
              placeholder="5"
              min="1"
              max="20"
              className="input-glass w-full max-w-xs"
            />
          </motion.div>

          {/* Pattern Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Pattern (use ? for unknown letters):
            </label>
            <input
              type="text"
              value={pattern}
              onChange={handlePatternChange}
              placeholder={Array(wordLength).fill('?').join('')}
              maxLength={wordLength}
              className="input-glass w-full font-mono text-lg"
            />
          </motion.div>

          {/* Letter Boxes */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Letter Positions:
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {letterBoxes.map((letter, index) => (
                <motion.input
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  type="text"
                  value={letter}
                  onChange={(e) => handleLetterChange(index, e.target.value)}
                  placeholder="?"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-bold input-glass border-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 dark:focus:border-primary-400"
                />
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={handleSolve}
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
              <span>{isSearching ? 'Solving...' : 'Solve Puzzle'}</span>
            </motion.button>

            <motion.button
              onClick={handleRandomize}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glass flex items-center space-x-2"
            >
              <Shuffle className="w-5 h-5" />
              <span>Random</span>
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
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                <Hash className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                Found {results.length} matches:
              </h3>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle Tips */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="glass rounded-2xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Puzzle className="w-5 h-5 text-accent-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Puzzle Solver Tips
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enter known letters in their positions and use ? for unknown letters. 
            Perfect for crossword puzzles, word games, and vocabulary challenges!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PuzzleSolver;
