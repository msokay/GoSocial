import React from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Shield, Crown } from 'lucide-react';

const LeaguesPage = () => {
    const { leaguePoints, leagueTier } = useGamification();

    // Mock Leaderboard Data
    const leaderboard = [
        { rank: 1, name: "AlphaGo", points: 2500, tier: "Master" },
        { rank: 2, name: "Hikaru", points: 2100, tier: "Diamond" },
        { rank: 3, name: "Sai", points: 1950, tier: "Diamond" },
        { rank: 4, name: "Guest User (You)", points: leaguePoints, tier: leagueTier, isUser: true },
        { rank: 5, name: "Akira", points: 1200, tier: "Gold" },
        { rank: 6, name: "Waya", points: 800, tier: "Silver" },
        { rank: 7, name: "Isumi", points: 750, tier: "Silver" },
    ].sort((a, b) => b.points - a.points).map((p, i) => ({ ...p, rank: i + 1 }));

    return (
        <div className="space-y-8 animate-in fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Weekly League</h1>
                <p className="text-slate-400">Compete with other players to promote to the next tier.</p>
            </header>

            {/* Current Status */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 border border-indigo-700 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-1">Current Tier: {leagueTier}</h2>
                    <p className="text-indigo-200 mb-6">Top 10 players promote to the next rank.</p>

                    <div className="flex items-center gap-4">
                        <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                            <span className="block text-xs text-indigo-300 uppercase tracking-wider">Your Points</span>
                            <span className="text-3xl font-bold text-white">{leaguePoints} LP</span>
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                            <span className="block text-xs text-indigo-300 uppercase tracking-wider">Time Left</span>
                            <span className="text-3xl font-bold text-white">2d 4h</span>
                        </div>
                    </div>
                </div>
                <Trophy className="absolute -right-6 -bottom-6 text-indigo-800/50" size={180} />
            </div>

            {/* Leaderboard */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900">
                        <tr>
                            <th className="p-4 text-slate-500 font-medium">Rank</th>
                            <th className="p-4 text-slate-500 font-medium">Player</th>
                            <th className="p-4 text-slate-500 font-medium">Tier</th>
                            <th className="p-4 text-slate-500 font-medium text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {leaderboard.map((entry) => (
                            <tr key={entry.name} className={`${entry.isUser ? 'bg-amber-500/10' : 'hover:bg-slate-700/50'} transition-colors`}>
                                <td className="p-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${entry.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                                            entry.rank === 2 ? 'bg-slate-300 text-slate-900' :
                                                entry.rank === 3 ? 'bg-amber-700 text-amber-100' :
                                                    'text-slate-400'
                                        }`}>
                                        {entry.rank <= 3 ? <Crown size={16} /> : entry.rank}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-white flex items-center gap-2">
                                    {entry.name}
                                    {entry.isUser && <span className="text-xs bg-amber-500 text-slate-900 px-2 py-0.5 rounded font-bold">YOU</span>}
                                </td>
                                <td className="p-4 text-slate-400">{entry.tier}</td>
                                <td className="p-4 text-right font-mono text-amber-400 font-bold">{entry.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaguesPage;
