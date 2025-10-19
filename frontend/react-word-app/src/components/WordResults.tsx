import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Copy, 
  Plus, 
  Check, 
  BookOpen, 
  MessageSquare, 
  RefreshCw, 
  Info,
  Award,
  Hash
} from 'lucide-react';
import type { ResultsComponentProps, AddWordResponse } from '../types/WordTypes';

const WordResults: React.FC<ResultsComponentProps> = ({ 
  result, 
  onAddWord, 
  onExploreWord, 
  className = '' 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddWord = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      onAddWord(result.word);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopyWord = async () => {
    try {
      await navigator.clipboard.writeText(result.word);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy word:', error);
    }
  };

  const handlePlayPronunciation = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing pronunciation:', error);
      });
    }
  };

  const getWordSize = (word: string) => {
    const length = word.length;
    if (length <= 5) return 'text-4xl';
    if (length <= 10) return 'text-3xl';
    if (length <= 15) return 'text-2xl';
    return 'text-xl';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
      {/* Word Header */}
      <motion.div variants={itemVariants} className="card-glass">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Word Display */}
          <div className="flex-1">
            <motion.h1 
              className={`font-display font-bold text-gradient mb-4 ${getWordSize(result.word)}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {result.word}
            </motion.h1>
            
            {/* Word Badges */}
            <div className="flex flex-wrap gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-semibold"
              >
                <Hash className="w-4 h-4" />
                <span>{result.word.length} letters</span>
              </motion.span>
              
              {result.inCollection && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="flex items-center space-x-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  <Check className="w-4 h-4" />
                  <span>In Collection</span>
                </motion.span>
              )}
              
              {result.oxford && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex items-center space-x-2 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  <Award className="w-4 h-4" />
                  <span>Oxford Verified</span>
                </motion.span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!result.inCollection && (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddWord}
                disabled={isAdding}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {isAdding ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : addSuccess ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>
                  {isAdding ? 'Adding...' : addSuccess ? 'Added!' : 'Add to Collection'}
                </span>
              </motion.button>
            )}
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyWord}
              className="btn-glass flex items-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Word Details Grid */}
      {result.oxford && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Definitions */}
          {result.oxford.definitions && result.oxford.definitions.length > 0 && (
            <motion.div variants={itemVariants} className="card-glass">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Definitions
                </h3>
                <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {result.oxford.definitions.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {result.oxford.definitions.map((definition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {definition}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pronunciation */}
          {result.oxford.pronunciations && result.oxford.pronunciations.length > 0 && (
            <motion.div variants={itemVariants} className="card-glass">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                  <Volume2 className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Pronunciation
                </h3>
              </div>
              
              <div className="space-y-3">
                {result.oxford.pronunciations.map((pron, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-accent-600 dark:text-accent-400 mb-1">
                        {pron.prefix || 'Standard'}
                      </div>
                      <div className="font-mono text-slate-800 dark:text-slate-200">
                        {pron.ipa}
                      </div>
                    </div>
                    {pron.url && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlayPronunciation(pron.url!)}
                        className="p-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Examples */}
          {result.oxford.examples && result.oxford.examples.length > 0 && (
            <motion.div variants={itemVariants} className="card-glass">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Examples
                </h3>
                <span className="bg-accent-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {result.oxford.examples.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {result.oxford.examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-accent-500"
                  >
                    <div className="text-accent-500 text-xl">💭</div>
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      {example}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Synonyms */}
          {result.oxford.synonyms && result.oxford.synonyms.length > 0 && (
            <motion.div variants={itemVariants} className="card-glass">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Similar Words
                </h3>
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {result.oxford.synonyms.length}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {result.oxford.synonyms.map((synonym, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onExploreWord(synonym)}
                    className="synonym-chip"
                  >
                    {synonym}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Word Forms */}
          {result.oxford.word_forms && result.oxford.word_forms.length > 0 && (
            <motion.div variants={itemVariants} className="card-glass">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                  Word Forms
                </h3>
                <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {result.oxford.word_forms.length}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {result.oxford.word_forms.map((form, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {form}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Word Info Card */}
      <motion.div variants={itemVariants} className="card-glass">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <Info className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
            Word Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Length:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {result.word.length} letters
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-600 dark:text-slate-400 font-medium">In Collection:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {result.inCollection ? 'Yes ✅' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Dictionary:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {result.oxford ? 'Oxford Verified 🏆' : 'Basic'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WordResults;
