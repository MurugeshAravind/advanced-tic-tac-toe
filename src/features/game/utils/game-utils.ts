export const MIN_GRID_SIZE = 3;
export const MAX_GRID_SIZE = 6;

export const createEmptyBoard = (size: number): (string | null)[] =>
    Array(size * size).fill(null);

export const getWinningLines = (size: number): number[][] => {
    const lines: number[][] = [];
    for (let r = 0; r < size; r++)
        lines.push(Array.from({ length: size }, (_, c) => r * size + c));
    for (let c = 0; c < size; c++)
        lines.push(Array.from({ length: size }, (_, r) => r * size + c));
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    lines.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));
    return lines;
};

export const checkWinner = (
    board: (string | null)[],
    lines: number[][]
): { winner: string; winningLine: number[] } | null => {
    for (const line of lines) {
        const val = board[line[0]];
        if (val && line.every(i => board[i] === val))
            return { winner: val, winningLine: line };
    }
    return null;
};

export const checkDraw = (board: (string | null)[]): boolean =>
    board.every(cell => cell !== null);
