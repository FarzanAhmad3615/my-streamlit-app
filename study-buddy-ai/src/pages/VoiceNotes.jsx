import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import {
    Mic,
    Square,
    FileText,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceNotes = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processedNotes, setProcessedNotes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const speechRecognition = new window.webkitSpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-US';

            speechRecognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
            };

            setRecognition(speechRecognition);
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognition && recognition.stop();
            setIsRecording(false);
        } else {
            if (!recognition) {
                // Fallback for browsers without support
                alert("Speech Recognition not supported in this browser. simulating...");
                simulateRecording();
                return;
            }
            recognition.start();
            setIsRecording(true);
            setTranscript('');
            setProcessedNotes(null);
        }
    };

    const simulateRecording = () => {
        setIsRecording(true);
        setTranscript('');
        let mockText = "The mitochondria is the powerhouse of the cell. It generates most of the chemical energy needed to power the cell's biochemical reactions. ";
        let i = 0;
        const interval = setInterval(() => {
            setTranscript(prev => prev + mockText[i]);
            i++;
            if (i >= mockText.length) {
                clearInterval(interval);
                setIsRecording(false);
            }
        }, 50);
    };

    const handleProcessNotes = async () => {
        if (!transcript.trim()) return;
        setLoading(true);
        try {
            // Reuse summarizer for now, or add specific note processing
            const data = await aiService.summarizeContent(transcript, 'revision');
            setProcessedNotes(data);
        } catch (error) {
            console.error("Processing failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                    <span style={{ color: '#ef4444', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.3))' }}><Mic size={40} /></span>
                    Lecture Voice-to-Notes
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Record lectures and let AI organize them into structured notes.
                </p>
            </header>

            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div
                    onClick={toggleRecording}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: isRecording ? '#ef4444' : 'var(--surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        cursor: 'pointer',
                        border: isRecording ? '4px solid rgba(239, 68, 68, 0.3)' : '4px solid var(--border)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isRecording ? '0 0 30px rgba(239, 68, 68, 0.5)' : 'none',
                        transform: isRecording ? 'scale(1.05)' : 'scale(1)'
                    }}
                >
                    {isRecording ? <Square size={48} color="white" fill="white" /> : <Mic size={48} color="var(--text-secondary)" />}
                </div>

                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
                    {isRecording ? "Listening..." : "Tap to Record"}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                    {recognition ? "Browser Speech API Supported" : "Browser Speech API Not Detected (Using Mock)"}
                </p>

                <div style={{
                    background: 'var(--background)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    minHeight: '150px',
                    textAlign: 'left',
                    marginBottom: '2rem',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>
                    {transcript || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Transcribed text will appear here...</span>}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleProcessNotes}
                    disabled={!transcript || isRecording || loading}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: 'var(--text-primary)', color: 'var(--background)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {loading ? <Loader2 className="spin" size={20} /> : "Convert to Study Notes"}
                </button>
            </div>

            {processedNotes && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-alt)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <FileText size={24} color="var(--primary)" /> Structured Notes
                        </h3>
                    </div>
                    <div style={{ padding: '2rem' }}>
                        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {processedNotes.summary.map((item, idx) => (
                                <li key={idx} style={{ paddingLeft: '0.5rem' }}>{item}</li>
                            ))}
                        </ul>
                        <div style={{ marginTop: '2.5rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Key Terms Detected</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {processedNotes.keyDefinitions.map((def, idx) => (
                                    <span key={idx} style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--primary)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '99px',
                                        fontSize: '0.9rem',
                                        border: '1px solid rgba(99, 102, 241, 0.2)',
                                        fontWeight: 500
                                    }}>
                                        {def.term}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
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

export default VoiceNotes;
