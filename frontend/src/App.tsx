import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DojoPage from './pages/DojoPage';
import LessonPage from './pages/LessonPage';
import PuzzlesPage from './pages/PuzzlesPage';
import PlayPage from './pages/PlayPage';
import { GamificationProvider } from './context/GamificationContext';

import LeaguesPage from './pages/LeaguesPage';

function App() {
    return (
        <GamificationProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<LandingPage />} />
                        <Route path="dojo" element={<DojoPage />} />
                        <Route path="dojo/lesson/:id" element={<LessonPage />} />
                        <Route path="puzzles" element={<PuzzlesPage />} />
                        <Route path="play" element={<PlayPage />} />
                        <Route path="leagues" element={<LeaguesPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GamificationProvider>
    );
}

export default App;
