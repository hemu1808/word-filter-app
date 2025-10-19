import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Hash, Award, Zap, Target } from 'lucide-react';

interface WordStats {
  total_words: number;
  avg_length: number;
  min_length: number;
  max_length: number;
}

interface RefinedStatsProps {
  wordStats: WordStats | null;
}

const RefinedStats: React.FC<RefinedStatsProps> = ({ wordStats }) => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Total Words',
      value: wordStats?.total_words?.toLocaleString() || '0',
      color: 'from-purple-400 to-pink-500',
      delay: 0.1
    },
    {
      icon: Hash,
      label: 'Average Length',
      value: `${wordStats?.avg_length?.toFixed(2) || '0'} letters`,
      color: 'from-blue-400 to-cyan-500',
      delay: 0.2
    },
    {
      icon: Target,
      label: 'Shortest Word',
      value: `${wordStats?.min_length || '0'} letter`,
      color: 'from-green-400 to-emerald-500',
      delay: 0.3
    },
    {
      icon: Award,
      label: 'Longest Word',
      value: `${wordStats?.max_length || '0'} letters`,
      color: 'from-orange-400 to-red-500',
      delay: 0.4
    }
  ];

  if (!wordStats) {
    return (
      <motion.aside
        className="card-refined transform-3d"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="text-center py-8">
          <motion.div
            className="relative mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto" />
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
          </motion.div>
          <h3 className="typography-heading text-xl text-white/90 mb-2">
            Loading Magical Stats
          </h3>
          <p className="typography-body text-white/60">
            Gathering word statistics...
          </p>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      className="card-refined transform-3d"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="typography-display text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            📊 Database Stats
          </h2>
        </div>
        <p className="typography-body text-white/70">
          Real-time word database statistics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="space-refined">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + stat.delay }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-6 glass-advanced rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  className="p-3 rounded-xl glass-advanced"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="text-xs px-3 py-1 rounded-full glass-advanced text-white/80"
                  whileHover={{ scale: 1.05 }}
                >
                  Live
                </motion.div>
              </div>
              
              <div className="space-y-2">
                <h3 className="typography-body text-sm text-white/70 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <motion.p 
                  className={`typography-heading text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + stat.delay }}
                >
                  {stat.value}
                </motion.p>
              </div>

              {/* Animated Progress Bar */}
              <motion.div 
                className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + stat.delay }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                  transition={{ duration: 1, delay: 1.2 + stat.delay }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div 
        className="text-center mt-8 pt-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-white/60">
          <Zap className="w-4 h-4" />
          <span className="typography-body text-sm">Updated in real-time</span>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default RefinedStats;
