import { memo } from 'react';
import type { Player } from '@/features/game/utils/game-utils';

interface GameStatusProps {
    winner: Player | null;
    isDraw: boolean;
    currentPlayer: Player;
    playerNames: { X: string; O: string };
    onReset: () => void;
}

const GameStatus = memo(({ winner, isDraw, currentPlayer, playerNames, onReset }: GameStatusProps) => {
    const message = winner
        ? `${playerNames[winner]} wins!`
        : isDraw
        ? "It's a draw!"
        : `${playerNames[currentPlayer]}'s turn`;

    const indicator = winner ? winner : isDraw ? 'draw' : currentPlayer;

    return (
        <div className="status" data-current={indicator}>
            <span role="status" aria-live="polite">{message}</span>
            <button className="reset-game" title="Reset game" aria-label="Reset game" data-testid="reset-button" onClick={onReset}>&#x1f501;</button>
        </div>
    );
});

GameStatus.displayName = 'GameStatus';
export default GameStatus;
