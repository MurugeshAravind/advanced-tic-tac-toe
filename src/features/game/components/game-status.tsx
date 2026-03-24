import { memo } from 'react';
import type { Player } from '@/features/game/utils/game-utils';

interface GameStatusProps {
    winner: Player | null;
    isDraw: boolean;
    currentPlayer: Player;
    onReset: () => void;
}

const GameStatus = memo(({ winner, isDraw, currentPlayer, onReset }: GameStatusProps) => {
    const message = winner
        ? `Player ${winner} wins!`
        : isDraw
        ? "It's a draw!"
        : `Player ${currentPlayer}'s turn`;

    return (
        <div className="status">
            <span role="status" aria-live="polite">{message}</span>
            <button className="reset-game" title="Reset game" aria-label="Reset game" data-testid="reset-button" onClick={onReset}>&#x1f501;</button>
        </div>
    );
});

GameStatus.displayName = 'GameStatus';
export default GameStatus;
