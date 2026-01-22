import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import {
    Layers,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Flashcards = () => {
    const [topic, setTopic] = useState('');
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setCards(null);
        setCurrentIndex(0);
        setIsFlipped(false);

        try {
            const data = await aiService.generateFlashcards(topic);
            setCards(data);
        } catch (error) {
            console.error("Error generating cards:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c + 1), 200);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c - 1), 200);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.3))' }}><Layers size={40} /></span>
                    Flashcards Generator
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Memorize quicker with AI-generated study cards.
                </p>
            </header>

            {!cards ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <form onSubmit={handleGenerate} style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Topic to study (e.g. Spanish Verbs, Anatomy)"
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
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'var(--accent)', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={loading || !topic}
                        >
                            {loading ? <Loader2 className="spin" size={20} /> : "Generate Flashcards"}
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                        <span>Card {currentIndex + 1} / {cards.length}</span>
                        <span>Tap card to flip</span>
                    </div>

                    <div
                        style={{
                            perspective: '1000px',
                            height: '350px',
                            marginBottom: '2rem',
                            cursor: 'pointer'
                        }}
                        onClick={handleFlip}
                    >
                        <motion.div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                            }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* Front */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}>
                                <div style={{ color: 'var(--text-tertiary)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px' }}>FRONT</div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cards[currentIndex].front}</h3>
                                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', color: 'var(--text-tertiary)' }}>
                                    <RotateCw size={20} />
                                </div>
                            </div>

                            {/* Back */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'white',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px' }}>BACK</div>
                                <p style={{ fontSize: '1.3rem', lineHeight: '1.6', fontWeight: 500 }}>{cards[currentIndex].back}</p>
                                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                                    <RotateCw size={20} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            style={{ width: '50px', padding: '0.75rem', background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleGenerate}
                            style={{ flex: 1, background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                            New Topic
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                            style={{ width: '50px', padding: '0.75rem', background: 'var(--accent)', border: 'none' }}
                        >
                            <ChevronRight size={24} />
                        </button>
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

export default Flashcards;
