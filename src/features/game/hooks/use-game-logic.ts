import { useCallback, useMemo, useState } from 'react';
import { createEmptyBoard, getWinningLines, checkWinner, checkDraw } from '@/features/game/utils/game-utils';

const useGameLogic = (gridSize: number) => {
    const [board, setBoard] = useState(() => createEmptyBoard(gridSize));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

    const winningLines = useMemo(() => getWinningLines(gridSize), [gridSize]);
    const result = useMemo(() => checkWinner(board, winningLines), [board, winningLines]);
    const isDraw = useMemo(() => !result && checkDraw(board), [result, board]);

    const winner = result?.winner ?? null;
    const winningCells = useMemo(() => new Set(result?.winningLine ?? []), [result]);
    const isGameOver = !!winner || isDraw;

    const handleCellClick = useCallback((index: number) => {
        if (isGameOver || board[index]) return;
        setBoard(prev => {
            const next = [...prev];
            next[index] = currentPlayer;
            return next;
        });
        setCurrentPlayer(p => p === 'X' ? 'O' : 'X');
    }, [isGameOver, board, currentPlayer]);

    const resetGame = useCallback(() => {
        setBoard(createEmptyBoard(gridSize));
        setCurrentPlayer('X');
    }, [gridSize]);

    return { board, currentPlayer, winner, isDraw, isGameOver, winningCells, handleCellClick, resetGame };
};

export default useGameLogic;
