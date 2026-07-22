import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = './screenshots';

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3 });

  // 1. Capture mode selection screen
  console.log('📸 Plan My Day — Mode Selection...');
  await page.goto(`${BASE_URL}/plan-my-day`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}/19-PlanMyDay-ModeSelection.png`, fullPage: false, type: 'png' });
  console.log('✅ 19-PlanMyDay-ModeSelection.png');

  // 2. Click Smart Plan
  console.log('📸 Plan My Day — Smart Plan (Map + Suggestion)...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text.includes('Smart Plan')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUTPUT_DIR}/20-PlanMyDay-SmartPlan.png`, fullPage: false, type: 'png' });
  console.log('✅ 20-PlanMyDay-SmartPlan.png');

  // 3. Accept the suggestion
  console.log('📸 Plan My Day — Route Accepted...');
  const acceptBtns = await page.$$('button');
  for (const btn of acceptBtns) {
    const text = await btn.evaluate(el => el.textContent);
    if (text.includes('Accept Route')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}/21-PlanMyDay-RouteAccepted.png`, fullPage: false, type: 'png' });
  console.log('✅ 21-PlanMyDay-RouteAccepted.png');

  // 4. Capture the updated Visits view with Plan My Day button
  console.log('📸 Visits View — Plan My Day CTA...');
  await page.goto(`${BASE_URL}/visits`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  // Scroll to bottom to show the CTA
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = main.scrollHeight;
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${OUTPUT_DIR}/22-Visits-PlanMyDayCTA.png`, fullPage: false, type: 'png' });
  console.log('✅ 22-Visits-PlanMyDayCTA.png');

  await browser.close();
  console.log('\n🎉 Done! Plan My Day screenshots captured.');
}

capture();
