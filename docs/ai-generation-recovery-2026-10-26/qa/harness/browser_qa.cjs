/* Real Chrome/Next/FastAPI browser QA. All artifacts and auth fixtures stay runtime/. */
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { chromium, request } = require('C:/Users/VIET THANG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ROOT = path.resolve(__dirname, '../../../..');
const OUT = path.join(__dirname, 'runtime', 'browser');
fs.mkdirSync(OUT, { recursive: true });
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'runtime/fixture.json'), 'utf8'));
const catalogs = Object.fromEntries(['en', 'vi'].map(locale => [locale, JSON.parse(fs.readFileSync(path.join(ROOT, 'frontend/messages', `${locale}.json`), 'utf8'))]));
const origin = 'http://127.0.0.1:3180';
const backend = 'http://127.0.0.1:3181';
const mode = process.argv[2] || 'smoke';
const key = owner => `ai.requirementBrief.activeId.owner:${owner}`;
const jobKey = owner => `ai.requirementBrief.generationJobId.owner:${owner}`;
const report = { mode, started: new Date().toISOString(), scenarios: [], console: [], network: [], screenshots: [] };
let api, browser;

async function snapshot() { const r = await api.get('/__qa/snapshot'); assert.equal(r.status(), 200); return r.json(); }
async function control(body = {}) { const r = await api.post('/__qa/control', { data: body }); assert.equal(r.status(), 200); }
async function jobState(status, extra = {}) {
  const r = await api.post(`/__qa/job/${fixture.completed_job_id}`, { data: { status, ...extra } }); assert.equal(r.status(), 200);
}
function watch(page, label) {
  page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) report.console.push({label, type: msg.type(), text: msg.text(), location: msg.location()}); });
  page.on('pageerror', error => report.console.push({label, type: 'pageerror', text: error.message}));
  page.on('request', req => { if (req.url().includes('/api/v1/')) report.network.push({label, event: 'request', method: req.method(), path: new URL(req.url()).pathname, at: Date.now(), data: req.url().includes('generate-project') ? req.postDataJSON() : undefined}); });
  page.on('requestfailed', req => { if(req.url().includes('/api/v1/')) report.network.push({label,event:'requestfailed',method:req.method(),path:new URL(req.url()).pathname,error:req.failure(),at:Date.now()}); });
  page.on('response', res => { if (res.url().includes('/api/v1/')) report.network.push({label, event: 'response', path: new URL(res.url()).pathname, status: res.status(), at: Date.now()}); });
}
async function shot(page, name) { const file = path.join(OUT, `${name}.png`); await page.screenshot({ path: file, fullPage: true }); report.screenshots.push(file); }
async function openAI(page, locale) {
  await page.getByRole('button', { name: catalogs[locale].workspaceUi.generateWithAI, exact: true }).click();
  const modal = page.getByRole('dialog'); await modal.waitFor(); return modal;
}
async function login(page, owner = 'a') {
  await page.goto(`${origin}/login`, { waitUntil: 'domcontentloaded' });
  await page.locator('#email').fill(fixture[`email_${owner}`]);
  await page.locator('#password').fill(fixture.password);
  await Promise.all([page.waitForResponse(r => r.url().endsWith('/auth/login') && r.status() === 200), page.locator('form button[type=submit]').click()]);
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 120000, waitUntil: 'domcontentloaded' });
  await page.goto(`${origin}/projects`);
  await page.getByRole('button', { name: catalogs.en.workspaceUi.generateWithAI, exact: true }).waitFor();
}
async function freshContext(storageState, locale, width, recovery = true) {
  const native = process.env.QA_NATIVEVIS === '1' && mode === 'states' && recovery;
  const context = native ? browser.contexts()[0] : await browser.newContext({ storageState, viewport: { width, height: width < 500 ? 844 : 960 }, deviceScaleFactor: 1 });
  if (native) { context._qaNative = true; await context.clearCookies(); await context.addCookies(storageState.cookies); }
  await context.addCookies([{ name: 'locale', value: locale, url: origin }]);
  if (recovery) {
    // Explicit QA authorization: write only synthetic recovery IDs, never identity or credentials.
    await context.addInitScript(({ owner, brief, job, key, jobKey }) => {
      localStorage.setItem(key, String(brief)); localStorage.setItem(jobKey, job);
      localStorage.setItem('ai.requirementBrief.activeId', '999991');
      localStorage.setItem('ai.requirementBrief.generationJobId', '999992');
    }, { owner: fixture.owner_a, brief: fixture.completed_brief_id, job: fixture.completed_job_id, key: key(fixture.owner_a), jobKey: jobKey(fixture.owner_a) });
  }
  return context;
}
async function noCreation(before, after) {
  assert.equal(after.tables.jobs.length, before.tables.jobs.length, 'Restoration must not enqueue durable jobs');
  assert.equal(after.tables.ai_requests.length, before.tables.ai_requests.length, 'Restoration must not create AI requests');
  assert.equal(after.tables.projects.length, before.tables.projects.length, 'Restoration must not create projects');
  assert.equal(after.provider_calls.length, before.provider_calls.length, 'Restoration must not dispatch provider');
  const newRequests = after.requests.slice(before.requests.length);
  assert.equal(newRequests.filter(r => r.method === 'POST' && r.path.includes('generate-project')).length, 0);
}
async function restoreCase(storageState, locale, width) {
  const label = `restore-${locale}-${width}`;
  const before = await snapshot();
  await control({ me_delay_ms: 3500 });
  const context = await freshContext(storageState, locale, width);
  const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(60000); watch(page, label);
  const meRequest = page.waitForRequest(r => r.url().endsWith('/auth/me'), { timeout: 60000 });
  const meResponse = page.waitForResponse(r => r.url().endsWith('/auth/me') && r.status() === 200, { timeout: 60000 });
  const navigating = page.goto(`${origin}/projects`, { waitUntil: 'domcontentloaded' });
  await meRequest;
  await page.waitForTimeout(750);
  assert.equal(report.network.filter(r => r.label === label && r.event === 'request' && r.path.startsWith('/api/v1/ai/jobs/')).length, 0, 'No owner job GET before delayed me resolves');
  await shot(page, `${label}-cookie-bootstrap`);
  await meResponse; await navigating; await control();
  const modal = await openAI(page, locale);
  await modal.getByRole('button', { name: catalogs[locale].clarifier.viewProject, exact: true }).waitFor({ timeout: 30000 });
  await shot(page, `${label}-completed`);
  const jobGET = report.network.find(r => r.label === label && r.event === 'request' && r.path === `/api/v1/ai/jobs/${fixture.completed_job_id}`);
  const meDone = report.network.find(r => r.label === label && r.event === 'response' && r.path === '/api/v1/auth/me');
  assert.ok(jobGET && meDone && jobGET.at >= meDone.at);
  const legacy = await page.evaluate(() => ({ brief: localStorage.getItem('ai.requirementBrief.activeId'), job: localStorage.getItem('ai.requirementBrief.generationJobId') }));
  assert.deepEqual(legacy, { brief: '999991', job: '999992' });
  await page.keyboard.press('Escape'); await openAI(page, locale);
  await page.getByRole('dialog').getByRole('button', { name: catalogs[locale].clarifier.viewProject, exact: true }).waitFor();
  // Real same-owner full reload: all frontend modules/store instances are recreated.
  await page.reload(); await openAI(page, locale);
  await page.getByRole('dialog').getByRole('button', { name: catalogs[locale].clarifier.viewProject, exact: true }).waitFor();
  const after = await snapshot(); await noCreation(before, after);
  report.scenarios.push({ name: label, outcome: 'PASS', noJobBeforeMe: true, duplicatePost: 0, providerDelta: 0, legacyPreserved: true, closeReopen: true, sameOwnerReload: true });
  const nextState = await context.storageState(); await context.close(); return nextState;
}

