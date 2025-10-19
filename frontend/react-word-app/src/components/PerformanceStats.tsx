import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Database, HardDrive, CheckCircle, TrendingUp } from 'lucide-react';
import type { PerformanceStats as PerformanceStatsType } from '../types/WordTypes';

interface PerformanceStatsProps {
  stats: PerformanceStatsType | null;
  onClose: () => void;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ stats, onClose }) => {
  const panelVariants = {
    hidden: { opacity: 0, x: 300, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as any,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-1/2 right-6 -translate-y-1/2 z-50 w-96 max-w-[calc(100vw-3rem)]"
      >
        <div className="glass-card border border-white/20 dark:border-slate-700/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
                <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-200">
                Performance Stats
              </h3>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>
          </div>

          {stats ? (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* System Status */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary-500" />
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    System Status
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Words Loaded:</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {formatNumber(stats.words_loaded)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Thread Workers:</span>
                    <span className="font-bold text-secondary-600 dark:text-secondary-400">
                      {stats.thread_pool_workers}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Process Workers:</span>
                    <span className="font-bold text-accent-600 dark:text-accent-400">
                      {stats.process_pool_workers}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Memory Usage */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-secondary-500" />
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    Memory Usage
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Words List Size:</span>
                    <span className="font-bold text-secondary-600 dark:text-secondary-400">
                      {formatNumber(stats.memory_usage.words_list_size)} bytes
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Words Set Size:</span>
                    <span className="font-bold text-secondary-600 dark:text-secondary-400">
                      {formatNumber(stats.memory_usage.words_set_size)} bytes
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Optimizations */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent-500" />
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    Active Optimizations
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {stats.optimization_features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Performance Indicator */}
              <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    System Health:
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      Excellent
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-accent-200 border-t-accent-500 rounded-full mx-auto mb-4"
              />
              <p className="text-slate-600 dark:text-slate-400">
                Loading performance data...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceStats;
