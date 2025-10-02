import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Brain, CircleCheck as CheckCircle, Circle as XCircle, Trophy, Target, Sparkles ,Languages} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { apiCall } from '../utilis/api';

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

const QuizTab = ({ suktaId, onQuizComplete,lang}) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [setLang] = useState('en');

  const headerAnimation = useSpring({
    opacity: quiz.length > 0 ? 1 : 0,
    transform: quiz.length > 0 ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiCall('/api/ai/quiz', {
        method: 'POST',
        body: JSON.stringify({ suktaId }),
      });

      

      const data = response
      setQuiz(data.quiz);
      setAnswers({});
      setCurrentQuestion(0);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      
      const answersArray = quiz.map((_, index) => answers[index] || '');
      
      const response = await apiCall('/api/ai/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ answers: answersArray }),
      });

      

      const results =  response;
      onQuizComplete(results);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isQuizComplete = quiz.length > 0 && Object.keys(answers).length === quiz.length;
  const progress = quiz.length > 0 ? (Object.keys(answers).length / quiz.length) * 100 : 0;



  if (loading) {
    return (
      <div className="cultural-card p-8 relative">
        {[...Array(6)].map((_, i) => (
          <FloatingSymbol key={i} symbol="🧠" delay={i} />
        ))}
        <div className="text-center relative z-10">
          <div className="text-5xl mb-4 om-glow">🧠</div>
          <LoadingSpinner />
          <p className="text-temple-700 mt-4 text-lg">Generating Sacred Quiz...</p>
          <div className="flex justify-center space-x-4 mt-4 text-xl">
            <span className="animate-bounce-gentle">📝</span>
            <span className="animate-pulse">🤔</span>
            <span className="animate-bounce-gentle">📝</span>
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
        <ErrorMessage message={error} onRetry={generateQuiz} />
      </div>
    );
  }

  if (quiz.length === 0) {
    return (
      <div className="cultural-card p-8 text-center relative">
        {[...Array(5)].map((_, i) => (
          <FloatingSymbol key={i} symbol={['🧠', '📚', '🕉️', '🪷'][i % 4]} delay={i} />
        ))}
        <div className="relative z-10">
          <div className="text-6xl mb-6 om-glow">🧠</div>
          <h3 className="text-2xl font-bold gradient-text mb-4">{lang==='en'?'Test Your Knowledge':'ज्ञानं परीक्षस्व'}</h3>
          <p className="text-temple-700 mb-6 text-lg">
            {lang === 'en'?'Challenge yourself with AI-generated questions about this sacred sukta':'अस्य पवित्रस्य सूक्तस्य विषये कृत्रिमबुद्ध्या निर्मितैः प्रश्नैः स्वं परीक्षस्व'}
          </p>
          <button
            onClick={generateQuiz}
            className="bg-gradient-to-r from-vedic-500 to-sacred-500 text-white px-8 py-4 rounded-xl hover:from-vedic-600 hover:to-sacred-600 transition-all duration-300 shadow-cultural hover:shadow-glow transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <Brain className="w-5 h-5" />
            {lang === 'en'?'Generate Quiz':'प्रश्नमाला निर्मातुम्'}
          </button>
          <div className="flex justify-center space-x-4 mt-6 text-2xl">
            <span className="animate-bounce-gentle">🪷</span>
            <span className="animate-pulse">🔥</span>
            <span className="animate-bounce-gentle">🪷</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {[...Array(8)].map((_, i) => (
        <FloatingSymbol key={i} symbol={['🧠', '📝', '🤔', '💡'][i % 4]} delay={i * 0.5} />
      ))}

      {/* Progress Header */}
      <animated.div style={headerAnimation} className="cultural-card p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧠</div>
            <div>
              <h3 className="text-xl font-bold gradient-text">Sacred Knowledge Quiz</h3>
              <p className="text-temple-600">Test your understanding of Sukta {suktaId}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-vedic-600">
              {Object.keys(answers).length}/{quiz.length}
            </div>
            <div className="text-sm text-temple-600">Questions Answered</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-saffron-100 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-vedic-500 to-sacred-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </animated.div>

      {/* Quiz Questions */}
      <div className="space-y-6">
        <AnimatePresence>
          {quiz.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`cultural-card p-6 relative z-10 ${
                answers[index] ? 'ring-2 ring-vedic-300 shadow-glow' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-vedic-400 to-sacred-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-cultural">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-temple-800 mb-4">
                    {question.question}
                  </h4>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          answers[index] === option
                            ? 'bg-gradient-to-r from-vedic-100 to-sacred-100 border-2 border-vedic-400 shadow-md'
                            : 'bg-saffron-50 hover:bg-saffron-100 border-2 border-transparent hover:border-saffron-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => handleAnswerChange(index, option)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[index] === option
                            ? 'border-vedic-500 bg-vedic-500'
                            : 'border-saffron-400'
                        }`}>
                          {answers[index] === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          answers[index] === option ? 'text-vedic-700' : 'text-temple-700'
                        }`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      {quiz.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cultural-card p-6 text-center relative z-10"
        >
          <button
            onClick={submitQuiz}
            disabled={!isQuizComplete || submitting}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 mx-auto ${
              isQuizComplete && !submitting
                ? 'bg-gradient-to-r from-gold-500 to-saffron-600 text-white shadow-cultural hover:shadow-glow transform hover:scale-105'
                : 'bg-temple-200 text-temple-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" />
                Submitting...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </button>
          
          {!isQuizComplete && (
            <p className="text-temple-600 mt-3 text-sm">
              Please answer all questions to submit the quiz
            </p>
          )}
          
          <div className="flex justify-center space-x-4 mt-4 text-xl">
            <span className="animate-bounce-gentle">🏆</span>
            <span className="animate-pulse">✨</span>
            <span className="animate-bounce-gentle">🏆</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizTab;