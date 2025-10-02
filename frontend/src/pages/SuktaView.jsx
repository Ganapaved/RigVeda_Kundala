import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSpring, animated, useTrail } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, BookOpen, Sparkles, Crown, Star, ArrowLeft, Languages } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import VisualizationTab from '../components/VisualizationTab';
import ReactMarkdown from 'react-markdown';
import QuizResult from '../components/QuixResult';
import QuizTab from '../components/QuizTab';
import { apiCall } from '../utilis/api';


const translations = {
  en: {
    return: "Return to Sacred Suktas",
    deity: "Deity",
    rishi: "Rishi",
    verses: "Verses",
    tabs: {
      english: "English",
      sanskrit: "Sanskrit",
      summary: "Summary",
      visualization: "Visualization",
      quiz: "Quiz",
    },
    loading: "Loading Sacred Sukta...",
    loadingSub: "Preparing divine verses for your spiritual journey",
    notFound: "Sukta not found in the sacred texts.",
    summaryGen: "Generate Sacred Summary",
    summaryGenText: "Generate an AI-powered summary of this sacred sukta",
    summaryTitle: "Divine Summary",
    quote: '"Truth, Knowledge, Infinity is Brahman"',
  },
  sa: {
    return: "पवित्रसूक्तेषु प्रत्यागच्छतु",
    deity: "देवता",
    rishi: "ऋषिः",
    verses: "ऋचः",
    tabs: {
      english: "आङ्ग्लभाषा",
      sanskrit: "संस्कृतम्",
      summary: "सारः",
      visualization: "दृश्यरूपम्",
      quiz: "प्रश्नोत्तरी",
    },
    loading: "पवित्रसूक्तं लोड् क्रियते...",
    loadingSub: "भवतः आध्यात्मिकयात्रायै दिव्यश्लोकाः सज्जीक्रियन्ते",
    notFound: "सूक्तं पवित्रग्रन्थेषु न लभ्यते",
    summaryGen: "पवित्रसारः उत्पाद्यताम्",
    summaryGenText: "अस्य सूक्तस्य कृत्रिमबुद्ध्या उत्पादितः सारः",
    summaryTitle: "दिव्यसारः",
    quote: "सत्यं ज्ञानमनन्तं ब्रह्म",

  },
};

const FloatingOm = ({ delay = 0 }) => {
  const float = useSpring({
    from: { transform: 'translateY(0px) rotate(0deg)', opacity: 0.3 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-15px) rotate(180deg)', opacity: 0.6 });
        await next({ transform: 'translateY(0px) rotate(360deg)', opacity: 0.3 });
      }
    },
    config: { duration: 3000 + delay * 500 },
  });

  return (
    <animated.div
      
      className="absolute text-2xl text-saffron-400 select-none pointer-events-none"
      style={{
        ...float,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      ॐ
    </animated.div>
  );
};

const SacredFlame = ({ position }) => {
  const flicker = useSpring({
    from: { transform: 'scale(1)', opacity: 0.6 },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.2)', opacity: 0.8 });
        await next({ transform: 'scale(0.9)', opacity: 0.4 });
        await next({ transform: 'scale(1)', opacity: 0.6 });
      }
    },
    config: { duration: 1200 },
  });

  return (
    <animated.div
      style={flicker}
      className={`absolute ${position} text-3xl select-none pointer-events-none`}
    >
      🔥
    </animated.div>
  );
};

