import { chromium } from 'playwright';
import fs from 'fs';

const baseUrl = 'https://schoolhouse.world';
const pagesToVisit = [
  { url: '/', name: 'homepage' },
  { url: '/tutors', name: 'tutors' },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(15000);
const results = {};

for (const p of pagesToVisit) {
  try {
    await page.goto(baseUrl + p.url, { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const data = await page.evaluate(() => {
      const out = [];
      ['h1','h2','h3','p','a','button','li','nav'].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const t = el.innerText?.trim();
          if(t && t.length > 3 && t.length < 250) out.push({tag:sel, text:t.slice(0,200)});
        });
      });
      return [...new Map(out.map(x=>[x.text,x])).values()].slice(0,100);
    });
    results[p.name] = data;
    console.log('Done: ' + p.name + ' - ' + data.length + ' elements');
  } catch(e) {
    results[p.name] = {error: e.message};
    console.log('Error: ' + p.name + ' - ' + e.message);
  }
}

await browser.close();
fs.writeFileSync('scripts/sh_structure.json', JSON.stringify(results, null, 2));
console.log('DONE');
