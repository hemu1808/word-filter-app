import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveDesignProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDesign: React.FC<ResponsiveDesignProps> = ({ children, className = '' }) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsPortrait(height > width);
      
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  const getResponsiveClasses = () => {
    const baseClasses = className;
    
    switch (screenSize) {
      case 'mobile':
        return `${baseClasses} px-4 py-2 text-sm`;
      case 'tablet':
        return `${baseClasses} px-6 py-3 text-base`;
      case 'desktop':
        return `${baseClasses} px-8 py-4 text-lg`;
      default:
        return baseClasses;
    }
  };

  const getGridColumns = () => {
    switch (screenSize) {
      case 'mobile':
        return 'grid-cols-1';
      case 'tablet':
        return 'grid-cols-2';
      case 'desktop':
        return 'grid-cols-3';
      default:
        return 'grid-cols-1';
    }
  };

  const getSpacing = () => {
    switch (screenSize) {
      case 'mobile':
        return 'space-y-4';
      case 'tablet':
        return 'space-y-6';
      case 'desktop':
        return 'space-y-8';
      default:
        return 'space-y-6';
    }
  };

  return (
    <div className={`responsive-container ${getResponsiveClasses()}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screenSize}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`w-full ${getSpacing()}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Screen size indicator for development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50 glass rounded-lg px-3 py-2 text-xs font-mono">
          {screenSize} {isPortrait ? 'portrait' : 'landscape'}
        </div>
      )}
    </div>
  );
};

// Responsive utility components
export const ResponsiveGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveText: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}> = ({ 
  children, 
  className = '', 
  mobile = 'text-sm',
  tablet = 'text-base',
  desktop = 'text-lg'
}) => {
  return (
    <div className={`${mobile} md:${tablet} lg:${desktop} ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveSpacing: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}> = ({ 
  children, 
  className = '', 
  mobile = 'p-4',
  tablet = 'p-6',
  desktop = 'p-8'
}) => {
  return (
    <div className={`${mobile} md:${tablet} lg:${desktop} ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`card-glass w-full ${className}`}>
      <ResponsiveSpacing>
        {children}
      </ResponsiveSpacing>
    </div>
  );
};

export const ResponsiveButton: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, className = '', onClick, disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const ResponsiveInput: React.FC<{ 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}> = ({ placeholder, value, onChange, className = '', type = 'text' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-glass w-full text-sm sm:text-base ${className}`}
    />
  );
};

export const ResponsiveModal: React.FC<{ 
  children: React.ReactNode; 
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}> = ({ children, isOpen, onClose, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`glass-card max-w-full max-h-full overflow-auto ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveDesign;
