import { test, expect } from '@playwright/test';
test('test3d', async ({ page }) => {
    await page.goto('./tests/Example3d.html');
    // wait for 1 second
    await page.waitForTimeout(4000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});