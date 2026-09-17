import{test,expect}from'@playwright/test';

async function dismissPrivacy(page){
  await page.waitForTimeout(450);
  const dialog=page.locator('#privacy');
  if(await dialog.isVisible())await dialog.getByRole('button',{name:'Essential only'}).click();
}

test('mortgage payment renders the known truth case as $1,918.56',async({page})=>{
  await page.goto('/mortgage-calculator/');
  await dismissPrivacy(page);
  await page.locator('[name="price"]').fill('400000');
  await page.locator('[name="down"]').fill('80000');
  await page.locator('[name="rate"]').fill('6');
  await page.locator('[name="term"]').fill('30');
  await page.getByRole('button',{name:'Calculate'}).click();
  const result=page.locator('[data-mortgage-result]');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Principal & interest');
  await expect(result).toContainText('$1,918.56');
  await expect(page.locator('[data-mortgage-status]')).toHaveText('');
});
