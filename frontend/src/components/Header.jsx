import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Flame, BookOpen, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const headerAnimation = useSpring({
    from: { y: -100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { tension: 280, friction: 60 }
  });

  const omPulse = useSpring({
    from: { transform: 'scale(1)', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.1)', textShadow: '0 0 20px rgba(245, 158, 11, 0.8)' });
        await next({ transform: 'scale(1)', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' });
      }
    },
    config: { duration: 2000 }
  });

  return (
    <animated.header 
      style={headerAnimation}
      className="bg-gradient-to-r from-saffron-900/90 via-temple-800/90 to-vedic-900/90 backdrop-blur-md border-b-2 border-gold-400 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-saffron-400 via-gold-500 to-vedic-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <animated.span 
                  style={omPulse}
                  className="text-white font-bold text-2xl"
                >
                  ॐ
                </animated.span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-lotus-400 rounded-full animate-pulse" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-300 to-saffron-200 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold-300" />
                Rig Veda Explorer
              </h1>
              <p className="text-saffron-200 text-sm flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Mandala 4 - Sacred Hymns
              </p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg ${
                location.pathname === '/' 
                  ? 'text-gold-300 bg-white/10 shadow-lg font-semibold' 
                  : 'text-saffron-200 hover:text-gold-300 hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4" />
              Sacred Suktas
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-saffron-200 hover:text-gold-300 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-saffron-200 hover:text-gold-300 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative border */}
      <div className="h-1 bg-gradient-to-r from-saffron-400 via-gold-500 to-vedic-500" />
    </animated.header>
  );
};

export default Header;