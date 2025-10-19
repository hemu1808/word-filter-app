import React from 'react';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface RainDrop {
  id: number;
  x: number;
  speed: number;
  delay: number;
}

const Fireflies: React.FC = () => {
  const fireflies: Firefly[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute rounded-full bg-yellow-300 shadow-lg"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            width: `${firefly.size}px`,
            height: `${firefly.size}px`,
            animation: `fireflies ${firefly.speed + 2}s ease-in-out infinite`,
            animationDelay: `${firefly.delay}s`,
            boxShadow: '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 30px #d97706',
          }}
        />
      ))}
    </div>
  );
};

const Stars: React.FC = () => {
  const stars: Star[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${Math.random() * 2 + 2}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const Rain: React.FC = () => {
  const raindrops: RainDrop[] = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    speed: Math.random() * 2 + 1,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px bg-blue-300 opacity-60"
          style={{
            left: `${drop.x}%`,
            height: '20px',
            animation: `rain ${drop.speed + 1}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const Sparkles: React.FC = () => {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `sparkles ${Math.random() * 2 + 2}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-80"></div>
        </div>
      ))}
    </div>
  );
};

interface MagicalEffectsProps {
  theme: string;
}

const MagicalEffects: React.FC<MagicalEffectsProps> = ({ theme }) => {
  return (
    <>
      {theme === 'forest' && <Fireflies />}
      {theme === 'space' && <Stars />}
      {theme === 'ocean' && <Rain />}
      {theme === 'rainbow' && <Sparkles />}
      {theme === 'witch' && (
        <>
          <Stars />
          <Sparkles />
        </>
      )}
    </>
  );
};

export default MagicalEffects;