(async () => {
  api = await request.newContext({ baseURL: backend, extraHTTPHeaders: { 'x-qa-control': 'local-recovery-qa' } });
  browser = process.env.QA_NATIVEVIS === '1' ? await chromium.connectOverCDP('http://127.0.0.1:3193', { noDefaults: true }) : await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: process.env.QA_HEADED !== '1', args: ['--disable-extensions'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addCookies([{ name: 'locale', value: 'en', url: origin }]);
  const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(60000); watch(page, 'real-login');
  await login(page); await shot(page, 'login-projects-en-1440');
  let storageState = await context.storageState();
  // Cookie bootstrap smoke uses a new context, never hydrates identity from disk.
  const reloaded = await freshContext(storageState, 'en', 1440, false);
  const restored = await reloaded.newPage(); watch(restored, 'cookie-only-reload');
  const restoredMe = restored.waitForResponse(r => r.url().endsWith('/auth/me') && r.status() === 200);
  await restored.goto(`${origin}/projects`);
  await restoredMe;
  await restored.getByRole('button', { name: catalogs.en.workspaceUi.generateWithAI, exact: true }).waitFor();
  assert.ok(report.network.some(r => r.label === 'cookie-only-reload' && r.event === 'response' && r.path === '/api/v1/auth/refresh' && r.status === 200));
  assert.ok(report.network.some(r => r.label === 'cookie-only-reload' && r.event === 'response' && r.path === '/api/v1/auth/me' && r.status === 200));
  report.scenarios.push({ name: 'login-and-cookie-only-reload', outcome: 'PASS' });
  await shot(restored, 'cookie-reload-projects-en-1440');
  storageState = await reloaded.storageState(); await reloaded.close(); await context.close();
  if (mode === 'restore' || mode === 'full') {
    for (const locale of ['en', 'vi']) for (const width of [1440, 390]) {
      storageState = await restoreCase(storageState, locale, width);
      if (mode === 'full') storageState = await require('./browser_status_matrix.cjs')({browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,jobState,noCreation}, storageState, locale, width);
    }
  }
  if (mode === 'states') {
    for (const locale of ['en','vi']) for (const width of [1440,390]) storageState = await require('./browser_status_matrix.cjs')({browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,jobState,noCreation},storageState,locale,width);
  }
  if (mode === 'waterfall' || mode === 'full') {
    for (const locale of ['en','vi']) for (const width of [1440,390]) storageState = await require('./browser_waterfall.cjs')({browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,jobState,noCreation},storageState,locale,width);
  }
  if (mode === 'account' || mode === 'full') await require('./browser_account_boundary.cjs')({browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,jobState,noCreation},storageState);
  report.outcome = 'PASS';
})().catch(async error => {
  report.outcome = 'FAIL'; report.error = error.stack; process.exitCode = 1;
  if (browser) for (const context of browser.contexts()) for (const page of context.pages()) {
    try { report.failureURL = page.url(); report.failureBody = (await page.locator('body').innerText()).slice(0, 8000); await shot(page, `${mode}-failure`); } catch {}
  }
})
.finally(async () => {
  report.finished = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, `${mode}-report.json`), JSON.stringify(report, null, 2));
  if (browser) await browser.close(); if (api) await api.dispose();
  console.log(JSON.stringify({ mode, outcome: report.outcome, scenarios: report.scenarios, error: report.error, artifacts: OUT }, null, 2));
});










