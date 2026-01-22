import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Explainer from './pages/Explainer';
import Summarizer from './pages/Summarizer';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import VoiceNotes from './pages/VoiceNotes';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="explain" element={<Explainer />} />
                    <Route path="summarize" element={<Summarizer />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="flashcards" element={<Flashcards />} />
                    <Route path="voice" element={<VoiceNotes />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
