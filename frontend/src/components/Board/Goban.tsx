import React, { useEffect, useRef, useState } from 'react';
import { StoneColor, Point, BoardState } from '../lib/go-engine';

interface GobanProps {
    size?: number;
    boardState: BoardState;
    onIntersectionClick?: (x: number, y: number) => void;
    interactive?: boolean;
    markers?: { x: number, y: number, type: 'circle' | 'square' | 'triangle' }[];
}

const Goban: React.FC<GobanProps> = ({
    size = 9,
    boardState,
    onIntersectionClick,
    interactive = true,
    markers = []
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverPoint, setHoverPoint] = useState<Point | null>(null);

    // Drawing Constants
    const PADDING = 30;

    // Draw Function
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate responsive sizing
        const width = canvas.width;
        // cellSize is (width - 2*padding) / (size - 1)
        // But for visual balance, let's keep it simple
        const cellSize = (width - 2 * PADDING) / (size - 1);

        // Clear
        ctx.fillStyle = '#DCB35C'; // Wood color
        ctx.fillRect(0, 0, width, width);

        // Draw Grid
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        for (let i = 0; i < size; i++) {
            // Vertical lines
            ctx.moveTo(PADDING + i * cellSize, PADDING);
            ctx.lineTo(PADDING + i * cellSize, width - PADDING);

            // Horizontal lines
            ctx.moveTo(PADDING, PADDING + i * cellSize);
            ctx.lineTo(width - PADDING, PADDING + i * cellSize);
        }
        ctx.stroke();

        // Draw Star Points (Hoshi) for 9x9 (Center and 3-3 points typically)
        // For simple 9x9, usually just center (4,4) or 3,3 7,3 3,7 7,7 and 5,5
        if (size === 9) {
            const stars = [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }];
            ctx.fillStyle = '#000000';
            stars.forEach(p => {
                ctx.beginPath();
                ctx.arc(PADDING + p.x * cellSize, PADDING + p.y * cellSize, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // Draw Stones
        boardState.forEach((row, y) => {
            row.forEach((stone, x) => {
                if (stone) {
                    drawStone(ctx, x, y, stone, cellSize);
                }
            });
        });

        // Draw Markers
        markers.forEach(m => {
            drawMarker(ctx, m.x, m.y, cellSize);
        });

        // Draw Hover Ghost Stone
        if (hoverPoint && interactive && !boardState[hoverPoint.y][hoverPoint.x]) {
            ctx.globalAlpha = 0.5;
            drawStone(ctx, hoverPoint.x, hoverPoint.y, 'black', cellSize); // Default to black for hover, or prop?
            ctx.globalAlpha = 1.0;
        }

    }, [size, boardState, hoverPoint, markers]);

    const drawStone = (ctx: CanvasRenderingContext2D, x: number, y: number, color: StoneColor, cellSize: number) => {
        const cx = PADDING + x * cellSize;
        const cy = PADDING + y * cellSize;
        const radius = cellSize * 0.45;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);

        if (color === 'black') {
            ctx.fillStyle = '#0f0f0f';
            // Slight gradient for 3D effect could be nice
        } else {
            ctx.fillStyle = '#f0f0f0';
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
        }

        ctx.fill();
        if (color === 'white') ctx.stroke();

        // Shine/Reflection
        if (color === 'black') {
            ctx.beginPath();
            ctx.arc(cx - radius * 0.2, cy - radius * 0.2, radius * 0.1, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fill();
        }
    };

    const drawMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number) => {
        const cx = PADDING + x * cellSize;
        const cy = PADDING + y * cellSize;

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!interactive || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = canvasRef.current.width / window.devicePixelRatio; // Adjust if scaled
        // Simplified for now, assume 1:1 match with CSS width in pixels
        // Actually, canvas width/height attributes vs style width/height
        // We will set canvas width={400} height={400} explicitly

        const cellSize = (400 - 2 * PADDING) / (size - 1);

        // Find nearest intersection
        const gridX = Math.round((x - PADDING) / cellSize);
        const gridY = Math.round((y - PADDING) / cellSize);

        if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
            setHoverPoint({ x: gridX, y: gridY });
        } else {
            setHoverPoint(null);
        }
    };

    const handleClick = () => {
        if (hoverPoint && onIntersectionClick) {
            onIntersectionClick(hoverPoint.x, hoverPoint.y);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-[400px] h-auto cursor-pointer shadow-xl rounded-lg bg-[#DCB35C]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPoint(null)}
            onClick={handleClick}
        />
    );
};

export default Goban;
