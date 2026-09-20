import{defineConfig,devices}from'@playwright/test';

const viewports=[
  ['desktop',1363,936],
  ['mobile-320',320,844],
  ['mobile-360',360,800],
  ['mobile-390',390,844],
  ['mobile-430',430,932],
];

export default defineConfig({
  testDir:'.',
  testMatch:['conversiontype-production.spec.mjs','homepage-search-v1.spec.mjs','definition-bubbles-v1.spec.mjs','unit-conversion-v1.spec.mjs','date-time-v1.spec.mjs','cooking-conversion-v1.spec.mjs','ui-foundation-v1.spec.mjs','financial-calculators-v1.spec.mjs','mortgage-rounding-regression.spec.mjs','analytics-consent-v2.spec.mjs'],
  timeout:30000,
  expect:{timeout:7000},
  fullyParallel:false,
  retries:1,
  workers:1,
  outputDir:'test-results',
  reporter:[['line'],['html',{outputFolder:'playwright-report',open:'never'}],['json',{outputFile:'qa-results.json'}]],
  use:{
    baseURL:process.env.QA_BASE_URL||'https://conversiontype.com',
    ...devices['Desktop Chrome'],
    actionTimeout:7000,
    navigationTimeout:15000,
    screenshot:'only-on-failure',
    trace:'retain-on-failure',
  },
  projects:viewports.map(([name,width,height])=>({name,use:{viewport:{width,height}}})),
});
