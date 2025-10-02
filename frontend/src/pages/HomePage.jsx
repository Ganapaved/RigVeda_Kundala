import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated, useTrail } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { Flame, BookOpen, Sparkles, Crown, Star ,Languages} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { apiCall } from '../utilis/api';


const rotatingTexts = [
  {
    lang: "en",
    text: "Journey through the sacred hymns of the fourth mandala of the Rig Veda. Each sukta contains profound wisdom and devotional verses dedicated to various deities, preserving the eternal spiritual heritage of ancient India."
  },
  {
    lang: "sa",
    text: "ऋग्वेदस्य चतुर्थमण्डलस्य पावनानि सूक्तानि अन्वेषय। प्रत्येकं सूक्तं गहनं ज्ञानं च भक्तिपूर्णं स्तोत्रं च विभिन्नदेवताभ्यः अर्पितं धारयति।"
  },
  {
    lang: "hi",
    text: "ऋग्वेद के चौथे मंडल के पवित्र सूक्तों की यात्रा करें। प्रत्येक सूक्त गहन ज्ञान और भक्ति से परिपूर्ण श्लोकों को समाहित करता है, जो विभिन्न देवताओं को समर्पित हैं और भारत की शाश्वत आध्यात्मिक धरोहर को सुरक्षित रखते हैं।"
  },
  {
    lang: "kn",
    text: "ಋಗ್ವೇದದ ನಾಲ್ಕನೇ ಮಂಡಲದ ಪವಿತ್ರ ಸೂಕ್ತಗಳಲ್ಲಿ ಪಯಣ ಮಾಡಿ. ಪ್ರತಿ ಸೂಕ್ತವು ಗಾಢ ಜ್ಞಾನ ಮತ್ತು ಭಕ್ತಿ ತುಂಬಿದ ಶ್ಲೋಕಗಳನ್ನು ಹೊಂದಿದ್ದು, ವಿಭಿನ್ನ ದೈವಗಳಿಗೆ ಸಮರ್ಪಿತವಾಗಿದೆ ಹಾಗೂ ಭಾರತದ ಶಾಶ್ವತ ಆಧ್ಯಾತ್ಮಿಕ ಪರಂಪರೆಯನ್ನು ಉಳಿಸಿಕೊಂಡಿದೆ."
  }
];

