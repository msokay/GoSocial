import React, { useState, useEffect } from 'react';
import Goban from '../components/Board/Goban';
import { GoGame, StoneColor } from '../lib/go-engine';
import { BotEngine, BotPersonality } from '../lib/bot-engine';
import { User, Cpu, Play, RotateCcw } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const PlayPage = () => {
    const { awardXP } = useGamification();
    const [game] = useState(() => new GoGame(9));
    const [board, setBoard] = useState(game.board);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [msg, setMsg] = useState("Game Start! You implement Black.");
    const [botType, setBotType] = useState<BotPersonality>('Cautious Cal');
    const [gameOver, setGameOver] = useState(false);

    const bot = new BotEngine(game);

    const resetGame = () => {
        game.board = Array(9).fill(null).map(() => Array(9).fill(null));
        game.captures = { black: 0, white: 0 };
        setBoard([...game.board]);
        setIsPlayerTurn(true);
        setMsg(`Playing against ${botType}. You are Black.`);
        setGameOver(false);
    };

    // Bot Turn Effect
    useEffect(() => {
        if (!isPlayerTurn && !gameOver) {
            setMsg(`${botType} is thinking...`);

            // Artificial Delay
            const timer = setTimeout(() => {
                const move = bot.makeMove(botType, 'white');
                if (move) {
                    const result = game.play(move.x, move.y, 'white');
                    if (result.success) {
                        setBoard([...game.board]);
                        setMsg(`Bot played at ${move.x},${move.y}. Your turn.`);
                        setIsPlayerTurn(true);
                    } else {
                        // Bot tried invalid move (resigned?)
                        setMsg("Bot passed (or failed to find move).");
                        setIsPlayerTurn(true);
                    }
                } else {
                    setMsg("Bot passes.");
                    setIsPlayerTurn(true);
                    // Pass logic handles endgame usually
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, gameOver, botType, game]);

    const handleIntersectionClick = (x: number, y: number) => {
        if (!isPlayerTurn || gameOver) return;

        const result = game.play(x, y, 'black');
        if (result.success) {
            setBoard([...game.board]);

            // Check for captures to award "Combat XP"
            if (result.captured.length > 0) {
                const xpGain = result.captured.length * 10;
                awardXP(xpGain, `Captured ${result.captured.length} stones`);
            }

            setIsPlayerTurn(false);
        } else {
            setMsg("Invalid move.");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in">
            {/* Controls / Status */}
            <div className="w-full lg:w-1/3 bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Play size={24} className="text-amber-500" /> Play vs Bot
                    </h2>
                    <button onClick={resetGame} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors" title="Restart Game">
                        <RotateCcw size={20} />
                    </button>
                </div>

                {/* Score / Players */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border-2 transition-colors ${isPlayerTurn ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-700'}`}>
                        <div className="flex items-center gap-2 mb-2 text-slate-300">
                            <User size={18} /> You (Black)
                        </div>
                        <div className="text-2xl font-bold text-white">
                            Captures: {game.captures.black}
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 transition-colors ${!isPlayerTurn ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-700'}`}>
                        <div className="flex items-center gap-2 mb-2 text-slate-300">
                            <Cpu size={18} /> {botType} (White)
                        </div>
                        <div className="text-2xl font-bold text-white">
                            Captures: {game.captures.white}
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                    <p className="text-slate-300 font-medium animate-pulse">{msg}</p>
                </div>

                {/* Bot Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Opponent Personality</label>
                    <div className="grid grid-cols-1 gap-2">
                        {(['Cautious Cal', 'Aggressive Al', 'Random'] as BotPersonality[]).map(type => (
                            <button
                                key={type}
                                onClick={() => { setBotType(type); resetGame(); }}
                                className={`p-3 rounded-xl text-left border transition-all ${botType === type ? 'bg-amber-500 border-amber-500 text-slate-900 font-bold' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Board */}
            <div className="flex-1 w-full flex justify-center bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <Goban
                    boardState={board}
                    onIntersectionClick={handleIntersectionClick}
                    size={9}
                />
            </div>
        </div>
    );
};

export default PlayPage;
