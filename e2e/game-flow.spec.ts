import { test, expect } from '@playwright/test';
import { playSequence, clickCell } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('X wins by completing the top row', async ({ page }) => {
    await playSequence(page, [0, 3, 1, 4, 2]); // X: 0,1,2 — O: 3,4
    await expect(page.getByRole('status')).toContainText('Player X wins!');
});

test('O wins by completing a column', async ({ page }) => {
    await playSequence(page, [2, 0, 4, 3, 8, 6]); // X: 2,4,8  O: 0,3,6 (left column)
    await expect(page.getByRole('status')).toContainText('Player O wins!');
});

test('game ends in a draw', async ({ page }) => {
    // X=0,2,5,6,7 — O=1,3,4,8
    await playSequence(page, [0, 1, 2, 3, 5, 4, 6, 8, 7]);
    await expect(page.getByRole('status')).toContainText("It's a draw!");
});

test('player can reset and start a new game', async ({ page }) => {
    await playSequence(page, [0, 3, 1, 4, 2]); // X wins
    await page.getByTitle('Reset game').click();
    const cells = page.getByTestId(/^cell-/);
    await expect(cells).toHaveCount(9);
    for (const cell of await cells.all()) {
        await expect(cell).toBeEmpty();
    }
    await expect(page.getByRole('status')).toContainText("Player X's turn");
});
