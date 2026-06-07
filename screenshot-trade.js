const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001/trade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // wait for chart to load
  await page.screenshot({ path: 'screenshot-trade.png' });
  // Test wallet connect
  await page.click('text=Connect Wallet');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-wallet-modal.png' });
  await page.click('text=Phantom');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshot-trade-connected.png' });
  await browser.close();
  console.log('done');
})();
