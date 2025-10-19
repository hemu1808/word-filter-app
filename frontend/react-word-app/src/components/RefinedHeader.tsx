import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Menu, Settings } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

interface RefinedHeaderProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isThemeSelectorOpen: boolean;
  onThemeToggle: () => void;
  onBack?: () => void;
  onMenu?: () => void;
  onSettings?: () => void;
}

const RefinedHeader: React.FC<RefinedHeaderProps> = ({
  currentTheme,
  onThemeChange,
  isThemeSelectorOpen,
  onThemeToggle,
  onBack,
  onMenu,
  onSettings,
}) => {
  return (
    <motion.header 
      className="kid-header glass-advanced"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.button 
              className="p-3 rounded-full glass-advanced hover:scale-110 transition-all duration-300"
              onClick={onBack}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.div 
              className="typography-display text-3xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Word★Explorer
            </motion.div>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <motion.button 
              className="typography-body text-white/80 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              whileHover={{ y: -2 }}
            >
              Features
            </motion.button>
            <motion.button 
              className="typography-body text-white/80 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              whileHover={{ y: -2 }}
            >
              About
            </motion.button>
            <motion.button 
              className="typography-body text-white/80 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              whileHover={{ y: -2 }}
            >
              Contact
            </motion.button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
              isOpen={isThemeSelectorOpen}
              onToggle={onThemeToggle}
            />
            
            <motion.button 
              className="p-3 rounded-full glass-advanced hover:scale-110 transition-all duration-300"
              onClick={onSettings}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            <motion.button 
              className="p-3 rounded-full glass-advanced hover:scale-110 transition-all duration-300 lg:hidden"
              onClick={onMenu}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default RefinedHeader;
