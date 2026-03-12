import { memo } from 'react';
import Cell from '@/features/game/components/cell';

interface BoardProps {
    board: (string | null)[];
    gridSize: number;
    winningCells: Set<number>;
    isGameOver: boolean;
    onCellClick: (index: number) => void;
}

const Board = memo(({ board, gridSize, winningCells, isGameOver, onCellClick }: BoardProps) => (
    <div
        className="board"
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
    >
        {board.map((value, index) => (
            <Cell
                key={index}
                value={value}
                index={index}
                gridSize={gridSize}
                isWinning={winningCells.has(index)}
                onCellClick={onCellClick}
                disabled={!!value || isGameOver}
            />
        ))}
    </div>
));

Board.displayName = 'Board';
export default Board;
