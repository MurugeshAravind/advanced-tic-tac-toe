import type { Page } from '@playwright/test';

export const clickCell = (page: Page, index: number, force = false) =>
    page.getByTestId(`cell-${index}`).click({ force });

export const playSequence = async (page: Page, moves: number[]) => {
    for (const i of moves) await clickCell(page, i);
};
