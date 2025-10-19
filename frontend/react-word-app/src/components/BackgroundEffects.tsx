import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects: React.FC = () => {
  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut' as any
      }
    }
  };

  const slowFloatVariants = {
    animate: {
      y: [-30, 30, -30],
      x: [-15, 15, -15],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut' as any
      }
    }
  };

  const fastFloatVariants = {
    animate: {
      y: [-15, 15, -15],
      x: [-8, 8, -8],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut' as any
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-gray-200/20 to-gray-300/20 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{
          x: ['0%', '50%', '0%'],
          y: ['0%', '50%', '0%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut' as any,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-gray-100/20 to-gray-200/20 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{
          x: ['0%', '-50%', '0%'],
          y: ['0%', '50%', '0%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut' as any,
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{
          x: ['0%', '50%', '0%'],
          y: ['0%', '-50%', '0%'],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut' as any,
        }}
      />

      {/* Floating Word-themed Icons */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 text-6xl opacity-5 text-gray-400"
        style={{ animationDelay: '0s' }}
      >
        📚
      </motion.div>

      <motion.div
        variants={slowFloatVariants}
        animate="animate"
        className="absolute top-32 right-20 text-5xl opacity-3 text-gray-400"
        style={{ animationDelay: '2s' }}
      >
        ✨
      </motion.div>

      <motion.div
        variants={fastFloatVariants}
        animate="animate"
        className="absolute top-60 left-1/4 text-4xl opacity-4 text-gray-400"
        style={{ animationDelay: '4s' }}
      >
        🔍
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-80 right-1/3 text-5xl opacity-5 text-gray-400"
        style={{ animationDelay: '1s' }}
      >
        📖
      </motion.div>

      <motion.div
        variants={slowFloatVariants}
        animate="animate"
        className="absolute bottom-40 left-20 text-6xl opacity-3 text-gray-400"
        style={{ animationDelay: '3s' }}
      >
        🎯
      </motion.div>

      <motion.div
        variants={fastFloatVariants}
        animate="animate"
        className="absolute bottom-60 right-10 text-4xl opacity-4 text-gray-400"
        style={{ animationDelay: '5s' }}
      >
        💡
      </motion.div>

      {/* Additional floating elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/3 right-1/5 text-3xl opacity-10"
        style={{ animationDelay: '6s' }}
      >
        🌟
      </motion.div>

      <motion.div
        variants={slowFloatVariants}
        animate="animate"
        className="absolute bottom-1/3 left-1/6 text-4xl opacity-15"
        style={{ animationDelay: '7s' }}
      >
        🎨
      </motion.div>

      <motion.div
        variants={fastFloatVariants}
        animate="animate"
        className="absolute top-2/3 right-1/6 text-3xl opacity-20"
        style={{ animationDelay: '8s' }}
      >
        🚀
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/2 left-1/6 text-4xl opacity-12"
        style={{ animationDelay: '9s' }}
      >
        💫
      </motion.div>

      <motion.div
        variants={slowFloatVariants}
        animate="animate"
        className="absolute bottom-1/2 right-1/3 text-3xl opacity-18"
        style={{ animationDelay: '10s' }}
      >
        🎭
      </motion.div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'easeInOut' as any,
          }}
        />
      ))}

      {/* Additional floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'easeInOut' as any,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffects;