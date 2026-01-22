import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import {
    LayoutDashboard,
    History,
    Trophy,
    TrendingUp,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [quizScores, setQuizScores] = useState([]);

    useEffect(() => {
        setHistory(storageService.getHistory());
        setQuizScores(storageService.getQuizScores());
    }, []);

    // Calculate weak areas (mock logic: if average score < 60%)
    const calculateStats = () => {
        const totalQuizzes = quizScores.length;
        if (totalQuizzes === 0) return { avgScore: 0, weakAreas: [] };

        const totalScorePercent = quizScores.reduce((acc, curr) => acc + (curr.score / curr.total), 0);
        const avgScore = Math.round((totalScorePercent / totalQuizzes) * 100);

        // Find topics with low scores
        const weakAreas = quizScores
            .filter(q => (q.score / q.total) < 0.6)
            .map(q => q.topic)
            .slice(0, 3); // Top 3

        return { avgScore, weakAreas };
    };

    const stats = calculateStats();

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' }}><LayoutDashboard size={40} /></span>
                    Learning Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Track your progress and revisit past topics.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Stats Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                        <Trophy size={24} /> Performance
                    </h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1 }}>
                        {stats.avgScore}%
                    </div>
                    <p style={{ opacity: 0.9, fontSize: '1rem' }}>Average Quiz Score</p>
                </div>

                {/* Weak Areas */}
                <div className="card" style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', fontSize: '1.25rem' }}>
                        <TrendingUp size={24} /> Focus Areas
                    </h3>
                    {stats.weakAreas.length > 0 ? (
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {stats.weakAreas.map((topic, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{topic}</li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem 0' }}>
                            No weak areas detected yet. Keep it up!
                        </div>
                    )}
                    {stats.weakAreas.length > 0 && (
                        <Link to="/explain" className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', fontSize: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            Review Topics
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Recent History */}
                <div className="card" style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        <History size={24} color="var(--text-secondary)" /> Recent Activity
                    </h3>
                    {history.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {history.slice(0, 5).map((item) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-alt)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.topic}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{item.type}</span>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                            No activity yet. Start learning!
                        </p>
                    )}
                </div>

                {/* Quiz Scores */}
                <div className="card" style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        <Calendar size={24} color="var(--text-secondary)" /> Past Quizzes
                    </h3>
                    {quizScores.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {quizScores.slice(0, 5).map((item) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-alt)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.topic}</span>
                                    <span style={{
                                        fontWeight: 700,
                                        color: (item.score / item.total) >= 0.8 ? '#22c55e' : (item.score / item.total) >= 0.6 ? '#eab308' : '#ef4444',
                                        background: (item.score / item.total) >= 0.8 ? 'rgba(34, 197, 94, 0.1)' : (item.score / item.total) >= 0.6 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        border: '1px solid',
                                        borderColor: (item.score / item.total) >= 0.8 ? 'rgba(34, 197, 94, 0.2)' : (item.score / item.total) >= 0.6 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                    }}>
                                        {item.score}/{item.total}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                            No quizzes taken yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
