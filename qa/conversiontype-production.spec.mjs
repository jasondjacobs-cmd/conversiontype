import{test,expect}from'@playwright/test';

function guardPage(page){
  const consoleErrors=[];
  const failedRequests=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  page.on('pageerror',error=>consoleErrors.push(error.message));
  page.on('requestfailed',request=>failedRequests.push(request.url()+' — '+(request.failure()?.errorText||'failed')));
  return async()=>{
    expect(consoleErrors,'site-generated console errors').toEqual([]);
    expect(failedRequests,'failed network requests').toEqual([]);
  };
}

async function dismissPrivacy(page){
  await page.waitForTimeout(450);
  const dialog=page.locator('#privacy');
  if(await dialog.isVisible())await dialog.getByRole('button',{name:'Essential only'}).click();
}

async function expectNoOverflow(page){
  const size=await page.evaluate(()=>({viewport:window.innerWidth,document:document.documentElement.scrollWidth}));
  expect(size.document,'document width '+size.document+' exceeds viewport '+size.viewport).toBeLessThanOrEqual(size.viewport);
}

async function capture(page,testInfo,name){
  await page.screenshot({path:testInfo.outputPath(name+'.png'),fullPage:true});
}

test('homepage mobile and desktop shell',async({page},testInfo)=>{
  const finish=guardPage(page);
  await page.goto('/');
  await dismissPrivacy(page);
  await expect(page.locator('.brand')).toContainText('ConversionType');
  await expect(page.locator('header nav')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
  await expectNoOverflow(page);
  await capture(page,testInfo,'homepage-'+testInfo.project.name);
  await finish();
});

test('ratio hub mobile and desktop shell',async({page},testInfo)=>{
  const finish=guardPage(page);
  await page.goto('/ratio-calculator/');
  await dismissPrivacy(page);
  await expect(page.getByRole('heading',{name:'Ratio Calculator',level:1})).toBeVisible();
  await expect(page.locator('[data-ratio-form]')).toBeVisible();
  await expectNoOverflow(page);
  await capture(page,testInfo,'ratio-hub-'+testInfo.project.name);
  await finish();
});

test.describe('320px functional coverage',()=>{
  test.skip(({viewport})=>viewport?.width!==320,'full calculator matrix runs once at 320px');

  const cases=[
    {path:'/simplify-ratio/',values:{a:'24',b:'36'},answer:'2:3'},
    {path:'/solve-ratio/',values:{a:'2',b:'3',c:'4'},answer:'6'},
    {path:'/scale-ratio/',values:{a:'3',b:'2',factor:'4'},answer:'12:8'},
    {path:'/ratio-to-fraction/',values:{a:'2',b:'6'},answer:'1/3'},
    {path:'/ratio-to-percentage/',values:{a:'3',b:'4'},answer:'75%'},
    {path:'/percentage-to-ratio/',values:{percent:'75'},answer:'3:4'},
  ];

  for(const item of cases){
    test(item.path+' calculates and restores shared state',async({browser},testInfo)=>{
      const context=await browser.newContext({viewport:{width:320,height:844},permissions:['clipboard-read','clipboard-write']});
      const page=await context.newPage();
      const finish=guardPage(page);
      await page.goto(item.path);
      await dismissPrivacy(page);
      for(const[name,value]of Object.entries(item.values))await page.locator('[name="'+name+'"]').fill(value);
      await page.getByRole('button',{name:'Calculate'}).click();
      await expect(page.locator('.answer')).toHaveText(item.answer);
      const sharedUrl=page.url();
      expect(new URL(sharedUrl).search).not.toBe('');
      await page.getByRole('button',{name:'Share result'}).click();
      await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toBe(sharedUrl);
      await page.reload();
      await expect(page.locator('.answer')).toHaveText(item.answer);
      for(const[name,value]of Object.entries(item.values))await expect(page.locator('[name="'+name+'"]')).toHaveValue(value);
      await expectNoOverflow(page);
      await capture(page,testInfo,item.path.split('/').filter(Boolean)[0]+'-320');
      await finish();
      await context.close();
    });
  }

  test('ratio clean URLs retain usable defaults',async({page})=>{
    const finish=guardPage(page);
    for(const url of['/ratio-calculator/','/simplify-ratio/','/solve-ratio/','/scale-ratio/','/ratio-to-fraction/','/ratio-to-percentage/','/percentage-to-ratio/']){
      await page.goto(url);
      await dismissPrivacy(page);
      await expect(page.locator('[data-ratio-form]')).toBeVisible();
      await expect(page.locator('[data-result]')).toBeHidden();
      expect(new URL(page.url()).search).toBe('');
      await expectNoOverflow(page);
    }
    await finish();
  });

  test('main mode selector restores scale state',async({page})=>{
    const finish=guardPage(page);
    await page.goto('/ratio-calculator/?mode=scale&a=3&b=2&factor=4');
    await dismissPrivacy(page);
    await expect(page.locator('[name="mode"]')).toHaveValue('scale');
    await expect(page.locator('.answer')).toHaveText('12:8');
    await expect(page.locator('[name="factor"]')).toHaveValue('4');
    await expectNoOverflow(page);
    await finish();
  });

  test('invalid shared URLs fail safely',async({page})=>{
    const finish=guardPage(page);
    const urls=[
      '/ratio-calculator/?mode=unsupported&a=2&b=3',
      '/simplify-ratio/?a=nope&b=3',
      '/solve-ratio/?a=2&b=3',
      '/ratio-to-percentage/?a=3&b=0',
    ];
    for(const url of urls){
      await page.goto(url);
      await dismissPrivacy(page);
      await expect(page.locator('[data-result]')).toBeVisible();
      await expect(page.locator('[data-result]')).toContainText(/Check shared link|Check your values/);
      await expectNoOverflow(page);
    }
    await finish();
  });

  test('long values stay contained',async({page})=>{
    const finish=guardPage(page);
    await page.goto('/scale-ratio/');
    await dismissPrivacy(page);
    await page.locator('[name="a"]').fill('123456789');
    await page.locator('[name="b"]').fill('987654321');
    await page.locator('[name="factor"]').fill('999999');
    await page.getByRole('button',{name:'Calculate'}).click();
    await expect(page.locator('.answer')).toBeVisible();
    await expectNoOverflow(page);
    await finish();
  });

  test('privacy dialog fits viewport',async({page})=>{
    const finish=guardPage(page);
    await page.goto('/');
    const dialog=page.locator('#privacy');
    if(!await dialog.isVisible())await page.locator('header [data-privacy]').click();
    await expect(dialog).toBeVisible();
    const box=await dialog.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x+box.width).toBeLessThanOrEqual(320);
    await finish();
  });
});


