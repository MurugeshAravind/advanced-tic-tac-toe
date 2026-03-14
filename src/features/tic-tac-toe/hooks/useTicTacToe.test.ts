import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useTicTacToe from './useTicTacToe';

describe('useTicTacToe', () => {
  it('should initialize with an empty board', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.winner).toBeNull();
    expect(result.current.getStatusMessage()).toBe("Player X's Turn");
  });

  it('should update board and toggle turn when a cell is clicked', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    act(() => {
      result.current.handleClick(0);
    });

    expect(result.current.board[0]).toBe('X');
    expect(result.current.getStatusMessage()).toBe("Player O's Turn");

    act(() => {
      result.current.handleClick(1);
    });

    expect(result.current.board[1]).toBe('O');
    expect(result.current.getStatusMessage()).toBe("Player X's Turn");
  });

  it('should not allow clicking on an already occupied cell', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    act(() => {
      result.current.handleClick(0);
    });
    expect(result.current.board[0]).toBe('X');

    act(() => {
      result.current.handleClick(0);
    });
    expect(result.current.board[0]).toBe('X');
    expect(result.current.getStatusMessage()).toBe("Player O's Turn");
  });

  it('should identify a winner (3x3 row)', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    // X wins by filling the first row
    act(() => result.current.handleClick(0)); // X
    act(() => result.current.handleClick(3)); // O
    act(() => result.current.handleClick(1)); // X
    act(() => result.current.handleClick(4)); // O
    act(() => result.current.handleClick(2)); // X

    expect(result.current.winner).toBe('X');
    expect(result.current.getStatusMessage()).toBe('Player X wins!');
  });

  it('should identify a winner (3x3 diagonal)', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    act(() => result.current.handleClick(0)); // X
    act(() => result.current.handleClick(1)); // O
    act(() => result.current.handleClick(4)); // X
    act(() => result.current.handleClick(2)); // O
    act(() => result.current.handleClick(8)); // X

    expect(result.current.winner).toBe('X');
    expect(result.current.getStatusMessage()).toBe('Player X wins!');
  });

  it('should identify a draw', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    // Fill board without a winner
    // X O X
    // X X O
    // O X O
    const moves = [0, 1, 2, 5, 3, 6, 7, 8, 4];
    moves.forEach(move => act(() => result.current.handleClick(move)));

    expect(result.current.winner).toBeNull();
    expect(result.current.getStatusMessage()).toBe("It's a draw!");
  });

  it('should reset the game', () => {
    const { result } = renderHook(() => useTicTacToe(3));
    
    act(() => result.current.handleClick(0));
    act(() => result.current.resetGame());

    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.winner).toBeNull();
    expect(result.current.getStatusMessage()).toBe("Player X's Turn");
  });

  it('should work with different board sizes (4x4)', () => {
    const { result } = renderHook(() => useTicTacToe(4));
    expect(result.current.board).toHaveLength(16);

    // X wins by filling the first column
    act(() => result.current.handleClick(0)); // X
    act(() => result.current.handleClick(1)); // O
    act(() => result.current.handleClick(4)); // X
    act(() => result.current.handleClick(2)); // O
    act(() => result.current.handleClick(8)); // X
    act(() => result.current.handleClick(3)); // O
    act(() => result.current.handleClick(12)); // X

    expect(result.current.winner).toBe('X');
    expect(result.current.getStatusMessage()).toBe('Player X wins!');
  });
});
