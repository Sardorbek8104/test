import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Search, BookOpen } from 'lucide-react';
import { questions } from './data';
import { questions2 } from './data2';
import './index.css';

const QuestionCard = ({ questionData, index, isExpanded, onToggle }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`question-card ${isExpanded ? 'expanded' : ''}`}
    >
      <div className="question-header" onClick={onToggle}>
        <div className="question-number">{index + 1}</div>
        <div className="question-text">{questionData.question}</div>
        <div className="expand-icon">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="options-container"
          >
            {questionData.options.map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                className={`option-item ${option.isCorrect ? 'correct' : 'incorrect'}`}
              >
                {option.isCorrect ? (
                  <CheckCircle2 size={20} className="option-icon correct-icon" />
                ) : (
                  <XCircle size={20} className="option-icon incorrect-icon" />
                )}
                <span className="option-text">{option.text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('raqamli');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentQuestions = activeTab === 'raqamli' ? questions : questions2;

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQuestions = currentQuestions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header"
      >
        <h1>Yakuniy Nazorat Savollari</h1>
        <p>Fanlar bo'yicha to'g'ri javoblarni yodlash dasturi</p>
        <p>Iltimos saytni yopishni unutmang jigarlarim</p>
      </motion.div>

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'raqamli' ? 'active' : ''}`}
          onClick={() => { setActiveTab('raqamli'); setExpandedId(null); setSearchQuery(''); }}
        >
          <BookOpen size={18} />
          Raqamli Iqtisodiyot
        </button>
        <button
          className={`tab-btn ${activeTab === 'innovatsion' ? 'active' : ''}`}
          onClick={() => { setActiveTab('innovatsion'); setExpandedId(null); setSearchQuery(''); }}
        >
          <BookOpen size={18} />
          Innovatsion Iqtisodiyot
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: '2rem', position: 'relative' }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Savolni izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>
      </motion.div>

      <div className="questions-list">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => (
            <QuestionCard
              key={q.id}
              index={index}
              questionData={q}
              isExpanded={expandedId === q.id}
              onToggle={() => handleToggle(q.id)}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
            Bunday savol topilmadi...
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Hozircha ikkala fandang ham 10 tadan savol ko'rsatilgan. Qolganlarini qo'shishingiz mumkin.</p>
        <p>+99893 288 81 04</p>
      </div>
    </div>
  );
}

export default App;
