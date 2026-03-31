import { useEffect, useRef, useMemo } from 'react';
import useGameLogic from '@/features/game/hooks/use-game-logic';
import Board from '@/features/game/components/board';
import GameStatus from '@/features/game/components/game-status';
import { saveGame } from '@/services/game-history';

interface TicTacToeProps {
    boardSize: number;
    username: string;
}

const TicTacToe = ({ boardSize, username }: TicTacToeProps) => {
    const { board, currentPlayer, winner, isDraw, isGameOver, winningCells, handleCellClick, resetGame } =
        useGameLogic(boardSize);
    const boardContainerStyle = useMemo(() => ({ maxWidth: `${boardSize * 100}px` }), [boardSize]);

    const savedRef = useRef(false);
    useEffect(() => {
        if (isGameOver && !savedRef.current) {
            savedRef.current = true;
            const result = winner ? `${winner} Won` : 'Draw';
            saveGame(result, boardSize, username).catch(console.error);
        }
        if (!isGameOver) savedRef.current = false;
    }, [isGameOver, winner, boardSize, username, saveGame]);
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
