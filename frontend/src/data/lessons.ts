import { GoGame } from '../lib/go-engine';

export interface LessonStep {
    title: string;
    instruction: string;
    // For MVP, we pass the generic check function. In real app, this might be a DSL.
    check: (game: GoGame, x: number, y: number) => boolean;
    setup?: (game: GoGame) => void; // Initial stones
    successMsg: string;
    errorMsg: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    steps: LessonStep[];
}

export const lessons: Lesson[] = [
    {
        id: "1",
        title: "The Breath of Life",
        description: "Learn about liberties and survival.",
        steps: [
            {
                title: "Center Liberties",
                instruction: "Stones need liberties (empty adjacent points) to survive. Click to place a Black stone at 4,4.",
                check: (_game, x, y) => x === 4 && y === 4,
                successMsg: "Perfect! A center stone has 4 liberties.",
                errorMsg: "Please play at 4,4 (Center)."
            },
            {
                title: "Side Liberties",
                instruction: "Now place a stone on the side.",
                check: (_game, x, y) => (x === 0 || x === 8 || y === 0 || y === 8) && !(x === 0 && y === 0) && !(x === 8 && y === 8),
                successMsg: "Correct. Side stones have 3 liberties.",
                errorMsg: "Try playing on the edge, but not a corner."
            },
            {
                title: "Corner Liberties",
                instruction: "Finally, place a stone in the corner (0,0).",
                check: (_game, x, y) => (x === 0 && y === 0),
                successMsg: "Yes! Corners are dangerous, only 2 liberties.",
                errorMsg: "Play at the top-left corner (0,0)."
            }
        ]
    },
    {
        id: "2",
        title: "First Blood (Capture)",
        description: "Learn how to capture enemy stones.",
        steps: [
            {
                title: "Atari",
                instruction: "The White stone is surrounded on 3 sides. It has 1 liberty left (Atari). Capture it!",
                setup: (game) => {
                    game.board = Array(9).fill(null).map(() => Array(9).fill(null));
                    game.board[4][4] = 'white';
                    game.board[4][3] = 'black';
                    game.board[4][5] = 'black';
                    game.board[3][4] = 'black';
                },
                check: (_game, x, y) => x === 4 && y === 5,
                successMsg: "Captured! The stone is removed from the board.",
                errorMsg: "Play at 4,5 to fill the last liberty."
            }
        ]
    },
    {
        id: "3",
        title: "The Great Escape",
        description: "Save your stones from capture.",
        steps: [
            {
                title: "Extend",
                instruction: "Your Black stone is in Atari. Play next to it to increase liberties.",
                setup: (game) => {
                    game.board = Array(9).fill(null).map(() => Array(9).fill(null));
                    game.board[4][4] = 'black';
                    game.board[4][3] = 'white';
                    game.board[3][4] = 'white';
                    game.board[5][4] = 'white';
                },
                check: (_game, x, y) => x === 4 && y === 5,
                successMsg: "Escaped! Now you have 3 liberties.",
                errorMsg: "Connect to your stone at 4,5."
            }
        ]
    },
    {
        id: "4",
        title: "Connection & The Cut",
        description: "United we stand, divided we fall.",
        steps: [
            {
                title: "Solid Connection",
                instruction: "Connect your two stones to make them stronger. Play between them at 4,4.",
                setup: (game) => {
                    game.board = Array(9).fill(null).map(() => Array(9).fill(null));
                    game.board[4][3] = 'black';
                    game.board[4][5] = 'black';
                },
                check: (_game, x, y) => x === 4 && y === 4,
                successMsg: "Connected! Now they share liberties and are harder to capture.",
                errorMsg: "Play at 4,4 to connect."
            },
            {
                title: "The Cut",
                instruction: "The opponent is trying to connect. Cut them apart! Play at 4,4.",
                setup: (game) => {
                    game.board = Array(9).fill(null).map(() => Array(9).fill(null));
                    game.board[4][3] = 'white';
                    game.board[4][5] = 'white';
                    game.board[3][4] = 'black';
                },
                check: (_game, x, y) => x === 4 && y === 4,
                successMsg: "Cut! Now the White stones are separated and weak.",
                errorMsg: "Strike at the vital point (4,4)."
            }
        ]
    },
    {
        id: "5",
        title: "Two Eyes to Live",
        description: "The golden rule of immortality in Go.",
        steps: [
            {
                title: "False Eye",
                instruction: "This group looks like it has two eyes, but one is fake (false eye). Complete the second eye at 0,1.",
                setup: (game) => {
                    game.board = Array(9).fill(null).map(() => Array(9).fill(null));
                    game.board[0][0] = null; // Eye 1
                    game.board[0][1] = null; // Eye 2 spot
                    game.board[0][2] = 'black';
                    game.board[1][0] = 'black';
                    game.board[1][1] = 'black';
                    game.board[1][2] = 'black';
                },
                check: (_game, x, y) => x === 0 && y === 1,
                successMsg: "Alive! Two independent eyes mean the group can never be captured.",
                errorMsg: "Play at 0,1 to form the second eye."
            }
        ]
    }
];
