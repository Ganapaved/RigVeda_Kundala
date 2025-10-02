import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Trophy, CircleCheck as CheckCircle, Circle as XCircle, RotateCcw, Star, Target } from 'lucide-react';

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
      style={float}
      className="absolute text-2xl select-none pointer-events-none"
    >
      {symbol}
    </animated.div>
  );
};

const QuizResult = ({ results, onRetakeQuiz }) => {
  if (!results) {
    return (
      <div className="p-6 text-center">
        <p className="text-temple-700">No results yet. Complete the quiz first.</p>
      </div>
    );
  }
const { score = 0, total = 0, results: questionResults = [] } = results;
const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const scoreAnimation = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    config: { tension: 280, friction: 60 }
  });

  const progressAnimation = useSpring({
    from: { width: '0%' },
    to: { width: `${percentage}%` },
    config: { duration: 1000 }
  });

  const getScoreColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { emoji: '🏆', message: 'Outstanding! You are a true Vedic scholar!' };
    if (percentage >= 80) return { emoji: '🌟', message: 'Excellent! Your knowledge shines bright!' };
    if (percentage >= 70) return { emoji: '👏', message: 'Well done! Good understanding of the texts!' };
    if (percentage >= 60) return { emoji: '📚', message: 'Good effort! Keep studying the sacred texts!' };
    return { emoji: '🙏', message: 'Keep learning! The path to wisdom is eternal!' };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="space-y-6 relative">
      {[...Array(10)].map((_, i) => (
        <FloatingSymbol key={i} symbol={['🏆', '⭐', '🎉', '🪷'][i % 4]} delay={i * 0.3} />
      ))}

      {/* Score Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="cultural-card p-8 text-center relative z-10"
      >
        <div className="text-6xl mb-4">{scoreMessage.emoji}</div>
        <animated.div style={scoreAnimation}>
          <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent mb-2`}>
            {score}/{total}
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent mb-4`}>
            {percentage}%
          </div>
        </animated.div>
        
        <h3 className="text-2xl font-bold gradient-text mb-2">Quiz Complete!</h3>
        <p className="text-lg text-temple-700 mb-6">{scoreMessage.message}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-saffron-100 rounded-full h-4 overflow-hidden mb-6">
          <animated.div
            style={progressAnimation}
            className={`h-full bg-gradient-to-r ${getScoreColor()} rounded-full`}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{total - score}</div>
            <div className="text-sm text-red-700">Incorrect</div>
          </div>
          <div className="bg-vedic-50 p-4 rounded-xl border-2 border-vedic-200">
            <Target className="w-8 h-8 text-vedic-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-vedic-600">{percentage}%</div>
            <div className="text-sm text-vedic-700">Accuracy</div>
          </div>
        </div>

        <button
          onClick={onRetakeQuiz}
          className="bg-gradient-to-r from-saffron-500 to-gold-500 text-white px-6 py-3 rounded-xl hover:from-saffron-600 hover:to-gold-600 transition-all duration-300 shadow-cultural hover:shadow-glow transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Take Quiz Again
        </button>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="cultural-card p-6 relative z-10"
      >
        <h4 className="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Detailed Results
        </h4>
        
        <div className="space-y-4">
          {questionResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`p-4 rounded-xl border-2 ${
                result.isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-temple-800 mb-2">
                    Q{index + 1}: {result.question}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${
                      result.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      <span className="font-medium">Your answer:</span>
                      <span className={`px-2 py-1 rounded ${
                        result.isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.userAnswer || 'No answer'}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div className="flex items-center gap-2 text-green-700">
                        <span className="font-medium">Correct answer:</span>
                        <span className="px-2 py-1 rounded bg-green-100">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sacred Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cultural-card p-6 text-center relative z-10"
      >
        <div className="text-3xl mb-3 om-glow">🕉️</div>
        <blockquote className="text-lg font-devanagari text-saffron-700 mb-2 sanskrit-glow">
          विद्या ददाति विनयं
        </blockquote>
        <p className="text-temple-700 italic text-sm">
          "Knowledge gives humility"
        </p>
        <div className="flex justify-center space-x-4 mt-4 text-2xl">
          <span className="animate-bounce-gentle">🪷</span>
          <span className="animate-pulse">🔥</span>
          <span className="animate-bounce-gentle">🪷</span>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResult;