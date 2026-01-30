import { useMemo, useState } from "react";

// --- Pure Game Logic Utilities ---

const initialBoard = (size: number): (string | null)[] => Array(size * size).fill(null);

const generateWinningPatterns = (boardSize: number): number[][] => {
    const patterns = [];

    // Rows
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(i * boardSize + j);
        }
        patterns.push(row);
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
        const col = [];
        for (let j = 0; j < boardSize; j++) {
            col.push(j * boardSize + i);
        }
        patterns.push(col);
    }

    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < boardSize; i++) {
        diagonal1.push(i * (boardSize + 1));
        diagonal2.push((i + 1) * (boardSize - 1));
    }
    patterns.push(diagonal1, diagonal2);

    return patterns;
};

const calculateWinner = (board: (string | null)[], winningPatterns: number[][]): string | null => {
    for (const pattern of winningPatterns) {
        const firstCellPlayer = board[pattern[0]];
        if (firstCellPlayer && pattern.every(index => board[index] === firstCellPlayer)) {
            return firstCellPlayer;
        }
    }
    return null;
};


// --- React Hook ---

const useTicTacToe = (boardSize: number) => {
    const [board, setBoard] = useState(() => initialBoard(boardSize));
    const [isXNext, setIsXNext] = useState(true);

    const winningPatterns = useMemo(() => generateWinningPatterns(boardSize), [boardSize]);
    const winner = useMemo(() => calculateWinner(board, winningPatterns), [board, winningPatterns]);

    const handleClick = (index: number) => {
        if (winner || board[index]) return
        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);
    }

    const getStatusMessage = () => {
        if (winner) return `Player ${winner} wins!`;
        if (!board.includes(null)) return `It's a draw!`;
        return `Player ${isXNext ? "X" : "O"}'s Turn`;
    }

    const resetGame = () => {
        setBoard(initialBoard(boardSize));
        setIsXNext(true);
    }

    return { board, handleClick, getStatusMessage, resetGame, winner };
};

export default useTicTacToe;