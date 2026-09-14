import { test, expect } from '@playwright/test';

const baseURL = process.env.QA_BASE_URL || 'https://conversiontype.pages.dev';
const representative = ['/simplify-ratio/','/percentage-of/','/simplify-fraction/'];
const smokeRoutes = ['/ratio-calculator/','/simplify-ratio/','/scale-ratio/','/ratio-to-fraction/','/ratio-to-percentage/','/percentage-to-ratio/','/percentage-of/','/percent-off/','/markup-margin-calculator/','/fraction-calculator/','/simplify-fraction/','/fraction-to-decimal/','/decimal-to-fraction/','/fraction-to-percentage/','/percentage-to-fraction/'];

for (const path of representative) {
  test(`${path} definition bubble keyboard behavior`, async ({ page }) => {
    await page.goto(baseURL + path);
    const trigger = page.locator('.definition-term').first();
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded','true');
    const bubble = page.locator('.definition-bubble');
    await expect(bubble).toBeVisible();
    await expect(bubble).toHaveAttribute('role','dialog');
    await expect(bubble.locator('.definition-close')).toBeVisible();
    const before = page.url();
    await page.keyboard.press('Escape');
    await expect(bubble).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded','false');
    expect(page.url()).toBe(before);
  });
}

for (const path of smokeRoutes) {
  test(`${path} definition smoke`, async ({ page }) => {
    await page.goto(baseURL + path);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('.definition-term').count()).toBeGreaterThan(0);
  });
}

for (const viewport of [{width:320,height:844},{width:360,height:800},{width:390,height:844},{width:430,height:932}]) {
  test(`mobile ${viewport.width}x${viewport.height} bubble stays in viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(baseURL + '/simplify-ratio/');
    await page.locator('.definition-term').first().click();
    const bubble = page.locator('.definition-bubble');
    await expect(bubble).toBeVisible();
    const box = await bubble.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
}
