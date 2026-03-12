import { memo } from 'react';

interface CellProps {
    value: string | null;
    index: number;
    gridSize: number;
    isWinning: boolean;
    onCellClick: (index: number) => void;
    disabled: boolean;
}

const Cell = memo(({ value, index, gridSize, isWinning, onCellClick, disabled }: CellProps) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    return (
        <button
            className={`cell${isWinning ? ' cell--winning' : ''}`}
            onClick={() => onCellClick(index)}
            disabled={disabled}
            aria-label={`Row ${row + 1}, column ${col + 1}: ${value ?? 'empty'}`}
        >
            {value}
        </button>
    );
});

Cell.displayName = 'Cell';
export default Cell;
