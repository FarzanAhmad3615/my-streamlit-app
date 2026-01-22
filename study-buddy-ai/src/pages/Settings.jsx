import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check } from 'lucide-react';

const Settings = () => {
    const [provider, setProvider] = useState(
        localStorage.getItem('aiProvider') || 'openrouter'
    );

    const providers = [
        {
            id: 'openrouter',
            name: 'OpenRouter',
            description: 'Free tier with multiple models',
            icon: '🌐'
        },
        {
            id: 'gemini',
            name: 'Google Gemini',
            description: 'Google\'s AI model',
            icon: '🤖'
        }
    ];

    const handleProviderChange = (providerId) => {
        setProvider(providerId);
        localStorage.setItem('aiProvider', providerId);
        // Show success message
        alert(`AI Provider switched to ${providers.find(p => p.id === providerId).name}. Please refresh the page for changes to take effect.`);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}><SettingsIcon size={32} /></span>
                    Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Configure your AI provider and preferences
                </p>
            </header>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>AI Provider</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Choose which AI service to use for generating content
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {providers.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleProviderChange(p.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: provider === p.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: provider === p.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--surface)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{p.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {p.description}
                                </div>
                            </div>
                            {provider === p.id && (
                                <Check size={24} style={{ color: 'var(--primary)' }} />
                            )}
                        </button>
                    ))}
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong>Note:</strong> Make sure you have configured the API keys for your selected provider in the .env file.
                </div>
            </div>
        </div>
    );
};

export default Settings;
