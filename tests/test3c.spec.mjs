import { test, expect } from '@playwright/test';
test('test3c', async ({ page }) => {
    await page.goto('./tests/Example3c.html');
    // wait for 1 second
    await page.waitForTimeout(4000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});