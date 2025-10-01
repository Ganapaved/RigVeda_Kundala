import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Sparkles, TrendingUp, ChartPie as PieChartIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const COLORS = ['#f59e0b', '#6366f1', '#ec4899', '#10b981', '#8b5cf6', '#06b6d4'];

const FloatingSymbol = ({ symbol, delay = 0 }) => {
  const float = useSpring({
    from: { transform: 'translateY(0px)', opacity: 0.4 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)', opacity: 0.7 });
        await next({ transform: 'translateY(0px)', opacity: 0.4 });
      }
    },
    config: { duration: 2000 + delay * 500 },
  });

  return (
    <animated.div
      
      className="absolute text-2xl select-none pointer-events-none"
      style={{
        ...float,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      {symbol}
    </animated.div>
  );
};

const VisualizationTab = ({ suktaId, selectedVerse }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChart, setActiveChart] = useState('words');

  const chartAnimation = useSpring({
    opacity: data ? 1 : 0,
    transform: data ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

  const fetchVisualizationData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/visualize/sukta/${suktaId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const visualData = await response.json();
      setData(visualData);
    } catch (err) {
      setError('Failed to load visualization data');
      console.error('Error fetching visualization data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisualizationData();
  }, [suktaId]);

  if (loading) {
    return (
      <div className="cultural-card p-8 relative">
        {[...Array(6)].map((_, i) => (
          <FloatingSymbol key={i} symbol="📊" delay={i} />
        ))}
        <div className="text-center relative z-10">
          <div className="text-5xl mb-4 om-glow">📊</div>
          <LoadingSpinner />
          <p className="text-temple-700 mt-4 text-lg">Loading Sacred Analytics...</p>
          <div className="flex justify-center space-x-4 mt-4 text-xl">
            <span className="animate-bounce-gentle">🔢</span>
            <span className="animate-pulse">📈</span>
            <span className="animate-bounce-gentle">🔢</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cultural-card p-6 relative">
        {[...Array(3)].map((_, i) => (
          <FloatingSymbol key={i} symbol="⚠️" delay={i} />
        ))}
        <ErrorMessage message={error} onRetry={fetchVisualizationData} />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating background elements */}
      {[...Array(8)].map((_, i) => (
        <FloatingSymbol key={i} symbol={['📊', '📈', '🔢', '📉'][i % 4]} delay={i * 0.5} />
      ))}

      {/* Chart Selection */}
      <animated.div style={chartAnimation} className="relative z-10">
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={() => setActiveChart('words')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              activeChart === 'words'
                ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-glow'
                : 'bg-white/70 text-temple-700 hover:bg-saffron-50'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Word Frequency</span>
          </button>
          <button
            onClick={() => setActiveChart('deities')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              activeChart === 'deities'
                ? 'bg-gradient-to-r from-vedic-500 to-sacred-500 text-white shadow-glow'
                : 'bg-white/70 text-temple-700 hover:bg-vedic-50'
            }`}
          >
            <PieChartIcon className="w-5 h-5" />
            <span>Deity Mentions</span>
          </button>
        </div>
      </animated.div>

      {/* Word Frequency Chart */}
      <AnimatePresence mode="wait">
        {activeChart === 'words' && (
          <motion.div
            key="words"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="cultural-card p-8 relative z-10"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Sacred Word Frequency
              </h3>
              <p className="text-temple-600 mt-2">Most frequently used words in this sukta</p>
            </div>
            {data?.wordFrequency?.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.wordFrequency} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.3} />
                  <XAxis 
                    dataKey="word" 
                    stroke="#92400e"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontWeight="bold"
                  />
                  <YAxis stroke="#92400e" fontSize={12} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fffbeb', 
                      border: '2px solid #fbbf24',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
                      color: '#92400e',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#wordGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="wordGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-temple-600">No word frequency data available for this sukta</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Deity Mentions Chart */}
        {activeChart === 'deities' && (
          <motion.div
            key="deities"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="cultural-card p-8 relative z-10"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🏺</div>
              <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
                <PieChartIcon className="w-6 h-6" />
                Divine Invocations
              </h3>
              <p className="text-temple-600 mt-2">Deities mentioned in this sacred sukta</p>
            </div>
            {data?.deityMentions?.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.deityMentions}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="count"
                        nameKey="deity"
                      >
                        {data.deityMentions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f0f4ff', 
                          border: '2px solid #6366f1',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
                          color: '#312e81',
                          fontWeight: 'bold'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="space-y-4">
                    {data.deityMentions.map((deity, index) => (
                      <div key={deity.deity} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-white/60 to-saffron-50/40 rounded-lg border border-gold-200">
                        <div 
                          className="w-6 h-6 rounded-full shadow-md" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="capitalize font-bold text-temple-700 text-lg">{deity.deity}</span>
                        <span className="bg-saffron-100 text-saffron-700 px-3 py-1 rounded-full text-sm font-bold">
                          {deity.count} mentions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🙏</div>
                <p className="text-temple-600">No deity mentions detected in this sukta</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <animated.div
        style={chartAnimation}
        className="cultural-card p-8 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📈</div>
          <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Sacred Statistics
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-saffron-50 to-gold-50 rounded-xl p-6 text-center border-2 border-saffron-200 shadow-cultural">
            <div className="text-3xl font-bold text-saffron-600 mb-2">{data?.mantraCount || 0}</div>
            <div className="text-temple-600 font-medium flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Sacred Verses
            </div>
          </div>
          <div className="bg-gradient-to-br from-vedic-50 to-sacred-50 rounded-xl p-6 text-center border-2 border-vedic-200 shadow-cultural">
            <div className="text-3xl font-bold text-vedic-600 mb-2">{data?.wordFrequency?.length || 0}</div>
            <div className="text-temple-600 font-medium flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Unique Words
            </div>
          </div>
          <div className="bg-gradient-to-br from-lotus-50 to-temple-50 rounded-xl p-6 text-center border-2 border-lotus-200 shadow-cultural">
            <div className="text-3xl font-bold text-lotus-600 mb-2">{data?.deityMentions?.length || 0}</div>
            <div className="text-temple-600 font-medium flex items-center justify-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Divine Beings
            </div>
          </div>
        </div>
        
        {selectedVerse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-sacred-50 to-vedic-50 rounded-xl border-l-4 border-sacred-400"
          >
            <p className="text-sacred-700 font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <strong>Selected Verse:</strong> {selectedVerse}
            </p>
            <p className="text-sacred-600 text-sm mt-1">
              Click on any verse in the text tabs to see detailed analysis here.
            </p>
          </motion.div>
        )}
      </animated.div>

      {/* Cultural Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cultural-card p-6 text-center relative z-10"
      >
        <div className="text-3xl mb-3 om-glow">🕉️</div>
        <blockquote className="text-lg font-devanagari text-saffron-700 mb-2 sanskrit-glow">
          यत्र विश्वं भवत्येकनीडम्
        </blockquote>
        <p className="text-temple-700 italic text-sm">
          "Where the universe becomes one nest"</p>
        
      </motion.div>
    </div>
  );
};

const BookOpen = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default VisualizationTab;