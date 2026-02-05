import { BoardState, StoneColor } from '../lib/go-engine';

export interface Puzzle {
    id: string;
    initialBoard: BoardState;
    solution: { x: number, y: number }[]; // Sequence of moves
    targetColor: StoneColor;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

// 9x9 Identity Transformation
const identity = (x: number, y: number, size: number) => ({ x, y });

// Transformations
export const transformations = {
    identity,
    rotate90: (x: number, y: number, size: number) => ({ x: size - 1 - y, y: x }),
    rotate180: (x: number, y: number, size: number) => ({ x: size - 1 - x, y: size - 1 - y }),
    rotate270: (x: number, y: number, size: number) => ({ x: y, y: size - 1 - x }),
    flipH: (x: number, y: number, size: number) => ({ x: size - 1 - x, y }),
    flipV: (x: number, y: number, size: number) => ({ x, y: size - 1 - y }),
    transpose: (x: number, y: number, size: number) => ({ x: y, y: x }),
    antiTranspose: (x: number, y: number, size: number) => ({ x: size - 1 - y, y: size - 1 - x }),
};

export type TransformType = keyof typeof transformations;

export const applyTransformation = (board: BoardState, type: TransformType, colorSwap: boolean = false): BoardState => {
    const size = board.length;
    const newBoard = Array(size).fill(null).map(() => Array(size).fill(null));
    const transformFn = transformations[type];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const stone = board[y][x];
            if (stone) {
                const newPos = transformFn(x, y, size);
                // Apply color swap if needed
                let newColor = stone;
                if (colorSwap) {
                    newColor = stone === 'black' ? 'white' : 'black';
                }
                newBoard[newPos.y][newPos.x] = newColor;
            }
        }
    }
    return newBoard;
};

// Mock Puzzle Database
export const rawPuzzles: Puzzle[] = [
    {
        id: "p1",
        difficulty: "Easy",
        description: "Black to Kill. Capture the White stone.",
        targetColor: 'black',
        solution: [{ x: 5, y: 0 }], // transformed coordinates will vary
        initialBoard: (() => {
            const b = Array(9).fill(null).map(() => Array(9).fill(null));
            b[0][4] = 'white';
            b[0][3] = 'black';
            b[0][5] = 'black';
            b[1][4] = 'black';
            return b;
        })()
    }
];

export const getDailyPuzzle = (dateSeed: string) => {
    // In a real app, use seed to deterministically pick puzzle + transformation
    const puzzle = rawPuzzles[0];
    const transformationKeys = Object.keys(transformations) as TransformType[];

    // Random transform for demo
    const randomTransform = transformationKeys[Math.floor(Math.random() * transformationKeys.length)];
    const doColorSwap = Math.random() > 0.5;

    return {
        original: puzzle,
        board: applyTransformation(puzzle.initialBoard, randomTransform, doColorSwap),
        transform: randomTransform,
        isColorSwapped: doColorSwap
    };
};
