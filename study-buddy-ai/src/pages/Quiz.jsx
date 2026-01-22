import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';
import {
    BrainCircuit,
    CheckCircle,
    XCircle,
    ArrowRight,
    RefreshCw,
    Trophy,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setQuizData(null);
        setScore(0);
        setCurrentQuestion(0);
        setQuizCompleted(false);

        storageService.addToHistory('Quiz Generation', topic);

        try {
            const data = await aiService.generateQuiz(topic);
            setQuizData(data);
        } catch (error) {
            console.error("Quiz generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (index) => {
        if (showResult) return; // Prevent changing answer after reveal
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        setShowResult(true);
        if (selectedOption === quizData[currentQuestion].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setShowResult(false);

        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(c => c + 1);
        } else {
            setQuizCompleted(true);
            storageService.saveQuizResult(topic, score, quizData.length);
        }
    };

    const restartQuiz = () => {
        setQuizData(null);
        setTopic('');
        setScore(0);
        setQuizCompleted(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--secondary)', filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))' }}><BrainCircuit size={40} /></span>
                    AI Quiz Generator
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Test your knowledge with instant, AI-generated quizzes.
                </p>
            </header>

            {!quizData ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Ready to test yourself?</h2>
                    <form onSubmit={handleGenerateQuiz} style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter a topic (e.g. World War II, React Hooks)"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                marginBottom: '1.5rem',
                                fontSize: '1rem',
                                background: 'var(--surface-alt)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--secondary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'var(--secondary)', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={loading || !topic}
                        >
                            {loading ? <Loader2 className="spin" size={20} /> : "Generate 5 Questions"}
                        </button>
                    </form>
                </div>
            ) : quizCompleted ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card"
                    style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                    <div style={{ marginBottom: '1.5rem', color: '#eab308' }}>
                        <Trophy size={64} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>Quiz Completed!</h2>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        You scored <strong style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>{score} / {quizData.length}</strong>
                    </p>
                    <div style={{ width: '100%', background: 'var(--surface-alt)', height: '12px', borderRadius: '99px', overflow: 'hidden', marginBottom: '3rem' }}>
                        <div style={{ width: `${(score / quizData.length) * 100}%`, background: 'linear-gradient(90deg, var(--secondary), var(--accent))', height: '100%' }} />
                    </div>
                    <button onClick={restartQuiz} className="btn" style={{ background: 'var(--surface-alt)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '0.75rem 1.5rem' }}>
                        <RefreshCw size={18} style={{ marginRight: '0.5rem' }} /> Try Another Topic
                    </button>
                </motion.div>
            ) : (
                <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Question {currentQuestion + 1} of {quizData.length}</span>
                        <span style={{ fontSize: '0.9rem', padding: '0.25rem 0.75rem', background: 'var(--surface)', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Score: {score}</span>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', fontWeight: 600, lineHeight: '1.5' }}>
                            {quizData[currentQuestion].question}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {quizData[currentQuestion].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={showResult}
                                    style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid',
                                        borderColor: showResult
                                            ? idx === quizData[currentQuestion].correctAnswer
                                                ? '#22c55e' // Green for correct
                                                : idx === selectedOption
                                                    ? '#ef4444' // Red for wrong
                                                    : 'var(--border)'
                                            : selectedOption === idx
                                                ? 'var(--secondary)'
                                                : 'var(--border)',
                                        background: showResult
                                            ? idx === quizData[currentQuestion].correctAnswer
                                                ? 'rgba(34, 197, 94, 0.1)'
                                                : idx === selectedOption
                                                    ? 'rgba(239, 68, 68, 0.1)'
                                                    : 'transparent'
                                            : selectedOption === idx
                                                ? 'rgba(168, 85, 247, 0.1)'
                                                : 'var(--surface-alt)',
                                        color: 'var(--text-primary)',
                                        cursor: showResult ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontWeight: selectedOption === idx ? 600 : 400,
                                        transition: 'all 0.2s',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {option}
                                    {showResult && idx === quizData[currentQuestion].correctAnswer && <CheckCircle size={20} color="#22c55e" />}
                                    {showResult && idx === selectedOption && idx !== quizData[currentQuestion].correctAnswer && <XCircle size={20} color="#ef4444" />}
                                </button>
                            ))}
                        </div>

                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ background: 'var(--surface-alt)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', borderLeft: '4px solid var(--secondary)' }}
                            >
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--secondary)' }}>Explanation:</div>
                                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{quizData[currentQuestion].explanation}</div>
                            </motion.div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {!showResult ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCheckAnswer}
                                    disabled={selectedOption === null}
                                    style={{ background: 'var(--secondary)', padding: '0.75rem 2rem', fontSize: '1rem' }}
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleNextQuestion} style={{ background: 'var(--secondary)', padding: '0.75rem 2rem', fontSize: '1rem' }}>
                                    {currentQuestion < quizData.length - 1 ? (
                                        <>Next Question <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} /></>
                                    ) : (
                                        "Finish Quiz"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Quiz;
