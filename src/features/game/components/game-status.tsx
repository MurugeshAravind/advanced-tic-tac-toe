interface GameStatusProps {
    winner: string | null;
    isDraw: boolean;
    currentPlayer: string;
    onReset: () => void;
}

const GameStatus = ({ winner, isDraw, currentPlayer, onReset }: GameStatusProps) => {
    const message = winner
        ? `Player ${winner} wins!`
        : isDraw
        ? "It's a draw!"
        : `Player ${currentPlayer}'s turn`;

    return (
        <div className="status">
            <span role="status" aria-live="polite">{message}</span>
            <button className="reset-game" title="Reset game" onClick={onReset}>&#x1f501;</button>
        </div>
    );
};

export default GameStatus;