const HomePage = () => {
  const [suktas, setSuktas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [lang, setLang] = useState('en'); // toggle language

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const headerAnimation = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 }
  });

  const trail = useTrail(suktas.length, {
    opacity: cardsInView ? 1 : 0,
    transform: cardsInView ? 'translateY(0px) scale(1)' : 'translateY(50px) scale(0.9)',
    config: { tension: 280, friction: 60 }
  });

  const fetchSuktas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall('/api/mandala/4');
      
      
      
      setSuktas(data.suktas);
    } catch (err) {
      setError('Failed to load suktas. Please check if the backend server is running.');
      console.error('Error fetching suktas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuktas();
  }, []);

  useEffect(()=>{
    const interval = setInterval(() => {
      setCurrentTextIndex((previndex)=>(previndex + 1) % rotatingTexts.length);
    }, 5*10*1000);

    return ()=>clearInterval(interval);
  },[]);


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
      <div className="text-center py-20">
        <div className="cultural-card max-w-md mx-auto p-8">
          <div className="text-6xl mb-4 om-glow">ॐ</div>
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-temple-700 font-medium">Loading Sacred Hymns...</p>
          <p className="text-sm text-saffron-600 mt-2">Preparing the divine verses of Mandala 4</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorMessage message={error} onRetry={fetchSuktas} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <animated.div
        ref={headerRef}
        style={headerAnimation}
        className="text-center mb-16"
      >
        <div className="cultural-card p-12 mb-8 relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-4xl text-saffron-300 animate-spin-slow">🕉️</div>
          <div className="absolute top-4 right-4 text-4xl text-lotus-300 lotus-bloom">🪷</div>
          <div className="absolute bottom-4 left-4 text-3xl text-gold-400 animate-bounce-gentle">🔥</div>
          <div className="absolute bottom-4 right-4 text-3xl text-vedic-400 animate-pulse">⭐</div>
          
          <div className="relative z-10">
            <LangToggle />
            <div className="flex justify-center items-center mb-6">
              <div className="text-8xl om-glow animate-pulse-glow">ॐ</div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 text-shadow">
              चतुर्थ मण्डल
            </h1>
            
            <div className="text-2xl md:text-3xl font-devanagari text-saffron-700 mb-4 sanskrit-glow">
              Mandala 4
            </div>
            
            <motion.p
             key={rotatingTexts[currentTextIndex].lang}
             className="text-xl text-temple-700 max-w-3xl mx-auto leading-relaxed mb-8"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 1.5 }}
            >
              {rotatingTexts[currentTextIndex].text}
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center space-x-3 bg-saffron-100 px-6 py-3 rounded-full">
                <BookOpen className="w-6 h-6 text-saffron-600" />
                <span className="font-semibold text-saffron-800">{lang==='en'?suktas.length : formatNumber(suktas.length,'sa')}</span>
                <span className="text-saffron-700">{lang === 'en'?'Sacred Suktas': ' पवित्राः सूक्ताः'}</span>
              </div>
              <div className="flex items-center space-x-3 bg-vedic-100 px-6 py-3 rounded-full">
                <Sparkles className="w-6 h-6 text-vedic-600" />
                <span className="font-semibold text-vedic-800">
                  {lang==='en' ? suktas.reduce((total, sukta) => total + sukta.mantraCount, 0): formatNumber(suktas.reduce((total, sukta) => total + sukta.mantraCount, 0),'sa')}
                </span>
                <span className="text-vedic-700">{lang === 'en' ? 'Divine Mantras':'दिव्यानि मन्त्राणि'}</span>
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Suktas Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trail.map((style, index) => {
          const sukta = suktas[index];
          if (!sukta) return null;
          
          return (
            <animated.div key={sukta.sukta} style={style}>
              <Link to={`/sukta/${sukta.sukta}`} className="block group">
                <div className="cultural-card p-8 h-full relative overflow-hidden">
                  {/* Decorative corner elements */}
                  <div className="absolute top-2 right-2 text-2xl text-saffron-300 group-hover:animate-spin">
                    🕉️
                  </div>
                  <div className="absolute bottom-2 left-2 text-xl text-lotus-300 group-hover:animate-bounce">
                    🪷
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold gradient-text">
                          { lang === 'en' ? `Sukta ${sukta.sukta}` : `सूक्त ${formatNumber(sukta.sukta,'sa')}` }
                        </h3>
                        <div className="w-10 h-10 bg-gradient-to-br from-saffron-400 to-gold-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform shadow-cultural">
                          {sukta.sukta}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-temple-500 mb-1 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {lang === 'en' ? `${sukta.mantraCount} verses` : `${formatNumber(sukta.mantraCount,'sa')} मन्त्राः`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-4 p-3 bg-saffron-50 rounded-lg">
                        <Crown className="w-5 h-5 text-saffron-600" />
                        <div>
                          <span className="text-sm text-temple-600 font-medium">{lang==='en' ? 'Deity:':'देवता:'}</span>
                          <span className="ml-2 font-bold text-saffron-700 text-lg">{lang === 'en' ? sukta.deity_english : sukta.deity_sanskrit}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-3 bg-vedic-50 rounded-lg">
                        <Flame className="w-5 h-5 text-vedic-600" />
                        <div>
                          <span className="text-sm text-temple-600 font-medium">{lang==='en' ? 'Rishi:':'ऋषिः:'}</span>
                          <span className="ml-2 font-bold text-vedic-700 text-lg">{lang === 'en' ? sukta.rishi_english : sukta.rishi_sanskrit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t-2 border-gold-200">
                      <div className="flex items-center justify-between">
                        <span className="text-temple-600 font-medium flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Explore Sacred Verses
                        </span>
                        <div className="flex items-center space-x-2 text-saffron-600 group-hover:text-gold-600 transition-colors">
                          <span className="text-sm font-medium">Enter</span>
                          <svg 
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </animated.div>
          );
        })}
      </div>

      {/* Sacred Quote Section */}
      <animated.div
        style={headerAnimation}
        className="mt-20 text-center"
      >
        <div className="cultural-card p-10 max-w-4xl mx-auto">
          <div className="text-4xl mb-4 om-glow">🕉️</div>
          <blockquote className="text-2xl font-devanagari text-saffron-700 mb-4 sanskrit-glow">
            वेदो अखिलो धर्ममूलम्
          </blockquote>
          <p className="text-lg text-temple-700 italic">
            "The entire Veda is the root of dharma"
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-3xl">
            <span className="animate-bounce-gentle">🪷</span>
            <span className="animate-pulse">🔥</span>
            <span className="animate-bounce-gentle">🪷</span>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default HomePage;