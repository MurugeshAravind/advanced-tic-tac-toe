import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGameLogic from '@/features/game/hooks/use-game-logic';

const GRID = 3;

describe('useGameLogic', () => {
    it('initializes with empty board and X as first player', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        expect(result.current.board).toHaveLength(9);
        expect(result.current.board.every(c => c === null)).toBe(true);
        expect(result.current.currentPlayer).toBe('X');
        expect(result.current.winner).toBeNull();
        expect(result.current.isDraw).toBe(false);
        expect(result.current.isGameOver).toBe(false);
    });

    it('places X on a valid cell', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        act(() => result.current.handleCellClick(0));
        expect(result.current.board[0]).toBe('X');
    });

    it('switches player after each move', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        act(() => result.current.handleCellClick(0));
        expect(result.current.currentPlayer).toBe('O');
        act(() => result.current.handleCellClick(1));
        expect(result.current.currentPlayer).toBe('X');
    });

    it('ignores a click on an already-filled cell', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        act(() => result.current.handleCellClick(0)); // X
        act(() => result.current.handleCellClick(0)); // ignored
        expect(result.current.board[0]).toBe('X');
        expect(result.current.currentPlayer).toBe('O');
    });

    it('detects winner after winning move', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        // X: 0,1,2 — O: 3,4
        [0, 3, 1, 4, 2].forEach(i => act(() => result.current.handleCellClick(i)));
        expect(result.current.winner).toBe('X');
        expect(result.current.isGameOver).toBe(true);
    });

    it('ignores clicks after the game is won', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        [0, 3, 1, 4, 2].forEach(i => act(() => result.current.handleCellClick(i)));
        act(() => result.current.handleCellClick(5));
        expect(result.current.board[5]).toBeNull();
    });

    it('highlights winning cells', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        [0, 3, 1, 4, 2].forEach(i => act(() => result.current.handleCellClick(i)));
        expect(result.current.winningCells.has(0)).toBe(true);
        expect(result.current.winningCells.has(1)).toBe(true);
        expect(result.current.winningCells.has(2)).toBe(true);
    });

    it('detects draw when board fills with no winner', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        // Draw sequence: X=0,2,5,6,7 — O=1,3,4,8
        [0, 1, 2, 3, 5, 4, 6, 8, 7].forEach(i => act(() => result.current.handleCellClick(i)));
        expect(result.current.winner).toBeNull();
        expect(result.current.isDraw).toBe(true);
        expect(result.current.isGameOver).toBe(true);
    });

    it('resets all state on resetGame()', () => {
        const { result } = renderHook(() => useGameLogic(GRID));
        act(() => result.current.handleCellClick(0));
        act(() => result.current.resetGame());
        expect(result.current.board.every(c => c === null)).toBe(true);
        expect(result.current.currentPlayer).toBe('X');
        expect(result.current.winner).toBeNull();
        expect(result.current.isDraw).toBe(false);
    });
});