test('percentage hub mobile and desktop shell',async({page},testInfo)=>{
  const finish=guardPage(page);
  await page.goto('/percentage-calculator/');
  await dismissPrivacy(page);
  await expect(page.getByRole('heading',{name:'Percentage Calculator',level:1})).toBeVisible();
  await expect(page.locator('[data-percentage-form]')).toBeVisible();
  await expectNoOverflow(page);
  await capture(page,testInfo,'percentage-hub-'+testInfo.project.name);
  await finish();
});

test.describe('percentage functional coverage at 320px',()=>{
  test.skip(({viewport})=>viewport?.width!==320,'percentage matrix runs once at 320px');
  const cases=[
    {path:'/percentage-of/',values:{percent:'20',value:'150'},answer:'30'},
    {path:'/what-percent/',values:{part:'45',total:'150'},answer:'30%'},
    {path:'/percentage-change/',values:{old:'80',new:'100'},answer:'25%'},
    {path:'/percentage-difference/',values:{a:'40',b:'60'},answer:'40%'},
    {path:'/percent-off/',values:{price:'80',discount:'25'},answer:'$60'},
    {path:'/markup-margin-calculator/',values:{cost:'60',price:'100'},answer:'66.666667% markup · 40% margin'}
  ];
  for(const item of cases){
    test(item.path+' calculates and restores shared state',async({page},testInfo)=>{
      const finish=guardPage(page);
      await page.goto(item.path);
      await dismissPrivacy(page);
      for(const[name,value]of Object.entries(item.values))await page.locator('[name="'+name+'"]').fill(value);
      await page.getByRole('button',{name:'Calculate'}).click();
      await expect(page.locator('.answer')).toHaveText(item.answer);
      expect(new URL(page.url()).search).not.toBe('');
      await page.reload();
      await expect(page.locator('.answer')).toHaveText(item.answer);
      for(const[name,value]of Object.entries(item.values))await expect(page.locator('[name="'+name+'"]')).toHaveValue(value);
      await expectNoOverflow(page);
      await capture(page,testInfo,item.path.split('/').filter(Boolean)[0]+'-320');
      await finish();
    });
  }
  test('percentage hub restores selected mode',async({page})=>{
    const finish=guardPage(page);
    await page.goto('/percentage-calculator/?mode=percent-off&price=80&discount=25');
    await dismissPrivacy(page);
    await expect(page.locator('[name="mode"]')).toHaveValue('percent-off');
    await expect(page.locator('.answer')).toHaveText('$60');
    await expectNoOverflow(page);
    await finish();
  });
  test('percentage invalid shared links fail safely',async({page})=>{
    const finish=guardPage(page);
    for(const url of['/percentage-calculator/?mode=bad&a=1','/percentage-of/?percent=nope&value=4','/what-percent/?part=3','/percentage-change/?old=0&new=4']){
      await page.goto(url);
      await dismissPrivacy(page);
      await expect(page.locator('[data-result]')).toContainText('Check shared link');
      await expectNoOverflow(page);
    }
    await finish();
  });
});
