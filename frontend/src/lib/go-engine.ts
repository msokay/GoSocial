export type StoneColor = 'black' | 'white';
export type Point = { x: number; y: number };
export type BoardState = (StoneColor | null)[][];

export class GoGame {
    size: number;
    board: BoardState;
    captures: { black: number; white: number };

    constructor(size = 9) {
        this.size = size;
        this.board = Array(size).fill(null).map(() => Array(size).fill(null));
        this.captures = { black: 0, white: 0 };
    }

    // Check if a point is on the board
    isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    // Place a stone
    play(x: number, y: number, color: StoneColor): { success: boolean; captured: Point[] } {
        if (!this.isValid(x, y) || this.board[y][x] !== null) {
            return { success: false, captured: [] };
        }

        // Place stone tentatively
        this.board[y][x] = color;

        // Check for captures of opponent
        const opponent = color === 'black' ? 'white' : 'black';
        const capturedStones = this.checkCaptures(x, y, opponent);

        if (capturedStones.length > 0) {
            capturedStones.forEach(p => {
                this.board[p.y][p.x] = null;
            });
            this.captures[color] += capturedStones.length;
            return { success: true, captured: capturedStones };
        }

        // Check for suicide (if no liberties and no captures made)
        const liberties = this.getGroupLiberties(x, y, color);
        if (liberties === 0) {
            // Undo move
            this.board[y][x] = null;
            return { success: false, captured: [] }; // Suicide rule
        }

        return { success: true, captured: [] };
    }

    checkCaptures(x: number, y: number, opponent: StoneColor): Point[] {
        const neighbors = [
            { x: x + 1, y }, { x: x - 1, y },
            { x, y: y + 1 }, { x, y: y - 1 }
        ];

        let totalCaptured: Point[] = [];

        neighbors.forEach(n => {
            if (this.isValid(n.x, n.y) && this.board[n.y][n.x] === opponent) {
                const groupLiberties = this.getGroupLiberties(n.x, n.y, opponent);
                if (groupLiberties === 0) {
                    totalCaptured = [...totalCaptured, ...this.getGroup(n.x, n.y, opponent)];
                }
            }
        });

        return totalCaptured;
    }

    getGroup(startX: number, startY: number, color: StoneColor): Point[] {
        const group: Point[] = [];
        const visited = new Set<string>();
        const queue: Point[] = [{ x: startX, y: startY }];

        while (queue.length > 0) {
            const current = queue.pop()!;
            const key = `${current.x},${current.y}`;
            if (visited.has(key)) continue;

            visited.add(key);
            group.push(current);

            const neighbors = [
                { x: current.x + 1, y: current.y }, { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 }, { x: current.x, y: current.y - 1 }
            ];

            neighbors.forEach(n => {
                if (this.isValid(n.x, n.y) && this.board[n.y][n.x] === color && !visited.has(`${n.x},${n.y}`)) {
                    queue.push(n);
                }
            });
        }
        return group;
    }

    getGroupLiberties(startX: number, startY: number, color: StoneColor): number {
        const group = this.getGroup(startX, startY, color);
        const liberties = new Set<string>();

        group.forEach(stone => {
            const neighbors = [
                { x: stone.x + 1, y: stone.y }, { x: stone.x - 1, y: stone.y },
                { x: stone.x, y: stone.y + 1 }, { x: stone.x, y: stone.y - 1 }
            ];

            neighbors.forEach(n => {
                if (this.isValid(n.x, n.y) && this.board[n.y][n.x] === null) {
                    liberties.add(`${n.x},${n.y}`);
                }
            });
        });

        return liberties.size;
    }
}
