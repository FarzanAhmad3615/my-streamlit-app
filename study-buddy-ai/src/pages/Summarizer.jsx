import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import * as pdfjsLib from 'pdfjs-dist';
import {
    FileText,
    Upload,
    Check,
    Loader2,
    FileType,
    BookMarked,
    List,
    MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const Summarizer = () => {
    const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
    const [textInput, setTextInput] = useState('');
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState('revision'); // 'revision' | 'exam'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // In a real app, read file content here. 
            // For demo, we just pass file metadata or mock extraction.
        }
    };

    const extractTextFromPdf = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        // Read first 5 pages max for performance in demo
        const maxPages = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + ' ';
        }
        return fullText;
    };

    const handleSummarize = async () => {
        if ((activeTab === 'text' && !textInput.trim()) || (activeTab === 'file' && !file)) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            let contentToProcess = textInput;
            if (activeTab === 'file' && file) {
                if (file.type === 'application/pdf') {
                    contentToProcess = await extractTextFromPdf(file);
                } else {
                    // Assume text file
                    contentToProcess = await file.text();
                }
            }

            const response = await aiService.summarizeContent(contentToProcess, mode);
            setResult(response);
        } catch (error) {
            console.error("Error summarizing:", error);
            setError(error.message || "Failed to generate summary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.3))' }}><FileText size={40} /></span>
                    Notes & PDF Summarizer
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Turn messy notes and long documents into clear, study-ready summaries.
                </p>
            </header>

            <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setActiveTab('text')}
                        style={{
                            flex: 1,
                            padding: '1.25rem',
                            background: activeTab === 'text' ? 'var(--surface)' : 'var(--background)',
                            border: 'none',
                            borderBottom: activeTab === 'text' ? '2px solid var(--accent)' : 'none',
                            fontWeight: activeTab === 'text' ? 700 : 500,
                            color: activeTab === 'text' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FileType size={18} /> Paste Text
                    </button>
                    <button
                        onClick={() => setActiveTab('file')}
                        style={{
                            flex: 1,
                            padding: '1.25rem',
                            background: activeTab === 'file' ? 'var(--surface)' : 'var(--background)',
                            border: 'none',
                            borderBottom: activeTab === 'file' ? '2px solid var(--accent)' : 'none',
                            fontWeight: activeTab === 'file' ? 700 : 500,
                            color: activeTab === 'file' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Upload size={18} /> Upload File
                    </button>
                </div>

                <div style={{ padding: '2rem' }}>
                    {activeTab === 'text' ? (
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Paste your lecture notes, article, or essay here..."
                            style={{
                                width: '100%',
                                height: '250px',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface-alt)',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                outline: 'none',
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    ) : (
                        <div
                            style={{
                                border: '2px dashed var(--border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '4rem 2rem',
                                textAlign: 'center',
                                background: 'var(--surface-alt)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => document.getElementById('file-upload').click()}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(14, 165, 233, 0.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-alt)'; }}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf,.txt"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <div style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
                                <Upload size={56} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {file ? file.name : "Click to Upload PDF or TXT"}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF and Text files up to 10MB"}
                            </p>
                            {file && (
                                <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <Check size={16} /> File Selected
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setMode('revision')}
                                className={`btn`}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    fontSize: '0.9rem',
                                    background: mode === 'revision' ? 'var(--accent)' : 'var(--surface-alt)',
                                    color: mode === 'revision' ? 'white' : 'var(--text-secondary)',
                                    border: mode === 'revision' ? '1px solid var(--accent)' : '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Quick Revision
                            </button>
                            <button
                                onClick={() => setMode('exam')}
                                className={`btn`}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    fontSize: '0.9rem',
                                    background: mode === 'exam' ? 'var(--primary)' : 'var(--surface-alt)',
                                    color: mode === 'exam' ? 'white' : 'var(--text-secondary)',
                                    border: mode === 'exam' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Exam Prep
                            </button>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{
                                background: 'var(--accent)',
                                minWidth: '160px',
                                padding: '0.8rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                color: 'white',
                                fontWeight: 600
                            }}
                            onClick={handleSummarize}
                            disabled={loading || (activeTab === 'text' && !textInput) || (activeTab === 'file' && !file)}
                        >
                            {loading ? <Loader2 className="spin" size={20} /> : <><MousePointer2 size={20} /> Summarize</>}
                        </button>
                    </div>
                </div>
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

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--active)', fontWeight: 700 }}>
                                    <span style={{ color: 'var(--accent)' }}><List size={28} /></span> Summary Points
                                </h3>
                                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                                    {result.summary.map((item, idx) => (
                                        <li key={idx} style={{ paddingLeft: '0.5rem' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        <span style={{ color: 'var(--primary)' }}><BookMarked size={24} /></span> Key Definitions
                                    </h3>
                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        {result.keyDefinitions.map((def, idx) => (
                                            <div key={idx} style={{ paddingBottom: '1rem', borderBottom: idx !== result.keyDefinitions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>{def.term}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{def.definition}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {mode === 'exam' && (
                                    <div className="card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)', padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                                            <Check size={24} /> Exam Tips
                                        </h3>
                                        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {result.examTips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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

export default Summarizer;
