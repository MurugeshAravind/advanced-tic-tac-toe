import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from '@/features/game/components/board';
import type { Cell } from '@/features/game/utils/game-utils';

const emptyBoard = (size: number): Cell[] => Array(size * size).fill(null);

describe('<Board />', () => {
    it('renders the correct number of cells for a 3×3 grid', () => {
        render(
            <Board
                board={emptyBoard(3)}
                gridSize={3}
                winningCells={new Set()}
                isGameOver={false}
                onCellClick={vi.fn()}
            />,
        );
        expect(screen.getAllByRole('button')).toHaveLength(9);
    });

    it('renders the correct number of cells for a 4×4 grid', () => {
        render(
            <Board
                board={emptyBoard(4)}
                gridSize={4}
                winningCells={new Set()}
                isGameOver={false}
                onCellClick={vi.fn()}
            />,
        );
        expect(screen.getAllByRole('button')).toHaveLength(16);
    });

    it('displays X and O values from the board prop', () => {
        const board: Cell[] = ['X', 'O', null, null, null, null, null, null, null];
        render(
            <Board
                board={board}
                gridSize={3}
                winningCells={new Set()}
                isGameOver={false}
                onCellClick={vi.fn()}
            />,
        );
        expect(screen.getByTestId('cell-0')).toHaveTextContent('X');
        expect(screen.getByTestId('cell-1')).toHaveTextContent('O');
        expect(screen.getByTestId('cell-2')).toHaveTextContent('');
    });

    it('calls onCellClick with the correct index', async () => {
        const onCellClick = vi.fn();
        render(
            <Board
                board={emptyBoard(3)}
                gridSize={3}
                winningCells={new Set()}
                isGameOver={false}
                onCellClick={onCellClick}
            />,
        );
        await userEvent.click(screen.getByTestId('cell-4'));
        expect(onCellClick).toHaveBeenCalledWith(4);
    });

    it('disables all cells when game is over', () => {
        render(
            <Board
                board={emptyBoard(3)}
                gridSize={3}
                winningCells={new Set()}
                isGameOver={true}
                onCellClick={vi.fn()}
            />,
        );
        screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
    });

    it('applies cell--winning class to winning cells', () => {
        render(
            <Board
                board={emptyBoard(3)}
                gridSize={3}
                winningCells={new Set([0, 1, 2])}
                isGameOver={true}
                onCellClick={vi.fn()}
            />,
        );
        expect(screen.getByTestId('cell-0')).toHaveClass('cell--winning');
        expect(screen.getByTestId('cell-3')).not.toHaveClass('cell--winning');
    });
});
