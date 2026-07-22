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

  // 1. Visits view with Plan My Day button
  console.log('📸 Visits — Plan My Day CTA button...');
  await page.goto(`${BASE_URL}/visits`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}/19-PlanMyDay-Button.png`, fullPage: false, type: 'png' });
  console.log('✅ 19-PlanMyDay-Button.png');

  // 2. Tap Plan My Day to open bottom sheet
  console.log('📸 Plan My Day Bottom Sheet...');
  const planBtn = await page.$('button');
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const text = await btn.evaluate(el => el.textContent);
    if (text.includes('Plan My Day')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: `${OUTPUT_DIR}/20-PlanMyDay-BottomSheet.png`, fullPage: false, type: 'png' });
  console.log('✅ 20-PlanMyDay-BottomSheet.png');

  // 3. Smart Plan map view
  console.log('📸 Smart Plan — Map View...');
  await page.goto(`${BASE_URL}/plan-my-day`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUTPUT_DIR}/21-SmartPlan-MapView.png`, fullPage: false, type: 'png' });
  console.log('✅ 21-SmartPlan-MapView.png');

  // 4. Accept route
  console.log('📸 Smart Plan — Route Accepted...');
  const btns = await page.$$('button');
  for (const btn of btns) {
    const text = await btn.evaluate(el => el.textContent);
    if (text.includes('Accept Route')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}/22-SmartPlan-RouteAccepted.png`, fullPage: false, type: 'png' });
  console.log('✅ 22-SmartPlan-RouteAccepted.png');

  // 5. Tap a pin to show dealer info card
  console.log('📸 Smart Plan — Dealer Pin Tapped...');
  await page.goto(`${BASE_URL}/plan-my-day`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  // Click the first non-selected pin on map
  const pins = await page.$$('.cursor-pointer');
  if (pins.length > 3) {
    await pins[3].click();
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${OUTPUT_DIR}/23-SmartPlan-DealerCard.png`, fullPage: false, type: 'png' });
  console.log('✅ 23-SmartPlan-DealerCard.png');

  await browser.close();
  console.log('\n🎉 Done! All Plan My Day v2 screenshots captured.');
}

capture();
