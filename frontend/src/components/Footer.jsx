import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Heart, Bot as Lotus, Flame } from 'lucide-react';

const Footer = () => {
  const footerAnimation = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    config: { tension: 280, friction: 60 }
  });

  const flameAnimation = useSpring({
    from: { transform: 'scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.2)' });
        await next({ transform: 'scale(1)' });
      }
    },
    config: { duration: 2000 }
  });

  return (
    <animated.footer 
      style={footerAnimation}
      className="bg-gradient-to-r from-temple-900 via-saffron-900 to-vedic-900 border-t-2 border-gold-400 mt-auto"
    >
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-saffron-400 via-gold-500 to-vedic-500" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          {/* Sacred symbols */}
          <div className="flex justify-center items-center space-x-8 text-gold-300">
            <animated.div style={flameAnimation}>
              <Flame className="w-8 h-8" />
            </animated.div>
            <div className="text-4xl">ॐ</div>
            <div className="text-3xl">🪷</div>
            <div className="text-3xl">🕉️</div>
            <animated.div style={flameAnimation}>
              <Flame className="w-8 h-8" />
            </animated.div>
          </div>

          {/* Attribution */}
          <div className="text-saffron-200 space-y-3 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-gold-400/20">
              <p className="text-sm leading-relaxed">
                <span className="text-gold-300 font-semibold">Sanskrit Text:</span> VedaWeb (Universität zu Köln) • 
                <span className="text-gold-300 font-semibold"> English Translation:</span> R.T.H. Griffith (1896) — Public Domain
              </p>
              <p className="text-sm leading-relaxed mt-2">
                <span className="text-gold-300 font-semibold">AI Summaries:</span> Generated for demonstration • 
                <span className="text-gold-300 font-semibold">Built with</span> 
                <Heart className="inline w-4 h-4 mx-1 text-lotus-400" />
                <span className="text-gold-300 font-semibold">for the Rig Veda Hackathon</span>
              </p>
            </div>
          </div>

          {/* Copyright and links */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-saffron-300">
            <span className="flex items-center gap-1">
              <span className="text-gold-400">©</span> 2024 Rig Veda Explorer
            </span>
            <span className="hidden md:block text-gold-400">•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Educational Purpose
            </span>
            <span className="hidden md:block text-gold-400">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Open Source
            </span>
          </div>

          {/* Sacred mantra */}
          <div className="text-center pt-4 border-t border-gold-400/20">
            <p className="text-gold-300 font-devanagari text-lg">
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </p>
            <p className="text-saffron-200 text-sm mt-1 italic">
              "May all beings be happy, may all beings be free from disease"
            </p>
          </div>
        </div>
      </div>
    </animated.footer>
  );
};

const BookOpen = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default Footer;