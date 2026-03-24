import { describe, it, expect } from 'vitest';
import {
    createEmptyBoard,
    getWinningLines,
    checkWinner,
    checkDraw,
    getNextPlayer,
} from '@/features/game/utils/game-utils';
import type { Cell } from '@/features/game/utils/game-utils';

describe('getNextPlayer', () => {
    it('X → O', () => expect(getNextPlayer('X')).toBe('O'));
    it('O → X', () => expect(getNextPlayer('O')).toBe('X'));
});

describe('createEmptyBoard', () => {
    it('returns a flat array of size*size nulls', () => {
        expect(createEmptyBoard(3)).toHaveLength(9);
        expect(createEmptyBoard(3).every(c => c === null)).toBe(true);
    });

    it('scales to larger grid sizes', () => {
        expect(createEmptyBoard(5)).toHaveLength(25);
    });
});

describe('checkWinner', () => {
    const lines3 = getWinningLines(3);

    const board = (str: string): Cell[] =>
        str.split('').map(c => (c === 'X' ? 'X' : c === 'O' ? 'O' : null));

    it('returns null for an empty board', () => {
        expect(checkWinner(createEmptyBoard(3), lines3)).toBeNull();
    });

    it('returns null when no winner yet', () => {
        expect(checkWinner(board('XO.......'), lines3)).toBeNull();
    });

    it('detects top row win', () => {
        const result = checkWinner(board('XXX......'), lines3);
        expect(result?.winner).toBe('X');
        expect(result?.winningLine).toEqual([0, 1, 2]);
    });

    it('detects middle row win', () => {
        const result = checkWinner(board('...OOO...'), lines3);
        expect(result?.winner).toBe('O');
        expect(result?.winningLine).toEqual([3, 4, 5]);
    });

    it('detects bottom row win', () => {
        const result = checkWinner(board('......XXX'), lines3);
        expect(result?.winner).toBe('X');
        expect(result?.winningLine).toEqual([6, 7, 8]);
    });

    it('detects left column win', () => {
        const result = checkWinner(board('X..X..X..'), lines3);
        expect(result?.winner).toBe('X');
        expect(result?.winningLine).toEqual([0, 3, 6]);
    });

    it('detects middle column win', () => {
        const result = checkWinner(board('.O..O..O.'), lines3);
        expect(result?.winner).toBe('O');
        expect(result?.winningLine).toEqual([1, 4, 7]);
    });

    it('detects right column win', () => {
        const result = checkWinner(board('..X..X..X'), lines3);
        expect(result?.winner).toBe('X');
        expect(result?.winningLine).toEqual([2, 5, 8]);
    });

    it('detects top-left to bottom-right diagonal win', () => {
        const result = checkWinner(board('X...X...X'), lines3);
        expect(result?.winner).toBe('X');
        expect(result?.winningLine).toEqual([0, 4, 8]);
    });

    it('detects top-right to bottom-left diagonal win', () => {
        const result = checkWinner(board('..O.O.O..'), lines3);
        expect(result?.winner).toBe('O');
        expect(result?.winningLine).toEqual([2, 4, 6]);
    });
});

describe('checkDraw', () => {
    it('returns false for an empty board', () => {
        expect(checkDraw(createEmptyBoard(3))).toBe(false);
    });

    it('returns false when board is partially filled', () => {
        const b: Cell[] = ['X', 'O', null, null, null, null, null, null, null];
        expect(checkDraw(b)).toBe(false);
    });

    it('returns true when board is fully filled', () => {
        const b: Cell[] = ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'];
        expect(checkDraw(b)).toBe(true);
    });
});
