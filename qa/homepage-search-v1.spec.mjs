import{test,expect}from'@playwright/test';

function watch(page){
 const errors=[],failed=[];
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 page.on('pageerror',error=>errors.push(error.message));
 page.on('requestfailed',request=>failed.push(`${request.url()} — ${request.failure()?.errorText||'failed'}`));
 return{errors,failed};
}

async function dismissPrivacy(page){
 await page.waitForTimeout(450);
 const dialog=page.locator('#privacy');
 if(await dialog.isVisible())await dialog.getByRole('button',{name:'Essential only'}).click();
}

async function expectCountMatchesVisibleCards(page){
 const cards=page.locator('#search-result-grid .card');
 const count=await cards.count();
 await expect(page.locator('#status')).toHaveText(`${count} matching ${count===1?'tool':'tools'}`);
 return count;
}

test('homepage search covers every public tool at each viewport',async({page},testInfo)=>{
 const log=watch(page);
 await page.goto('/');
 await dismissPrivacy(page);
 const search=page.getByRole('searchbox',{name:'Search all calculators'});
 await expect(search).toBeVisible();
 const box=await search.boundingBox();
 expect(box.height).toBeGreaterThanOrEqual(44);

 for(const[query,url]of[['loan calculator','/loan-calculator/'],['mortgage calculator','/mortgage-calculator/'],['gpa calculator','/gpa-calculator/'],['concrete calculator','/concrete-calculator/'],['grams to cups','/grams-to-cups/']]){
  await search.fill(query);
  const count=await expectCountMatchesVisibleCards(page);
  expect(count).toBeGreaterThan(0);
  await expect(page.locator(`#search-result-grid a[href="${url}"]`)).toBeVisible();
  await expect(page.locator('#empty')).toBeHidden();
  await expect(page.locator('#browse')).toBeHidden();
 }

 await search.fill('ratio');
 await expectCountMatchesVisibleCards(page);
 await expect(page.locator('#search-result-grid a[href="/ratio-calculator/"]')).toBeVisible();
 await expect(page.locator('#search-result-grid a[href="/date-time-calculators/"]')).toHaveCount(0);

 await search.fill('zzzz-no-match');
 await expect(page.locator('#status')).toHaveText('0 matching tools');
 await expect(page.locator('#empty')).toBeVisible();
 await expect(page.locator('#empty')).toHaveClass(/is-visible/);
 await expect(page.locator('#empty')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('#search-result-grid')).toBeHidden();

 await search.fill('mortgage calculator');
 await expectCountMatchesVisibleCards(page);
 await expect(page.locator('#empty')).toBeHidden();
 await expect(page.locator('#empty')).toHaveCSS('display','none');
 await expect(page.locator('#empty')).not.toHaveClass(/is-visible/);
 await expect(page.locator('#empty')).toHaveAttribute('aria-hidden','true');
 await search.press('Tab');
 await expect(page.locator('#search-result-grid .card').first()).toBeFocused();
 await expect(page.locator('#search-result-grid .card').first()).toHaveAttribute('href','/mortgage-calculator/');
 await search.focus();
 await search.press('Escape');
 await expect(search).toHaveValue('');
 await expect(page.locator('#search-results')).toBeHidden();
 await expect(page.locator('#browse')).toBeVisible();

 await search.fill('mortgage calculator');
 await expectCountMatchesVisibleCards(page);
 const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:window.innerWidth}));
 expect(width.document).toBeLessThanOrEqual(width.viewport);
 expect(log.errors,'site-generated console errors').toEqual([]);
 expect(log.failed,'failed network requests').toEqual([]);
 await page.screenshot({path:testInfo.outputPath(`homepage-search-${testInfo.project.name}.png`),fullPage:true});
});
