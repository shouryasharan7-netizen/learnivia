const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  // Wait for dev server
  await page.waitForTimeout(3000);
  
  console.log("Navigating to Home...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/shouryasharan/.gemini/antigravity-ide/brain/d1c12e29-65a1-401f-9eb0-cada8f731e63/home_audit.png', fullPage: true });

  console.log("Navigating to Find...");
  await page.goto('http://localhost:3000/find', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/shouryasharan/.gemini/antigravity-ide/brain/d1c12e29-65a1-401f-9eb0-cada8f731e63/find_audit.png', fullPage: true });

  console.log("Navigating to Signin...");
  await page.goto('http://localhost:3000/signin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/shouryasharan/.gemini/antigravity-ide/brain/d1c12e29-65a1-401f-9eb0-cada8f731e63/signin_audit.png', fullPage: true });

  await browser.close();
  console.log("Screenshots captured.");
})();
