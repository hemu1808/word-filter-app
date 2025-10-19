import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  color: string;
  size: string;
}

const FloatingWords: React.FC = () => {
  const [words, setWords] = useState<FloatingWord[]>([]);

  const wordList = [
    'amazing', 'wonderful', 'fantastic', 'brilliant', 'magnificent', 'spectacular',
    'incredible', 'marvelous', 'extraordinary', 'outstanding', 'remarkable', 'stunning',
    'beautiful', 'gorgeous', 'lovely', 'charming', 'delightful', 'enchanting',
    'magical', 'mystical', 'wondrous', 'fascinating', 'captivating', 'mesmerizing',
    'inspiring', 'uplifting', 'joyful', 'cheerful', 'happy', 'bright',
    'colorful', 'vibrant', 'lively', 'energetic', 'dynamic', 'exciting',
    'adventure', 'journey', 'discovery', 'exploration', 'wonder', 'curiosity',
    'imagination', 'creativity', 'inspiration', 'dream', 'hope', 'magic'
  ];

  const colors = [
    'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 
    'bg-blue-400', 'bg-indigo-400', 'bg-purple-400', 'bg-pink-400',
    'bg-rose-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-400',
    'bg-cyan-400', 'bg-sky-400', 'bg-violet-400', 'bg-fuchsia-400'
  ];

  const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];

  useEffect(() => {
    const createWord = () => {
      const newWord: FloatingWord = {
        id: Date.now() + Math.random(),
        word: wordList[Math.floor(Math.random() * wordList.length)],
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 200),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)]
      };
      
      setWords(prev => [...prev, newWord]);
      
      // Remove word after 2 seconds
      setTimeout(() => {
        setWords(prev => prev.filter(word => word.id !== newWord.id));
      }, 2000);
    };

    // Create initial words
    for (let i = 0; i < 5; i++) {
      setTimeout(createWord, i * 400);
    }

    // Continue creating words every 800ms
    const interval = setInterval(createWord, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {words.map((word) => (
          <motion.div
            key={word.id}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              x: word.x,
              y: word.y
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: word.x + (Math.random() - 0.5) * 100,
              y: word.y + (Math.random() - 0.5) * 100,
              rotate: [0, 5, -5, 0]
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.3,
              y: word.y - 50
            }}
            transition={{ 
              duration: 2,
              ease: 'easeInOut'
            }}
            className={`absolute ${word.color} ${word.size} font-bold text-white px-3 py-1 rounded-full shadow-lg backdrop-blur-sm`}
            style={{
              left: word.x,
              top: word.y,
            }}
          >
            {word.word}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWords;
