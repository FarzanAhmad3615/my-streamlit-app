import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
            }}>
                Master Any Topic Instantly
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto', lineHeight: 1.6 }}>
                Your personalized AI tutor for explanations, summaries, quizzes, and more.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                <Link to="/explain" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        height: '100%',
                        textAlign: 'left',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            width: 'fit-content',
                            marginBottom: '1rem',
                            color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <BookOpen size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Explain a Topic</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Get clear, structured explanations with examples for any concept.</p>
                    </div>
                </Link>
                <Link to="/summarize" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        height: '100%',
                        textAlign: 'left',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = 'var(--accent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                    >
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(14, 165, 233, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            width: 'fit-content',
                            marginBottom: '1rem',
                            color: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <FileText size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Upload & Summarize</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Turn long notes or PDFs into concise study guides and bullet points.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
