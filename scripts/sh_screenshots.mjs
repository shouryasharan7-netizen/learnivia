import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const DIR = 'audit-screenshots-full/schoolhouse';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const pages = [
  { url: 'https://schoolhouse.world/tutors', name: 'sh-tutors' },
  { url: 'https://schoolhouse.world/about', name: 'sh-about' },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(15000);

for (const p of pages) {
  try {
    await page.goto(p.url, { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(DIR, p.name + '.png'), fullPage: true });
    console.log('Captured: ' + p.name);
  } catch(e) {
    console.log('Error: ' + p.name + ' - ' + e.message);
  }
}

await browser.close();
console.log('DONE');
