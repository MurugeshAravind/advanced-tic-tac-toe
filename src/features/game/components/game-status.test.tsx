import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameStatus from '@/features/game/components/game-status';

const defaultPlayerNames = { X: 'Alice', O: 'Bob' };

describe('<GameStatus />', () => {
    it("shows whose turn it is", () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent("Alice's turn");
    });

    it('shows the correct player name when it is O turn', () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="O" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent("Bob's turn");
    });

    it('shows winner announcement with player name for X', () => {
        render(<GameStatus winner="X" isDraw={false} currentPlayer="O" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent('Alice wins!');
    });

    it('shows winner announcement with player name for O', () => {
        render(<GameStatus winner="O" isDraw={false} currentPlayer="X" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent('Bob wins!');
    });

    it('shows draw message', () => {
        render(<GameStatus winner={null} isDraw={true} currentPlayer="X" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    });

    it('calls onReset when reset button is clicked', async () => {
        const onReset = vi.fn();
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" playerNames={defaultPlayerNames} onReset={onReset} />);
        await userEvent.click(screen.getByTestId('reset-button'));
        expect(onReset).toHaveBeenCalledOnce();
    });

    it('reset button has accessible label', () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByTestId('reset-button')).toHaveAccessibleName('Reset game');
    });

    it('status region has aria-live polite', () => {
        render(<GameStatus winner={null} isDraw={false} currentPlayer="X" playerNames={defaultPlayerNames} onReset={vi.fn()} />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
});
