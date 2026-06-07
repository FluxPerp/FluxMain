const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-hero.png' });
  // scroll through to trigger whileInView
  for (const y of [600, 1200, 1800, 2400, 3000, 3600]) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: 'screenshot-full.png', fullPage: true });
  await browser.close();
  console.log('done');
})();
