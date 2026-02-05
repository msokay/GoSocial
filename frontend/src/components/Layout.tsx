import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Zap, Brain, User, Grid3X3, Trophy, Menu, X, Flame, Star } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const Layout = () => {
    const { xp, streak, leagueTier } = useGamification();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dojo', label: 'The Dojo', icon: Brain },
        { path: '/puzzles', label: 'Puzzles', icon: Zap },
        { path: '/play', label: 'Play Bot', icon: Grid3X3 },
        { path: '/leagues', label: 'Leagues', icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                <div className="font-bold text-xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">GoSocial</div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside className={`fixed md:relative z-20 w-64 h-screen bg-slate-900 border-r border-slate-800 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">GoSocial</h1>
                    <p className="text-xs text-slate-500 mt-1">Version 1.0 (MVP)</p>
                </div>

                {/* Gamification Stats */}
                <div className="px-6 pb-4 mb-2 border-b border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Flame size={16} className="text-orange-500 fill-orange-500" />
                            <span className="text-sm font-bold">{streak} Day Streak</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold">{xp} XP</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Trophy size={16} className="text-purple-400" />
                            <span className="text-sm font-bold">{leagueTier} League</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.path)
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">Guest User</div>
                            <div className="text-xs text-slate-500">Sign In</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
