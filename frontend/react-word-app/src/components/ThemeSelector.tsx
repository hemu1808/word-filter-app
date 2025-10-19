import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Theme {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
}

const themes: Theme[] = [
  { id: 'default', name: 'Magic', emoji: '✨', gradient: 'from-purple-400 via-pink-500 to-red-500' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'forest', name: 'Forest', emoji: '🌲', gradient: 'from-green-400 to-emerald-500' },
  { id: 'space', name: 'Space', emoji: '🌌', gradient: 'from-indigo-400 to-purple-500' },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', gradient: 'from-orange-400 to-red-500' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', gradient: 'from-red-400 via-yellow-400 to-purple-500' },
  { id: 'witch', name: 'Witch', emoji: '🧙‍♀️', gradient: 'from-purple-600 to-black' },
  { id: 'dark', name: 'Dark', emoji: '🌙', gradient: 'from-gray-600 to-gray-900' },
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onThemeChange, 
  isOpen, 
  onToggle 
}) => {
  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        className="theme-toggle flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">{currentThemeData.emoji}</span>
        <span>{currentThemeData.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl z-50"
          >
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    onToggle();
                  }}
                  className={`p-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentTheme === theme.id 
                      ? 'bg-white/30 scale-105' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                  <span className="text-sm">{theme.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
