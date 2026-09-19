import {test,expect} from '@playwright/test';

const google=/google-analytics\.com|googletagmanager\.com|doubleclick\.net/i;
const consentKey='conversiontype.consent.v1';

// Runs against the built PR candidate in Chromium, not a mocked GA4 runtime.
test('GA4 requests require opt-in and stop after revocation',async({browser,baseURL})=>{
 const context=await browser.newContext();
 const page=await context.newPage();
 const requests=[];
 page.on('request',request=>{if(google.test(request.url()))requests.push(request.url())});
 await page.goto(`${baseURL}/`,{waitUntil:'networkidle'});
 await expect(page.locator('script[src="/analytics.js"]')).toHaveCount(1);
 expect(requests,'No Google network requests on first visit').toEqual([]);
 await page.goto(`${baseURL}/ratio-calculator/?v=1&private=test`,{waitUntil:'networkidle'});
 expect(requests,'No Google network requests on navigation without consent').toEqual([]);
 const essential=page.locator('[data-consent="essential"]');
 await expect(essential).toBeVisible();
 await essential.click();
 await page.waitForTimeout(500);
 expect(requests,'Essential-only must not contact Google').toEqual([]);
 await page.reload({waitUntil:'networkidle'});
 expect(requests,'Essential-only must survive reload').toEqual([]);
 await page.locator('[data-privacy]').first().click();
 await page.locator('[data-consent="analytics"]').click();
 await expect.poll(()=>requests.filter(url=>google.test(url)).length,{timeout:15000}).toBeGreaterThan(0);
 expect(requests.some(url=>url.includes('googletagmanager.com/gtag/js?id=G-SHR0ETX628')),'Correct GA4 tag should load').toBe(true);
 expect(requests.some(url=>url.includes('google-analytics.com')&&(/\/g\/collect|\/collect/.test(url))),'GA4 collection should occur after opt-in').toBe(true);
 expect(requests.every(url=>!url.includes('private=test')),'GA4 requests must not expose share-state query strings').toBe(true);
 await page.locator('[data-privacy]').first().click();
 await page.locator('[data-consent="essential"]').click();
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('conversiontype.consent.v1'))).toContain('essential');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.consent)).toBe('essential');
 await page.waitForLoadState('networkidle');
 const afterRevoke=requests.length;
 await page.reload({waitUntil:'networkidle'});
 await page.goto(`${baseURL}/percentage-calculator/`,{waitUntil:'networkidle'});
 await page.waitForTimeout(750);
 expect(requests.length,'No further Google requests after revocation and subsequent navigation').toBe(afterRevoke);
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).choice,consentKey)).toBe('essential');
 await context.close();
});
