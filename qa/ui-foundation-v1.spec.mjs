import{test,expect}from'@playwright/test';

async function dismissConsent(page){await page.waitForTimeout(450);const dialog=page.locator('#privacy');if(await dialog.isVisible())await dialog.getByRole('button',{name:'Essential only'}).click()}
async function noOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(()=>window.innerWidth))}
async function canonicalShell(page){
 const brand=page.locator('header > a.brand');
 await expect(brand).toHaveAttribute('href','/');await expect(brand).toHaveAttribute('aria-label','ConversionType home');
 await expect(brand.locator('img')).toHaveAttribute('src','/android-chrome-192x192.png');await expect(brand.locator('span')).toContainText('ConversionType');
 await expect(page.locator('header nav')).toBeVisible();await expect(page.locator('footer [data-privacy]')).toBeVisible();await expect(page.locator('#privacy')).toHaveCount(1);
}
function captureFailures(page,consoleErrors,failedRequests){page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});page.on('pageerror',error=>consoleErrors.push(error.message));page.on('requestfailed',request=>{if(new URL(request.url()).origin===new URL(page.url()).origin)failedRequests.push(request.url())})}

test('live Unit and Cooking UI contract at every viewport',async({page},testInfo)=>{
 const consoleErrors=[],failedRequests=[];captureFailures(page,consoleErrors,failedRequests);
 await page.goto('/cm-to-inches/');await dismissConsent(page);await canonicalShell(page);await noOverflow(page);
 await expect(page.locator('form button[type="submit"]')).toHaveCount(0);await expect(page.getByRole('button',{name:'Share result'})).toBeVisible();
 const unitFrom=page.locator('[name="from"]'),unitTo=page.locator('[name="to"]');await unitFrom.fill('2.54');await expect(unitTo).toHaveValue('1');await unitTo.fill('2');await expect(unitFrom).toHaveValue('5.08');await unitTo.press('Enter');await expect(page).toHaveURL(/source=to/);
 await unitFrom.fill('999999999999');await noOverflow(page);
 await page.goto('/cups-to-ml/');await dismissConsent(page);await canonicalShell(page);await noOverflow(page);
 await expect(page.locator('form button[type="submit"]')).toHaveCount(0);await page.locator('[name="from"]').fill('1');await expect(page.locator('[name="to"]')).toHaveValue('236.5882365');await page.locator('[name="standard"]').selectOption('metric');await expect(page.locator('[name="to"]')).toHaveValue('250');await page.reload();await expect(page.locator('[name="standard"]')).toHaveValue('metric');await expect(page.locator('[name="to"]')).toHaveValue('250');
 await page.goto('/butter-converter/');await dismissConsent(page);await canonicalShell(page);await noOverflow(page);await page.locator('[name="fromUnit"]').selectOption('sticks');await page.locator('[name="toUnit"]').selectOption('grams');await page.locator('[name="from"]').fill('2');await expect(page.locator('[name="to"]')).toHaveValue('226.796185');await page.locator('[name="to"]').fill('113.3980925');await expect(page.locator('[name="from"]')).toHaveValue('1');
 for(const control of await page.locator('.calculator input,.calculator select,.calculator button').all()){const box=await control.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44)}
 await page.locator('footer [data-privacy]').click();const dialog=page.locator('#privacy');await expect(dialog).toBeVisible();const box=await dialog.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(testInfo.project.use.viewport.width+1);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(testInfo.project.use.viewport.height+1);await dialog.getByRole('button',{name:'Essential only'}).click();await expect(dialog).not.toBeVisible();
 expect(consoleErrors,'site-generated console errors').toEqual([]);expect(failedRequests,'failed first-party requests').toEqual([]);
 await page.screenshot({path:testInfo.outputPath(`ui-foundation-${testInfo.project.name}.png`),fullPage:true});
});

test.describe('malformed live state remains safe',()=>{test.skip(({viewport})=>viewport?.width!==320,'runs once');test('Unit and Cooking malformed state',async({page})=>{await page.goto('/cm-to-inches/?source=bad&value=nope');await expect(page.locator('[data-conversion-status]')).toContainText('invalid');await page.goto('/grams-to-cups/?source=from&value=120&ingredient=bad');await expect(page.locator('[data-cooking-status]')).toContainText('invalid')})});
