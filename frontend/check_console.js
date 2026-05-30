const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:5175/analytics...');
  try {
    await page.goto('http://localhost:5175/analytics', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded');
    await new Promise(r => setTimeout(r, 2000)); // wait a bit to see if async errors happen
  } catch (e) {
    console.log('Nav error:', e);
  }
  
  await browser.close();
})();
