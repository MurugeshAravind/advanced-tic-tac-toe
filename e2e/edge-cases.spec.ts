import { test, expect } from '@playwright/test';
import { playSequence, clickCell } from './helpers';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('clicking a filled cell does nothing', async ({ page }) => {
    await clickCell(page, 0); // X plays
    await clickCell(page, 0, true); // attempt to overwrite (force click disabled button)
    await expect(page.getByTestId('cell-0')).toHaveText('X');
    await expect(page.getByRole('status')).toContainText("Player O's turn");
});

test('no moves accepted after game is won', async ({ page }) => {
    await playSequence(page, [0, 3, 1, 4, 2]); // X wins
    await clickCell(page, 5, true); // force click disabled cell — should be ignored
    await expect(page.getByTestId('cell-5')).toBeEmpty();
    await expect(page.getByRole('status')).toContainText('Player X wins!');
});

test('changing grid size resets the board', async ({ page }) => {
    await clickCell(page, 0); // make a move
    const slider = page.getByRole('slider');
    await slider.fill('4');
    const cells = page.getByTestId(/^cell-/);
    await expect(cells).toHaveCount(16);
    for (const cell of await cells.all()) {
        await expect(cell).toBeEmpty();
    }
});