const SuktaView = () => {
  const { id } = useParams();
  const [sukta, setSukta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('english');
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [lang, setLang] = useState('en'); // toggle language
  const [quizResults, setQuizResults] = useState(null);

  const t = translations[lang];

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Move useTrail to top level - must be called before any conditional returns
  const trail = useTrail(sukta?.mantras?.length || 0, {
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.95)',
    config: { tension: 280, friction: 60 }
  });

  const headerAnimation = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(30px)',
    config: { tension: 280, friction: 60 }
  });

  const contentAnimation = useSpring({
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

  const fetchSukta = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall(`/api/mandala/4/sukta/${id}`);
      
      
      
      
      setSukta(data);
    } catch (err) {
      setError('Failed to load sukta. Please check if the backend server is running.');
      console.error('Error fetching sukta:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const response = await apiCall('/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({
          mandala: 4,
          sukta: parseInt(id),
        }),
      });

     

      const data = response;
      setSummary(data.summary);
    } catch (err) {
      console.error('Error generating summary:', err);
      setSummary('Unable to generate summary at this time.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
  };

  const handleRetakeQuiz = () => {
    setQuizResults(null);
  };

  useEffect(() => {
    fetchSukta();
  }, [id]);

  const tabs = [
    { id: 'english', label: t.tabs.english, icon: '📖', color: 'from-saffron-500 to-gold-500' },
    { id: 'sanskrit', label: t.tabs.sanskrit, icon: '🕉️', color: 'from-vedic-500 to-sacred-500' },
    { id: 'summary', label: t.tabs.summary, icon: '📝', color: 'from-lotus-500 to-temple-500' },
    { id: 'visualization', label: t.tabs.visualization, icon: '📊', color: 'from-gold-500 to-saffron-600' },
    { id: 'quiz', label: t.tabs.quiz, icon: '🧠', color: 'from-purple-500 to-indigo-600' },
  ];

  const LangToggle = ()=>(
    <button
      onClick={()=>setLang(lang==='en'?'sa':'en')}
      className="fixed top-4 right-6 bg-gradient-to-r from-saffron-500 to-vedic-500 text-white px-4 py-2 rounded-xl shadow-cultural hover:shadow-glow flex items-center gap-2 z-50"
      >
        <Languages className='w-4 h-4'/>
        {lang==='en'?'संस्कृतम्':'English'}

      </button>
  );

  function formatNumber(num,lang) {
    if(lang === 'sa'){
      return new Intl.NumberFormat('hi-IN-u-nu-deva').format(num);
    }
    return num;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <LangToggle/>
        {/* Cultural background elements */}
        {[...Array(8)].map((_, i) => (
          <FloatingOm key={i} delay={i} />
        ))}
        <SacredFlame position="top-10 left-10" />
        <SacredFlame position="bottom-10 right-10" />
        
        <div className="cultural-card p-12 text-center relative z-10">
          <div className="text-6xl mb-6 om-glow animate-pulse-glow">ॐ</div>
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-temple-700 font-medium text-xl">{t.loading}</p>
          <p className="text-saffron-600 mt-2">{t.loadingSub}</p>
          <div className="flex justify-center space-x-4 mt-4 text-2xl">
            <span className="animate-bounce-gentle">🪷</span>
            <span className="animate-pulse">🔥</span>
            <span className="animate-bounce-gentle">🪷</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 relative">
        <LangToggle />
        {[...Array(5)].map((_, i) => (
          <FloatingOm key={i} delay={i} />
        ))}
        <ErrorMessage message={error} onRetry={fetchSukta} />
      </div>
    );
  }

  if (!sukta) {
    return (
      <div className="text-center py-12 relative">
        <LangToggle />
        {[...Array(5)].map((_, i) => (
          <FloatingOm key={i} delay={i} />
        ))}
        <div className="cultural-card p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-temple-700 mb-4" style={{ whiteSpace: 'pre-line' }}>
            {t.notFound}
          </p>
          <Link to="/" className="text-sacred-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.return}
          </Link>
        </div>
      </div>
    );
  }

 

  return (
    <div className="max-w-6xl mx-auto relative">
      <LangToggle/>
      {/* Cultural background elements */}
      {[...Array(12)].map((_, i) => (
        <FloatingOm key={i} delay={i * 0.5} />
      ))}
      <SacredFlame position="top-5 left-5" />
      <SacredFlame position="top-5 right-5" />
      <SacredFlame position="bottom-20 left-10" />
      <SacredFlame position="bottom-20 right-10" />

      {/* Header */}
      <animated.div
        ref={headerRef}
        style={headerAnimation}
        className="mb-8 relative z-10"
      >
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-sacred-600 hover:text-gold-600 mb-6 p-3 rounded-lg hover:bg-white/20 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t.return}</span>
        </Link>
        
        <div className="cultural-card p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <LangToggle />
          <div className="absolute top-4 left-4 text-3xl text-saffron-300 animate-spin-slow">🕉️</div>
          <div className="absolute top-4 right-4 text-3xl text-lotus-300 lotus-bloom">🪷</div>
          <div className="absolute bottom-4 left-4 text-2xl text-gold-400 animate-bounce-gentle">👑</div>
          <div className="absolute bottom-4 right-4 text-2xl text-vedic-400 animate-pulse">⭐</div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="text-5xl om-glow mb-4">ॐ</div>
              <h1 className="text-5xl font-devanagari md:text-5xl font-bold gradient-text mb-3"
              style={{ background: 'saffron' }}>
                चतुर्थ मण्डल · सूक्त {sukta.sukta}
              </h1>
              <div className="text-2xl font-devanagari text-saffron-700 mb-4 sanskrit-glow">
                Mandala 4 · Sukta {sukta.sukta}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-saffron-50 p-4 rounded-xl border-2 border-saffron-200 text-center">
                <Crown className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
                <div className="text-sm text-temple-600 font-medium">{t.deity}</div>
                <div className="text-xl font-bold text-saffron-700">{lang === 'en' ? sukta.deity_english : sukta.deity_sanskrit}</div>
              </div>
              
              <div className="bg-vedic-50 p-4 rounded-xl border-2 border-vedic-200 text-center">
                <Flame className="w-8 h-8 text-vedic-600 mx-auto mb-2" />
                <div className="text-sm text-temple-600 font-medium">{t.rishi}</div>
                <div className="text-xl font-bold text-vedic-700">{lang === 'en' ? sukta.rishi_english : sukta.rishi_sanskrit}</div>
              </div>
              
              <div className="bg-gold-50 p-4 rounded-xl border-2 border-gold-200 text-center">
                <BookOpen className="w-8 h-8 text-gold-600 mx-auto mb-2" />
                <div className="text-sm text-temple-600 font-medium">{t.verses}</div>
                <div className="text-xl font-bold text-gold-700">{formatNumber(sukta.mantras.length,lang)}</div>
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Tabs */}
      <animated.div
        style={contentAnimation}
        className="mb-8 relative z-10"
      >
        <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-gold-200 shadow-cultural">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-500 font-medium border-2 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-glow border-gold-300 transform scale-105`
                  : 'bg-white/70 text-temple-700 hover:bg-saffron-50 hover:border-saffron-300 hover:shadow-md border-transparent'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </animated.div>

      {/* Tab Content */}
      <div ref={contentRef} className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* English Tab */}
            {activeTab === 'english' && (
              <div className="space-y-6">
                {trail.map((style, index) => {
                  const mantra = sukta.mantras[index];
                  if (!mantra) return null;
                  
                  return (
                    <animated.div
                      key={mantra.verse}
                      style={style}
                      className={`cultural-card p-8 cursor-pointer transition-all duration-500 ${
                        selectedVerse === mantra.verse 
                          ? 'ring-4 ring-sacred-300 shadow-glow transform scale-105' 
                          : 'hover:shadow-sacred hover:-translate-y-2'
                      }`}
                      onClick={() => setSelectedVerse(mantra.verse)}
                    >
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-saffron-400 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-cultural">
                          {mantra.verse}
                        </div>
                        <div className="flex-1">
                          <p className="english-text text-lg leading-relaxed">{mantra.english_griffith}</p>
                          {selectedVerse === mantra.verse && (
                            <div className="mt-4 p-3 bg-sacred-50 rounded-lg border-l-4 border-sacred-400">
                              <p className="text-sm text-sacred-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <strong>Selected Verse:</strong> This verse is highlighted for detailed analysis
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </animated.div>
                  );
                })}
              </div>
            )}

            {/* Sanskrit Tab */}
            {activeTab === 'sanskrit' && (
              <div className="space-y-8">
                {trail.map((style, index) => {
                  const mantra = sukta.mantras[index];
                  if (!mantra) return null;
                  
                  return (
                    <animated.div
                      key={mantra.verse}
                      style={style}
                      className={`cultural-card p-8 cursor-pointer transition-all duration-500 ${
                        selectedVerse === mantra.verse 
                          ? 'ring-4 ring-vedic-300 shadow-glow transform scale-105' 
                          : 'hover:shadow-sacred hover:-translate-y-2'
                      }`}
                      onClick={() => setSelectedVerse(mantra.verse)}
                    >
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-vedic-400 to-sacred-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-cultural">
                          {mantra.verse}
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="bg-saffron-50 p-4 rounded-lg border-l-4 border-saffron-400">
                            <p className="sanskrit-text text-2xl text-temple-800"
                            style={{ whiteSpace: 'pre-line' }}>
                              {mantra.sanskrit_devanagari}
                            </p>
                          </div>
                          <div className="bg-vedic-50 p-4 rounded-lg border-l-4 border-vedic-400">
                            <p className="font-mono text-vedic-700 text-lg"
                            style={{ whiteSpace: 'pre-line' }}>
                              {mantra.sanskrit_iast}
                            </p>
                          </div>
                          <div className="bg-lotus-50 p-4 rounded-lg border-l-4 border-lotus-400">
                            <p className="english-text text-temple-700"
                            style={{ whiteSpace: 'pre-line' }}>
                              {mantra.english_griffith}
                            </p>
                          </div>
                        </div>
                      </div>
                    </animated.div>
                  );
                })}
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="cultural-card p-8">
                {!summary && !loadingSummary && (
                  <div className="text-center">
                    <div className="text-6xl mb-6 om-glow">🕉️</div>
                    <p className="text-temple-700 mb-6 text-lg">
                      {t.summaryGen}
                    </p>
                    {/* Note icon with tooltip */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 16,
                          zIndex: 10,
                          cursor: 'pointer',
                          display: 'inline-block',
                        }}
                        tabIndex={0}
                        aria-label="AI summary info"
                      >
                        <span
                          style={{
                            fontSize: 22,
                            color: '#b48a2c',
                            background: 'rgba(255,255,255,0.85)',
                            borderRadius: '50%',
                            padding: '6px',
                            boxShadow: '0 2px 8px rgba(180,138,44,0.08)',
                            border: '1px solid #f3e6c4',
                            transition: 'box-shadow 0.2s',
                          }}
                          onMouseOver={e => {
                            const tooltip = e.currentTarget.nextSibling;
                            tooltip.style.opacity = 1;
                            tooltip.style.pointerEvents = 'auto';
                          }}
                          onMouseOut={e => {
                            const tooltip = e.currentTarget.nextSibling;
                            tooltip.style.opacity = 0;
                            tooltip.style.pointerEvents = 'none';
                          }}
                          onFocus={e => {
                            const tooltip = e.currentTarget.nextSibling;
                            tooltip.style.opacity = 1;
                            tooltip.style.pointerEvents = 'auto';
                          }}
                          onBlur={e => {
                            const tooltip = e.currentTarget.nextSibling;
                            tooltip.style.opacity = 0;
                            tooltip.style.pointerEvents = 'none';
                          }}
                        >
                          ♦️
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            background: 'rgba(255,255,255,0.98)',
                            color: '#7c5a1a',
                            fontSize: 14,
                            padding: '10px 16px',
                            borderRadius: 8,
                            boxShadow: '0 4px 16px rgba(180,138,44,0.13)',
                            border: '1px solid #f3e6c4',
                            opacity: 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s',
                            minWidth: 220,
                            maxWidth: 260,
                            zIndex: 100,
                            textAlign: 'left',
                          }}
                        >
                          {t.summaryGenText}
                        </span>
                      </div>
                    <button
                      onClick={fetchSummary}
                      className="bg-gradient-to-r from-lotus-500 to-temple-500 text-white px-8 py-4 rounded-xl hover:from-lotus-600 hover:to-temple-600 transition-all duration-300 shadow-cultural hover:shadow-glow transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                      <Sparkles className="w-5 h-5" />
                      {t.summaryGen}
                    </button>
                  </div>
                )}
                
                {loadingSummary && (
                  <div className="text-center">
                    <div className="text-6xl mb-6 om-glow animate-pulse-glow">ॐ</div>
                    <LoadingSpinner />
                    <p className="text-temple-700 mt-4 text-lg">Channeling divine wisdom...</p>
                    <div className="flex justify-center space-x-4 mt-4 text-2xl">
                      <span className="animate-bounce-gentle">🪷</span>
                      <span className="animate-pulse">🔥</span>
                      <span className="animate-bounce-gentle">🪷</span>
                    </div>
                  </div>
                )}
                
                {summary && (
                  <div className="prose max-w-none">
                    <div className="text-center mb-6">
                      <div className="text-4xl om-glow">🕉️</div>
                    </div>
                    <h3 className="text-2xl font-bold gradient-text mb-6 text-center">
                      {t.summaryTitle}
                    </h3>
                    <div className="bg-gradient-to-r from-saffron-50 to-lotus-50 p-6 rounded-xl border-2 border-gold-200" style={{ position: 'relative' }}>

                      <p className="english-text text-temple-800 leading-relaxed text-lg">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                      </p>
                    </div>
                    <div className="text-center mt-6">
                      <button
                        onClick={() => {
                          setSummary('');
                          fetchSummary();
                        }}
                        className="text-sacred-600 hover:text-gold-600 hover:underline flex items-center gap-2 mx-auto transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate New Summary
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Visualization Tab */}
            {activeTab === 'visualization' && (
              <VisualizationTab suktaId={id} selectedVerse={selectedVerse} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <>
              {!quizResults ? (
                <QuizTab suktaId={id} onQuizComplete={handleQuizComplete} lang />
              ) : (
                <QuizResult results={quizResults} onRetakeQuiz={handleRetakeQuiz} />
              )}
            </>
          )}

      {/* Sacred Quote */}
      <animated.div
        style={contentAnimation}
        className="mt-16 text-center relative z-10"
      >
        <div className="cultural-card p-8 max-w-3xl mx-auto">
          <div className="text-4xl mb-4 om-glow">🕉️</div>
          <blockquote className="text-xl font-devanagari text-saffron-700 mb-3 sanskrit-glow">
            सत्यं ज्ञानमनन्तं ब्रह्म
          </blockquote>
          <p className="text-temple-700 italic">
            "Truth, Knowledge, Infinity is Brahman"
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-2xl">
            <span className="animate-bounce-gentle">🪷</span>
            <span className="animate-pulse">🔥</span>
            <span className="animate-bounce-gentle">🪷</span>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default SuktaView;