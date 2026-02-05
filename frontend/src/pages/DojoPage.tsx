import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import { lessons } from '../data/lessons';

const DojoPage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">The Dojo</h1>
                <p className="text-slate-400">Master the fundamentals to reach the amateur rookie rank.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson, index) => {
                    const isLocked = index > 0 && false; // Unlock all for MVP testing
                    // const isLocked = index > currentProgress; // In real app

                    return (
                        <div
                            key={lesson.id}
                            onClick={() => !isLocked && navigate(`/dojo/lesson/${lesson.id}`)}
                            className={`
                                relative p-6 rounded-2xl border transition-all duration-300 group
                                ${isLocked
                                    ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                                    : 'bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocked ? 'bg-slate-800' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {isLocked ? <Lock size={18} /> : <Brain size={20} />}
                                </div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Lesson {lesson.id}
                                </div>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-white group-hover:text-amber-400'}`}>
                                {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                {lesson.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <span>{lesson.steps.length} Exercises</span>
                                </div>
                                {!isLocked && (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DojoPage;
