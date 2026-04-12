import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { questions } from './data';
import './index.css';

const getRandomQuestions = (allQs, count) => {
  const shuffled = [...allQs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function App() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'results'
  const [currentTestQuestions, setCurrentTestQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const startTest = () => {
    setCurrentTestQuestions(getRandomQuestions(questions, 10));
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
  };

  const handleOptionClick = (idx, isCorrect) => {
    if (selectedOptionIndex !== null) return; // Prevent double click
    
    setSelectedOptionIndex(idx);
    
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentIndex + 1 < currentTestQuestions.length) {
        setCurrentIndex(c => c + 1);
        setSelectedOptionIndex(null);
      } else {
        setGameState('results');
      }
    }, 1200); // giving slightly more time to see the answer
  };

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header"
      >
        <h1>Bolalar Adabiyoti</h1>
        <p>4-kurs sirtqi talabalari uchun maxsus test sinovi</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}
          >
            <button
              className="tab-btn active hover-glow"
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', gap: '0.75rem', borderRadius: '1.5rem' }}
              onClick={startTest}
            >
              <Play size={24} />
              Testni Boshlash
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentTestQuestions.length > 0 && (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="question-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <span>Savol {currentIndex + 1} / {currentTestQuestions.length}</span>
              <span>Umumiy baza: {questions.length}</span>
            </div>
            
            <div className="question-header" style={{ cursor: 'default', marginBottom: '2rem' }}>
              <div className="question-number">{currentIndex + 1}</div>
              <div className="question-text" style={{ fontSize: '1.25rem' }}>
                {currentTestQuestions[currentIndex].question}
              </div>
            </div>

            <div className="options-container">
              {currentTestQuestions[currentIndex].options.map((option, idx) => {
                let statusClass = '';
                if (selectedOptionIndex !== null) {
                  // After an option is selected, reveal the correct one
                  if (option.isCorrect) statusClass = 'correct';
                  else if (idx === selectedOptionIndex && !option.isCorrect) statusClass = 'incorrect';
                }

                return (
                  <motion.div
                    key={idx}
                    whileHover={selectedOptionIndex === null ? { scale: 1.01, backgroundColor: 'rgba(79, 70, 229, 0.05)' } : {}}
                    whileTap={selectedOptionIndex === null ? { scale: 0.99 } : {}}
                    onClick={() => handleOptionClick(idx, option.isCorrect)}
                    className={`option-item ${statusClass}`}
                    style={{ 
                      cursor: selectedOptionIndex === null ? 'pointer' : 'default',
                      opacity: (selectedOptionIndex !== null && idx !== selectedOptionIndex && !option.isCorrect) ? 0.5 : 1,
                      borderWidth: '2px'
                    }}
                  >
                    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                       <span style={{ fontWeight: 'bold', color: 'var(--primary)', marginTop: '2px' }}>
                          {String.fromCharCode(65 + idx)})
                       </span>
                       <span className="option-text" style={{ color: statusClass === 'correct' ? '#0f172a' : 'inherit', fontSize: '1.05rem' }}>
                          {option.text}
                       </span>
                    </div>
                    
                    {statusClass === 'correct' && <CheckCircle2 size={24} className="option-icon correct-icon" />}
                    {statusClass === 'incorrect' && <XCircle size={24} className="option-icon incorrect-icon" />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="question-card"
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Test Natijalari</h2>
            
            <div style={{ 
              fontSize: '5rem', 
              fontWeight: '800', 
              color: score >= 8 ? 'var(--success)' : score >= 5 ? '#eab308' : 'var(--error)', 
              marginBottom: '1rem',
              textShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {score} <span style={{fontSize: '2.5rem', color: 'var(--text-muted)'}}>/ 10</span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginBottom: '3.5rem', fontWeight: 500 }}>
              {score >= 8 ? 'A\'lo natija! Barkamolsiz 👏' : score >= 5 ? 'Yaxshi! Kattaroq natija kutgan edik 👍' : 'Yomon emas, lekin yanada ko\'proq harakat qilish kerak 📚'}
            </p>

            <button
              className="tab-btn active hover-glow"
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', gap: '0.75rem', borderRadius: '1.5rem', margin: '0 auto' }}
              onClick={startTest}
            >
              <RotateCcw size={22} />
              Qaytadan Boshlash
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
