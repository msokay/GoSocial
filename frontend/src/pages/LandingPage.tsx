import React from 'react';
import { Brain, Zap, Grid3X3, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        {
            title: "The Dojo",
            description: "Begin your journey. Master the rookie rank lessons.",
            icon: Brain,
            path: "/dojo",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10"
        },
        {
            title: "Puzzle Arena",
            description: "Sharpen your tactics with daily challenges.",
            icon: Zap,
            path: "/puzzles",
            color: "text-amber-400",
            bg: "bg-amber-400/10"
        },
        {
            title: "Play Bot",
            description: "Test your skills against Cautious Cal or Aggressive Al.",
            icon: Grid3X3,
            path: "/play",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            title: "Leagues",
            description: "Compete weekly and climb the ranks.",
            icon: Trophy,
            path: "/leagues",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="text-center py-12">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">
                    Master the Art of Weiqi
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Democratizing the ancient game of Go. Bite-sized lessons, daily puzzles, and friendly bots.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/dojo" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
                        Start Learning
                    </Link>
                    <Link to="/play" className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-8 rounded-full border border-slate-700 transition-all">
                        Play Now
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <Link to={feature.path} key={feature.title} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 hover:bg-slate-800 transition-all group cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <feature.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{feature.description}</p>
                        <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-white transition-colors">
                            <span>Open</span>
                            <ChevronRight size={16} className="ml-1" />
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default LandingPage;
