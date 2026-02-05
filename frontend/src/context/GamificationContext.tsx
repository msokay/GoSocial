import React, { createContext, useContext, useState, useEffect } from 'react';

interface GamificationState {
    xp: number;
    streak: number;
    leaguePoints: number;
    leagueTier: 'Stone' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Master';
    lastActivityDate: string | null;
    completedLessons: string[];
}

interface GamificationContextType extends GamificationState {
    awardXP: (amount: number, reason: string) => void;
    completeLesson: (lessonId: string) => void;
    updateStreak: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GamificationState>(() => {
        const saved = localStorage.getItem('gosocial_gamification');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            streak: 0,
            leaguePoints: 0,
            leagueTier: 'Stone',
            lastActivityDate: null,
            completedLessons: []
        };
    });

    useEffect(() => {
        localStorage.setItem('gosocial_gamification', JSON.stringify(state));
    }, [state]);

    const updateStreak = () => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActivityDate === today) return;

        let newStreak = state.streak;
        if (state.lastActivityDate) {
            const last = new Date(state.lastActivityDate);
            const now = new Date(today);
            const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else if (diffDays > 1) {
                newStreak = 1; // Basic reset, streak freeze logic not in MVP
            }
        } else {
            newStreak = 1;
        }

        setState(prev => ({ ...prev, streak: newStreak, lastActivityDate: today }));
    };

    const awardXP = (amount: number, reason: string) => {
        console.log(`Awarding ${amount} XP for: ${reason}`);
        updateStreak();
        setState(prev => ({
            ...prev,
            xp: prev.xp + amount,
            leaguePoints: prev.leaguePoints + (amount * 0.5) // Simple conversion for league
        }));
    };

    const completeLesson = (lessonId: string) => {
        if (!state.completedLessons.includes(lessonId)) {
            setState(prev => ({
                ...prev,
                completedLessons: [...prev.completedLessons, lessonId]
            }));
            awardXP(100, `Lesson ${lessonId} Complete`); // Big bonus for first time
        }
    };

    return (
        <GamificationContext.Provider value={{ ...state, awardXP, completeLesson, updateStreak }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
