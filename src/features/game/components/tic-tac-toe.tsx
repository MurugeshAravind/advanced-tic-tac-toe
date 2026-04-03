import { useEffect, useRef, useMemo } from 'react';
import useGameLogic from '@/features/game/hooks/use-game-logic';
import Board from '@/features/game/components/board';
import GameStatus from '@/features/game/components/game-status';
import { saveGame } from '@/services/game-history';

interface TicTacToeProps {
    boardSize: number;
    username: string;
    playerNames: { X: string; O: string };
}

const TicTacToe = ({ boardSize, username, playerNames }: TicTacToeProps) => {
    const { board, currentPlayer, winner, isDraw, isGameOver, winningCells, handleCellClick, resetGame } =
        useGameLogic(boardSize);
    const boardContainerStyle = useMemo(() => ({ width: '100%', maxWidth: `${boardSize * 100}px` }), [boardSize]);

    const savedRef = useRef(false);
    useEffect(() => {
        if (isGameOver && !savedRef.current) {
            savedRef.current = true;
            const result = winner ? `${playerNames[winner]} Won` : 'Draw';
            saveGame(result, boardSize, username).catch(console.error);
        }
        if (!isGameOver) savedRef.current = false;
    }, [isGameOver, winner, boardSize, username, playerNames]);
    return (
        <div className="game auto" style={boardContainerStyle}>
            <GameStatus
                winner={winner}
                isDraw={isDraw}
                currentPlayer={currentPlayer}
                playerNames={playerNames}
                onReset={resetGame}
            />
            <div className="board-wrapper">
                <Board
                    board={board}
                    gridSize={boardSize}
                    winningCells={winningCells}
                    isGameOver={isGameOver}
                    onCellClick={handleCellClick}
                />
            </div>
        </div>
    );
};

export default TicTacToe;
