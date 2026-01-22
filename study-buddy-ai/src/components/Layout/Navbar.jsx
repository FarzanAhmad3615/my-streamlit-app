import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    BookOpen,
    FileText,
    BrainCircuit,
    Layers,
    Mic,
    LayoutDashboard,
    Settings
} from 'lucide-react';
import '../../index.css';

const Navbar = () => {
    const navItems = [
        { to: "/", icon: <Home size={20} />, label: "Home" },
        { to: "/explain", icon: <BookOpen size={20} />, label: "Explain" },
        { to: "/summarize", icon: <FileText size={20} />, label: "Summarize" },
        { to: "/quiz", icon: <BrainCircuit size={20} />, label: "Quiz" },
        { to: "/flashcards", icon: <Layers size={20} />, label: "Cards" },
        { to: "/voice", icon: <Mic size={20} />, label: "Voice" },
        { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "History" },
        { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
    ];

    return (
        <nav className="navbar" style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.8rem' }}>⚡</div>
                    <span style={{ color: 'white' }}>Farzan InsightAI</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--surface-alt)' : 'transparent',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                border: isActive ? '1px solid var(--border)' : '1px solid transparent'
                            })}
                        >
                            {item.icon}
                            <span className="nav-label" style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                                {item.label}
                            </span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
