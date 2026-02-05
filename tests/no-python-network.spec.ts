import { test, expect } from '@playwright/test';

const forbiddenHosts = [
  'python',
  'py-worker',
  'ai-worker',
  'ai-service',
  'ai-api',
  '127.0.0.1:8000',
  'localhost:8000',
  'localhost:5000',
  'localhost:3002',
];

test('UI makes no network calls to python hosts', async ({ page, baseURL }) => {
  const calls: { url: string; method: string }[] = [];
  page.on('request', req => calls.push({ url: req.url(), method: req.method() }));

  // Uses baseURL from playwright.config.ts or E2E_BASE_URL env
  await page.goto(baseURL || process.env.E2E_BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });

  // Optionally: interact to trigger course/submission flows; if you want, add selectors here
  // e.g. await page.click('text=Courses');

  // Small wait to capture background requests
  await page.waitForTimeout(1200);

  const bad = calls.filter(c => forbiddenHosts.some(h => c.url.includes(h)));
  expect(bad, `Blocked network calls found: ${JSON.stringify(bad, null, 2)}`).toHaveLength(0);
});
