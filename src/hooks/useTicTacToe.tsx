import { useState } from "react";

const initialBoard = (size: number) => Array(size * size).fill(null);

const useTicTacToe = (boardSize: number) => {
    const [board, setBoard] = useState(initialBoard(boardSize));
    const [isXNext, setisXNext] = useState(true);

    const generateWinningPatterns = () => {
        const patterns = [];
        for (let i = 0; i < boardSize; i++) {
            const horizontalPattern = [];
            const verticalPattern = [];
            for (let j = 0; j < boardSize; j++) {
                horizontalPattern.push(i * boardSize + j);
                verticalPattern.push(j * boardSize + i);
            }
            patterns.push(horizontalPattern, verticalPattern);
        }
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i=0; i < boardSize; i++) {
            diagonal1.push(i * (boardSize + 1));
            diagonal2.push((i + 1) * (boardSize - 1));
        }
        patterns.push(diagonal1, diagonal2);
        return patterns; 
    }

    const WINNING_PATTERNS = generateWinningPatterns();

    const calculateWinner = (currentBoard: Array<string | null>) => {
        for (let i=0; i < WINNING_PATTERNS.length; i++) {
            // const [a, b, c] = WINNING_PATTERNS[i];
            const pattern = WINNING_PATTERNS[i];
            let countX = 0;
            let countO = 0;
            for (let j = 0; j < pattern.length; j++) {
                const cell = currentBoard[pattern[j]];
                if (cell === "X") {
                    countX++; 
                } else if (cell === "O") {
                    countO++;
                }
            }
            if (countX === boardSize) return "X";
            if (countO === boardSize) return "O";
        }
        return null;
    };

    const handleClick = (index: number) => {
        console.log(index);
        // check winner
        const winner = calculateWinner(board);
        if (winner || board[index]) return
        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setisXNext(!isXNext);
    }

    const getStatusMessage = () => {
        const winner = calculateWinner(board);
        if (winner) return `Player ${winner} wins!`;
        if (!board.includes(null)) return `It is a draw!`;
        return `Player ${isXNext ? "X" : "O"} Turn`;
    }

    const resetGame = () => {
        setBoard(initialBoard(boardSize));
        setisXNext(true);
    }

    return { board, calculateWinner, handleClick, getStatusMessage, resetGame};
};

export default useTicTacToe;