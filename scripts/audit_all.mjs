import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIT_DIR = path.join(process.cwd(), 'audit-screenshots-full');
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR);
}

const baseUrl = 'https://learnivia-green.vercel.app';
const accounts = [
  { 
    role: 'student', 
    email: 'student@test.com', 
    password: 'password123',
    pages: ['/dashboard', '/sessions', '/find', '/community', '/leaderboard', '/safety/report']
  },
  { 
    role: 'tutor', 
    email: 'tutor@test.com', 
    password: 'password123',
    pages: ['/tutor', '/tutor/training', '/sessions', '/community', '/leaderboard']
  },
  { 
    role: 'admin', 
    email: 'admin@test.com', 
    password: 'password123',
    pages: ['/admin', '/admin/users', '/admin/sessions', '/admin/reports', '/admin/tutors']
  },
];

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.setDefaultTimeout(15000);

  for (const account of accounts) {
    console.log(`\n--- Auditing ${account.role} ---`);
    await context.clearCookies();

    try {
      console.log('Navigating to Sign In...');
      await page.goto(`${baseUrl}/signin`, { waitUntil: 'load' });
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-00-signin.png`), fullPage: true });

      console.log('Signing in...');
      await page.fill('input[name="email"]', account.email);
      await page.fill('input[name="password"]', account.password);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        page.locator('form').filter({ hasText: 'Sign In' }).locator('button[type="submit"]').click().catch(() => page.locator('button[type="submit"]').nth(1).click())
      ]);

      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(AUDIT_DIR, `${account.role}-01-post-login.png`), fullPage: true });

      // Navigate to all defined pages
      let index = 2;
      for (const route of account.pages) {
        console.log(`Navigating to ${route}...`);
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'load' }).catch(() => {});
        await page.waitForTimeout(3000);
        
        // Sanitize route for filename
        const routeName = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
        const filename = `${account.role}-0${index}-${routeName}.png`;
        await page.screenshot({ path: path.join(AUDIT_DIR, filename), fullPage: true });
        index++;
      }
      
    } catch (error) {
      console.error(`Error during ${account.role} audit:`, error.message);
    }
  }

  await browser.close();
  console.log('\n--- AUDIT COMPLETE ---');
}

runAudit().catch(console.error);
