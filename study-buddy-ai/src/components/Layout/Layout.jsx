import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '2rem 1rem' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '1.5rem',
                color: 'var(--text-tertiary)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--border)'
            }}>
                © 2026 AI Study Buddy. Built for Learning.
            </footer>
        </div>
    );
};

export default Layout;
