import { chromium } from 'playwright';
import path from 'path';

const BASE = 'http://localhost:3000';
const CREDS = { email: 'admin@learnivia.com', pass: 'Learnivia@123' };
const OUT = '/Users/shouryasharan/.gemini/antigravity-ide/brain/d1c12e29-65a1-401f-9eb0-cada8f731e63';

async function capture(page, name) {
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`✓ ${name}.png — ${page.url()}`);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

try {
  // Sign in with email/password
  await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  
  const emailInput = await page.$('input[name="email"], input[type="email"]');
  const passInput = await page.$('input[name="password"], input[type="password"]');
  
  if (emailInput && passInput) {
    await emailInput.fill(CREDS.email);
    await passInput.fill(CREDS.pass);
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard|home|admin/, { timeout: 12000 }).catch(() => {});
    console.log('After login URL:', page.url());
  } else {
    console.log('No login form found, trying to navigate directly');
  }
  
  // Take sign-in page screenshot first
  await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await capture(page, 'local-00-signin');
  
  // Dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await capture(page, 'local-01-dashboard');
  
  // Find page
  await page.goto(`${BASE}/find?allGrades=true`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await capture(page, 'local-02-find');
  
  // Homepage
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await capture(page, 'local-03-homepage');

} catch(e) {
  console.error('Error:', e.message);
  console.error(e.stack);
} finally {
  await browser.close();
  console.log('Done!');
}
