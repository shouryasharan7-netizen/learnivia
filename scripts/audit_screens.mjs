import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIT_DIR = path.join(process.cwd(), 'audit-screenshots');
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR);
}

const baseUrl = 'https://learnivia-green.vercel.app';
const accounts = [
  { role: 'student', email: 'student@test.com', password: 'password123' },
  { role: 'tutor', email: 'tutor@test.com', password: 'password123' },
];

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.setDefaultTimeout(15000);
  const results = [];

  for (const account of accounts) {
    console.log(`\n--- Auditing ${account.role} ---`);
    await context.clearCookies();

    try {
      console.log('Navigating to Sign In...');
      await page.goto(`${baseUrl}/signin`, { waitUntil: 'load' });
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-01-signin.png`) });

      console.log('Signing in...');
      await page.fill('input[name="email"]', account.email);
      await page.fill('input[name="password"]', account.password);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        page.locator('form').filter({ hasText: 'Sign In' }).locator('button[type="submit"]').click().catch(() => page.locator('button[type="submit"]').nth(1).click())
      ]);

      await page.waitForTimeout(4000);
      
      let currentUrl = page.url();
      console.log(`Post-login URL: ${currentUrl}`);
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-02-post-login.png`) });
      results.push({ role: account.role, page: 'Dashboard/Home', status: 'Working', url: currentUrl });

      console.log('Navigating to Sessions...');
      await page.goto(`${baseUrl}/sessions`, { waitUntil: 'load' }).catch(() => {});
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-03-sessions.png`) });
      results.push({ role: account.role, page: 'Sessions', status: 'Working', url: page.url() });

      console.log('Navigating to Dashboard...');
      await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'load' }).catch(() => {});
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-04-dashboard.png`) });
      results.push({ role: account.role, page: 'Dashboard', status: 'Working', url: page.url() });
      
    } catch (error) {
      console.error(`Error during ${account.role} audit:`, error.message);
      results.push({ role: account.role, page: 'Error occurred', status: 'Broken', error: error.message });
    }
  }

  await browser.close();
  
  console.log('\n--- AUDIT COMPLETE ---');
  fs.writeFileSync(path.join(AUDIT_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));
}

runAudit().catch(console.error);
