import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Goban from '../components/Board/Goban';
import { GoGame } from '../lib/go-engine';
import { ChevronRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { lessons } from '../data/lessons';

const LessonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const lesson = lessons.find(l => l.id === id);

    const [game] = useState(() => new GoGame(9));
    const [board, setBoard] = useState(game.board);
    const [step, setStep] = useState(0);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

    // Initial Setup Effect
    useEffect(() => {
        if (!lesson) return;

        // Reset game board
        game.board = Array(9).fill(null).map(() => Array(9).fill(null));

        // Apply setup if exists for current step
        if (lesson.steps[step] && lesson.steps[step].setup) {
            lesson.steps[step].setup!(game);
        }
        setBoard([...game.board]);
        setFeedback(null);
    }, [lesson, step, game]);

    if (!lesson) return (
        <div className="p-12 text-center text-slate-400">
            <h2 className="text-xl font-bold mb-4">Lesson not found</h2>
            <button onClick={() => navigate('/dojo')} className="text-amber-500 hover:align-baseline">Back to Dojo</button>
        </div>
    );

    const currentTask = lesson.steps[step];
    const isComplete = step >= lesson.steps.length;

    const handleBoardClick = (x: number, y: number) => {
        if (isComplete || !currentTask) return;

        // Check if move satisfies the lesson condition
        if (currentTask.check(game, x, y)) {
            const result = game.play(x, y, 'black');
            if (result.success) {
                setBoard([...game.board]);
                setFeedback({ type: 'success', message: currentTask.successMsg });

                // Advance
                setTimeout(() => {
                    if (step + 1 < lesson.steps.length) {
                        setStep(s => s + 1);
                    } else {
                        setStep(s => s + 1); // Mark complete
                    }
                }, 1500);
            } else {
                setFeedback({ type: 'error', message: "Invalid move (rule violation)." });
            }
        } else {
            setFeedback({ type: 'error', message: currentTask.errorMsg });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-500">
            {/* Sidebar / Instruction Panel */}
            <div className="w-full lg:w-1/3 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <button onClick={() => navigate('/dojo')} className="mb-4 text-slate-400 hover:text-white flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Back to Dojo
                </button>

                <div className="mb-6">
                    <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">The Dojo • Lesson {id}</h2>
                    <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-amber-500 h-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (step / lesson.steps.length) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {!isComplete && currentTask ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-200">{currentTask.title}</h3>
                        <p className="text-lg text-slate-300 leading-relaxed border-l-4 border-amber-500/50 pl-4">
                            {currentTask.instruction}
                        </p>

                        {feedback && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    feedback.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-blue-500/10 text-blue-400'
                                }`}>
                                {feedback.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                <p className="font-medium">{feedback.message}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Lesson Complete!</h3>
                        <p className="text-slate-400 mb-6">You've mastered this concept.</p>
                        <button onClick={() => navigate('/dojo')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-full w-full transition-colors">
                            Return to Dojo
                        </button>
                    </div>
                )}
            </div>

            {/* Game Board */}
            <div className="flex-1 w-full flex justify-center items-center bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <Goban
                    boardState={board}
                    onIntersectionClick={handleBoardClick}
                    size={9}
                />
            </div>
        </div>
    );
};

export default LessonPage;
