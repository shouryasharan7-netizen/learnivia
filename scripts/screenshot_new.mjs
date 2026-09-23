import { chromium } from 'playwright';
import path from 'path';

const BASE = 'https://learnivia-green.vercel.app';
// Try student credentials (the ones used in the audit earlier)
const CREDS_LIST = [
  { email: 'student@test.com', pass: 'Learnivia@123' },
  { email: 'admin@learnivia.com', pass: 'Learnivia@123' },
  { email: 'test@learnivia.com', pass: 'Learnivia@123' },
];
const OUT = '/Users/shouryasharan/.gemini/antigravity-ide/brain/d1c12e29-65a1-401f-9eb0-cada8f731e63';

async function capture(page, name) {
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`✓ ${name}.png — URL: ${page.url()}`);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

try {
  // Try credentials until one works
  let signedIn = false;
  for (const creds of CREDS_LIST) {
    await page.goto(`${BASE}/signin`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);
    
    const emailInput = await page.$('input[name="email"], input[type="email"]');
    const passInput = await page.$('input[name="password"], input[type="password"]');
    if (!emailInput || !passInput) { console.log('No form found'); break; }
    
    await emailInput.fill(creds.email);
    await passInput.fill(creds.pass);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/dashboard|home|admin/, { timeout: 10000 }).catch(() => {});
    const url = page.url();
    console.log(`Tried ${creds.email}: ${url}`);
    
    if (!url.includes('/signin') && !url.includes('/signup')) {
      signedIn = true;
      console.log(`✓ Signed in as ${creds.email}`);
      break;
    }
  }
  
  if (!signedIn) {
    console.log('Could not sign in — capturing public pages instead');
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await capture(page, 'new-00-homepage');
    
    await page.goto(`${BASE}/find?allGrades=true`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await capture(page, 'new-02-find-public');
    process.exit(0);
  }
  
  // Dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await capture(page, 'new-01-dashboard');
  
  // Find page
  await page.goto(`${BASE}/find?allGrades=true`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await capture(page, 'new-02-find');

  // Sessions
  await page.goto(`${BASE}/sessions`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await capture(page, 'new-03-sessions');

} catch(e) {
  console.error('Error:', e.message);
} finally {
  await browser.close();
  console.log('Done!');
}
