import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameStatus from '@/features/game/components/game-status';

describe('<GameStatus />', () => {
    it("shows whose turn it is", () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent("Player X's turn");
    });

    it('shows winner announcement', () => {
        render(<GameStatus winner="X" isDraw={false} currentPlayer="O" onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
    });

    it('shows draw message', () => {
        render(<GameStatus winner={null} isDraw={true} currentPlayer="X" onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    });

    it('calls onReset when reset button is clicked', async () => {
        const onReset = vi.fn();
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" onReset={onReset} />);
        await userEvent.click(screen.getByTestId('reset-button'));
        expect(onReset).toHaveBeenCalledOnce();
    });

    it('reset button has accessible label', () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" onReset={vi.fn()} />);
        expect(screen.getByTestId('reset-button')).toHaveAccessibleName('Reset game');
    });

    it('status region has aria-live polite', () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
});
