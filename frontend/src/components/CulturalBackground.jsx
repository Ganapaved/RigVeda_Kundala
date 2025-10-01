import React from 'react';
import { useSpring, animated, useTrail } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const FloatingOm = ({ delay = 0, size = 'text-4xl' }) => {
  const float = useSpring({
    from: { transform: 'translateY(0px) rotate(0deg)', opacity: 0.3 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-20px) rotate(180deg)', opacity: 0.6 });
        await next({ transform: 'translateY(0px) rotate(360deg)', opacity: 0.3 });
      }
    },
    config: { duration: 4000 + delay * 1000 },
  });

  return (
    <animated.div
      style={float}
      className={`absolute ${size} text-saffron-400 select-none pointer-events-none`}
    >
      ॐ
    </animated.div>
  );
};

const SpinningMandala = ({ size = 'w-32 h-32', position }) => {
  const spin = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: 20000 },
    loop: true,
  });

  return (
    <animated.div
      style={spin}
      className={`absolute ${size} ${position} opacity-10 pointer-events-none`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-vedic-600">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50,5 L55,20 L50,15 L45,20 Z" fill="currentColor" />
        <path d="M95,50 L80,55 L85,50 L80,45 Z" fill="currentColor" />
        <path d="M50,95 L45,80 L50,85 L55,80 Z" fill="currentColor" />
        <path d="M5,50 L20,45 L15,50 L20,55 Z" fill="currentColor" />
      </svg>
    </animated.div>
  );
};

const LotusPetal = ({ delay = 0 }) => {
  const float = useSpring({
    from: { transform: 'translateY(100vh) rotate(0deg)', opacity: 0 },
    to: { transform: 'translateY(-100px) rotate(360deg)', opacity: 1 },
    config: { duration: 8000 + delay * 1000 },
    loop: true,
  });

  return (
    <animated.div
      
      className="absolute text-lotus-300 text-2xl select-none pointer-events-none"
      style={{
        ...float,
        left: `${Math.random() * 100}%`,
      }}
    >
      🪷
    </animated.div>
  );
};

const SacredFlame = ({ position }) => {
  const flicker = useSpring({
    from: { transform: 'scale(1) translateY(0px)', opacity: 0.4 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.1) translateY(-5px)', opacity: 0.7 });
        await next({ transform: 'scale(0.9) translateY(2px)', opacity: 0.5 });
        await next({ transform: 'scale(1) translateY(0px)', opacity: 0.4 });
      }
    },
    config: { duration: 1500 },
  });

  return (
    <animated.div
      style={flicker}
      className={`absolute ${position} text-6xl select-none pointer-events-none`}
    >
      🔥
    </animated.div>
  );
};

const CulturalBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 via-lotus-50 to-vedic-50" />
      
      {/* Floating Om Symbols */}
      <FloatingOm delay={0} size="text-6xl" />
      <FloatingOm delay={2} size="text-4xl" />
      <FloatingOm delay={4} size="text-5xl" />
      
      {/* Spinning Mandalas */}
      <SpinningMandala size="w-64 h-64" position="top-10 right-10" />
      <SpinningMandala size="w-48 h-48" position="bottom-20 left-10" />
      <SpinningMandala size="w-32 h-32" position="top-1/2 left-1/4" />
      
      {/* Floating Lotus Petals */}
      {[...Array(5)].map((_, i) => (
        <LotusPetal key={i} delay={i * 2} />
      ))}
      
      {/* Sacred Flames */}
      <SacredFlame position="top-20 left-20" />
      <SacredFlame position="bottom-32 right-32" />
      
      {/* Sacred Geometry Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #f59e0b 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #6366f1 2px, transparent 2px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>
    </div>
  );
};

export default CulturalBackground;