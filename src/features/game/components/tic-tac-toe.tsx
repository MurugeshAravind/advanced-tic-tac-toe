import { useMemo } from 'react';
import useGameLogic from '@/features/game/hooks/use-game-logic';
import Board from '@/features/game/components/board';
import GameStatus from '@/features/game/components/game-status';

const TicTacToe = ({ boardSize }: { boardSize: number }) => {
    const { board, currentPlayer, winner, isDraw, isGameOver, winningCells, handleCellClick, resetGame } =
        useGameLogic(boardSize);
    const boardContainerStyle = useMemo(() => ({ maxWidth: `${boardSize * 100}px` }), [boardSize]);
    return (
        <div className="game auto" style={boardContainerStyle}>
            <GameStatus
                winner={winner}
                isDraw={isDraw}
                currentPlayer={currentPlayer}
                onReset={resetGame}
            />
            <Board
                board={board}
                gridSize={boardSize}
                winningCells={winningCells}
                isGameOver={isGameOver}
                onCellClick={handleCellClick}
            />
        </div>
    );
};

export default TicTacToe;
