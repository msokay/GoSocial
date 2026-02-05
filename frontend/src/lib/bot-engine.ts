import { GoGame, StoneColor } from './go-engine';

export type BotPersonality = 'Random' | 'Cautious Cal' | 'Aggressive Al';

export class BotEngine {
    constructor(private game: GoGame) { }

    makeMove(personality: BotPersonality, color: StoneColor): { x: number, y: number } | null {
        switch (personality) {
            case 'Aggressive Al':
                return this.makeAggressiveMove(color);
            case 'Cautious Cal':
                return this.makeCautiousMove(color);
            case 'Random':
            default:
                return this.makeRandomMove();
        }
    }

    private getAllValidMoves(): { x: number, y: number }[] {
        const moves: { x: number, y: number }[] = [];
        for (let y = 0; y < this.game.size; y++) {
            for (let x = 0; x < this.game.size; x++) {
                if (this.game.board[y][x] === null) {
                    // Check suicide rule (simple check: does it have liberties or capture?)
                    // For MVP simple random bot, we might skip complex validity checks until server validation?
                    // But we have logic in GoGame, let's use it.
                    // Ideally we simulate.
                    // For now, return all empty spots and let the game engine reject if invalid
                    moves.push({ x, y });
                }
            }
        }
        return moves;
    }

    private makeRandomMove(): { x: number, y: number } | null {
        const moves = this.getAllValidMoves();
        if (moves.length === 0) return null;
        return moves[Math.floor(Math.random() * moves.length)];
    }

    private makeAggressiveMove(color: StoneColor): { x: number, y: number } | null {
        // Simple heuristic: Try to play near opponent stones (contact play)
        // 1. Find all opponent stones
        // 2. Find empty spots adjacent to them
        // 3. Pick one

        const opponent = color === 'black' ? 'white' : 'black';
        const moves = this.getAllValidMoves();
        const contactMoves: { x: number, y: number }[] = [];

        for (const move of moves) {
            const neighbors = [
                { x: move.x + 1, y: move.y }, { x: move.x - 1, y: move.y },
                { x: move.x, y: move.y + 1 }, { x: move.x, y: move.y - 1 }
            ];

            const isContact = neighbors.some(n =>
                this.game.isValid(n.x, n.y) && this.game.board[n.y][n.x] === opponent
            );

            if (isContact) {
                contactMoves.push(move);
            }
        }

        if (contactMoves.length > 0) {
            return contactMoves[Math.floor(Math.random() * contactMoves.length)];
        }

        // Fallback to random
        return this.makeRandomMove();
    }

    private makeCautiousMove(color: StoneColor): { x: number, y: number } | null {
        // Heuristic: Avoid contact, play for territory (3rd line)
        // Or play near own stones (connections)

        const moves = this.getAllValidMoves();
        // Filter for moves that are solid (near own stones or on 3rd/4th line)

        const preferredMoves = moves.filter(m => {
            // Center area preference for 9x9 is usually 4,4 3,3 etc.
            // Let's just avoid 1st line (edge) unless endgame
            const isEdge = m.x === 0 || m.x === 8 || m.y === 0 || m.y === 8;
            return !isEdge;
        });

        if (preferredMoves.length > 0) {
            return preferredMoves[Math.floor(Math.random() * preferredMoves.length)];
        }

        return this.makeRandomMove();
    }
}
