import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import {
    BookOpen,
    Send,
    Sparkles,
    Brain,
    GraduationCap,
    Zap,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Explainer = () => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleExplain = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await aiService.explainTopic(topic, difficulty);
            setResult(response);
        } catch (error) {
            console.error("Error explaining topic:", error);
            setError(error.message || "Failed to explain topic. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const difficultyOptions = [
        { value: 'easy', label: 'Very Easy', icon: <Zap size={18} />, description: 'Simple analogies & basics' },
        { value: 'medium', label: 'College Level', icon: <GraduationCap size={18} />, description: 'Detailed & academic' },
        { value: 'hard', label: 'Technical', icon: <Brain size={18} />, description: 'In-depth & complex' },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' }}><BookOpen size={40} /></span>
                    AI Topic Explainer
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Break down any complex topic into clear, understandable explanations.
                </p>
            </header>

            {/* Input Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <form onSubmit={handleExplain}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>What do you want to learn?</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Photosynthesis, Quantum Physics, Inflation..."
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    paddingRight: '3rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface-alt)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                                <Sparkles size={20} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Select Difficulty</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                            {difficultyOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setDifficulty(opt.value)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: difficulty === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        background: difficulty === opt.value ? 'rgba(99, 102, 241, 0.15)' : 'var(--surface-alt)',
                                        color: difficulty === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        minHeight: '100px'
                                    }}
                                >
                                    <div style={{ marginBottom: '0.5rem', color: difficulty === opt.value ? 'var(--primary)' : 'var(--text-tertiary)' }}>{opt.icon}</div>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt.label}</span>
                                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>{opt.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600 }}
                        disabled={loading || !topic}
                    >
                        {loading ? <><Loader2 className="spin" size={20} /> Breaking it down...</> : <><Send size={20} /> Explain It</>}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700 }}>{result.topic}</h2>
                                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: 500 }}>
                                    {result.difficulty} Explanation
                                </div>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Summary</h3>
                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{result.content.summary}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div style={{ background: 'var(--surface-alt)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            <span style={{ color: 'var(--accent)' }}><Zap size={20} /></span> Analogy
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.content.analogy}</p>
                                    </div>
                                    <div style={{ background: 'var(--surface-alt)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            <span style={{ color: 'var(--secondary)' }}><Sparkles size={20} /></span> Real World Example
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.content.example}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Key Points</h3>
                                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
                                        {result.content.keyPoints.map((point, i) => (
                                            <li key={i} style={{ paddingLeft: '0.5rem' }}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default Explainer;
