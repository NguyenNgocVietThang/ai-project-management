/* Run with bundled Node; Playwright path can be overridden by QA_PLAYWRIGHT_MODULE. */
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'C:/Users/VIET THANG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs = require('node:fs/promises')
const path = require('node:path')
const { fixture } = require('./fixtures.cjs')
const broadFixtures = require('./broad-fixtures.cjs')
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000'
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error('QA_BASE_URL must be local')
const mode = process.argv[2] || 'baseline'
const out = path.join(__dirname, mode)
const report = { synthetic: true, source: 'Actual local Next.js UI with fully intercepted synthetic API responses; no production reads/writes.', mode, started: new Date().toISOString(), cases: [] }
function filtered(data, url) {
 let items = data.tasks.filter(t => !url.searchParams.get('search') || t.name.toLocaleLowerCase().includes(url.searchParams.get('search').toLocaleLowerCase()))
 for (const key of ['status', 'priority', 'phase_id', 'sprint_id', 'epic_id', 'assignee_id']) if (url.searchParams.has(key)) items = items.filter(t => String(t[key]) === url.searchParams.get(key))
 if (url.searchParams.has('due_date_from')) items = items.filter(t => t.due_date >= url.searchParams.get('due_date_from'))
 if (url.searchParams.has('due_date_to')) items = items.filter(t => t.due_date <= url.searchParams.get('due_date_to'))
 for (const label of url.searchParams.getAll('labels')) items = items.filter(t => t.labels.includes(label))
 const page = +(url.searchParams.get('page') || 1), page_size = +(url.searchParams.get('page_size') || 20)
 return { items: items.slice((page - 1) * page_size, page * page_size), total: items.length, page, page_size, total_pages: Math.ceil(items.length / page_size) }
}
async function session(browser, spec) {
 const context = await browser.newContext({ viewport: { width: spec.width, height: spec.width < 768 ? 844 : 900 }, locale: spec.locale === 'vi' ? 'vi-VN' : 'en-US', reducedMotion: 'reduce', serviceWorkers: 'block' })
 await context.addCookies([{ name: 'has-session', value: '1', url: base }, { name: 'locale', value: spec.locale, url: base }])
 await context.addInitScript(theme => { localStorage.setItem('theme', theme) }, spec.theme)
 const data = fixture(spec), traffic = [], errors = []
 const broad = broadFixtures(data)
 await context.routeWebSocket('**/*', socket => socket.close())
 await context.route('**/*', async route => {
  const req = route.request(), url = new URL(req.url()), method = req.method(), p = url.pathname.replace(/^\/api\/v1/, '').replace(/\/$/, '')
  // Same-origin Next.js RSC/prefetch/HMR GETs are frontend resources, not API data.
  const api = url.pathname.startsWith('/api/v1/') || (url.origin !== base && ['xhr', 'fetch'].includes(req.resourceType()))
  // All API traffic is fulfilled locally, regardless of configured API origin. There is no API fallback.
  if (api) {
   traffic.push({ method, path: p })
   const send = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': base, 'access-control-allow-credentials': 'true' }, body: JSON.stringify(body) })
   if (method === 'OPTIONS') return send({})
   if (p === '/auth/refresh' && method === 'POST') return send({ access_token: 'synthetic-local-qa-token-not-a-credential', token_type: 'bearer' })
   if (p === '/auth/ws-ticket' && method === 'POST') return send({ ticket: 'synthetic-local-qa-ticket' })
   if (p === '/projects/2/read' && method === 'POST') return send({ unread_count: 0, last_read_message_id: 602 })
   if (method !== 'GET') return send({ detail: 'Writes disabled in synthetic local QA' }, 405)
   if (p === '/auth/me') return send(data.user)
   if (p === '/projects/2') return send(data.project)
   const scoped = ['/projects/2/wbs', '/projects/2/tasks', '/projects/2/cpm', '/dashboards/projects/2/stats'].includes(p)
   if (scoped && spec.state === 'error') return send({ detail: 'Synthetic recoverable QA failure' }, 503)
   if (scoped && spec.state === 'loading') { await new Promise(r => setTimeout(r, 25000)); return send({}) }
   if (p === '/projects/2/wbs') return send(data.wbs)
   if (p === '/projects/2/tasks') return send(filtered(data, url))
   if (/^\/tasks\/\d+$/.test(p)) { const task = data.tasks.find(t => t.id === Number(p.split('/')[2])); return task ? send({ ...task, subtasks: [], assignments: [], predecessor_dependencies: [], successor_dependencies: [], total_logged_hours: 0, comments_count: 0 }) : send({ detail: 'Synthetic task not found' }, 404) }
   if (/^\/tasks\/\d+\/worklogs$/.test(p)) return send([])
   if (p === '/projects/2/cpm') return send(data.cpm)
   if (p === '/dashboards/projects/2/stats') return send(data.stats)
   if (p === '/projects/2/members') return send([{ user: data.user, role: { id: 1, name: 'PM' }, is_owner: true, joined_at: '2026-10-19T00:00:00Z' }])
   if (p.endsWith('/unread-count')) return send({ unread_count: 0 })
   if (p.endsWith('/active')) return send(null)
   if (p === '/projects') return send({ items: [data.project], total: 1, page: 1, page_size: 20, total_pages: 1 })
   if (Object.hasOwn(broad, p)) return send(broad[p])
   if (['/projects/2/activity', '/projects/2/dependencies', '/notifications', '/roles', '/users/me/permissions'].includes(p)) return send([])
   return send({ detail: `Unmapped synthetic fixture ${p}` }, 404)
  }
  if (url.origin === base && method === 'GET') return route.continue()
  // No external image/font/telemetry requests or frontend server-action writes.
  return route.abort('blockedbyclient')
 })
 const page = await context.newPage()
 page.on('pageerror', e => errors.push(e.message))
 page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
 return { context, page, traffic, errors }
}
async function geometry(page) {
 return page.evaluate(() => {
  const rect = el => { const r = el.getBoundingClientRect(); return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height } }
  const dialog = document.querySelector('[role="dialog"]')
  const ancestors = []
  if (dialog) for (let el = dialog.parentElement; el; el = el.parentElement) { const s = getComputedStyle(el); ancestors.push({ tag: el.tagName, className: el.className, rect: rect(el), transform: s.transform, filter: s.filter, backdropFilter: s.backdropFilter, perspective: s.perspective, contain: s.contain, position: s.position, overflow: s.overflow, willChange: s.willChange }) }
  const main = document.querySelector('main')
  return { width: innerWidth, height: innerHeight, scrollY, documentWidth: document.documentElement.scrollWidth, documentOverflow: document.documentElement.scrollWidth > innerWidth, overflowElements: [...document.querySelectorAll('main *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) }).slice(0, 30).map(el => ({ tag: el.tagName, className: el.className?.baseVal ?? el.className, text: el.textContent.slice(0, 100), rect: rect(el) })), title: document.title, main: main && rect(main), dialog: dialog && rect(dialog), ancestors, rawTranslationKeys: document.body.innerText.match(/\b(?:wbs|tasks|project|gantt)\.[A-Za-z][A-Za-z.]+/g) || [], reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }
 })
}
async function capture(browser, spec) {
 const s = await session(browser, spec), { page } = s
 const id = `${spec.route}-${spec.width}-${spec.locale}-${spec.theme}-${spec.count ?? 17}${spec.long ? '-long' : ''}-${spec.state || 'ready'}`
 const result = { ...spec, id }
 try {
  await page.goto(`${base}${spec.path || `/projects/2/${spec.route}`}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  if (!spec.path) await page.getByRole('heading', { name: /Dự án mẫu AI/ }).waitFor({ timeout: 90000 })
  else { await page.locator('main').waitFor({ timeout: 90000 }); await page.waitForTimeout(1200) }
  if (spec.state !== 'loading') await page.waitForTimeout(1200)
  result.geometry = await geometry(page)
  if (spec.route === 'tasks') {
   const firstTask = page.getByText(fixture(spec).tasks[0]?.name || '__no_task__', { exact: true }).first()
   if (await firstTask.count()) result.firstTaskRect = await firstTask.boundingBox()
  }
  result.bodyText = (await page.locator('body').innerText()).slice(0, 18000)
  await page.screenshot({ path: path.join(out, `${id}.png`), fullPage: true })
  await page.screenshot({ path: path.join(out, `${id}-viewport.png`), fullPage: false })
  const projectNav = page.locator('nav').filter({ has: page.locator('a[href="/projects/2/overview"]') }).last()
  if (await projectNav.count()) {
   result.navigation = { links: await projectNav.locator('a').evaluateAll(links => links.map(a => ({ href: a.getAttribute('href'), current: a.getAttribute('aria-current') }))), groups: [] }
   for (const summary of await projectNav.locator('summary').all()) {
    await summary.focus(); await page.keyboard.press('Enter')
    const isOpen = await summary.evaluate(el => el.parentElement.open)
    await page.keyboard.press('Escape')
    await page.keyboard.press('Enter')
    const openDocumentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    await page.keyboard.press('Escape')
    result.navigation.groups.push({ label: await summary.innerText(), openedWithEnter: isOpen, openDocumentWidth, noOpenOverflow: openDocumentWidth <= spec.width, closedWithEscape: await summary.evaluate(el => !el.parentElement.open), focusRestored: await summary.evaluate(el => el === document.activeElement) })
   }
  }
  if (spec.route === 'overview' && !spec.state) {
   const charts = page.locator('main summary').filter({ hasText: /Biểu đồ|Charts/ }).first()
   if (await charts.count()) {
    await charts.click(); await page.waitForTimeout(500)
    result.chartsOpen = await charts.evaluate(el => el.parentElement.open)
    result.chartsGeometry = await geometry(page)
    await page.screenshot({ path: path.join(out, `${id}-charts.png`), fullPage: true })
    await charts.click()
   }
  }
  if (spec.route === 'wbs' && !spec.state) {
   const phases = page.locator('section[aria-labelledby="wbs-phases"] > ul > li')
   if (await phases.count()) {
    result.wbsTree = { phaseCount: await phases.count(), rows: [] }
    for (const row of await phases.all()) {
     const button = row.locator('button[aria-expanded]').first()
     const label = await button.getAttribute('aria-label')
     const closedInitially = await button.getAttribute('aria-expanded') === 'false'
     const bounds = await row.boundingBox()
     await button.focus(); await page.keyboard.press('Enter')
     const expandedWithEnter = await button.getAttribute('aria-expanded') === 'true'
     await page.keyboard.press('Enter')
     const actions = row.locator('summary').first()
     let actionCheck
     if (await actions.count()) {
      await actions.focus(); await page.keyboard.press('Enter')
      const opened = await actions.evaluate(el => el.parentElement.open)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      await page.keyboard.press('Escape')
      actionCheck = { opened, noOverflow: !overflow, closedWithEscape: await actions.evaluate(el => !el.parentElement.open), focusRestored: await actions.evaluate(el => el === document.activeElement) }
     }
     result.wbsTree.rows.push({ label, bounds, closedInitially, expandedWithEnter, closedWithEnter: await button.getAttribute('aria-expanded') === 'false', metadata: await button.innerText(), actions: actionCheck })
    }
    await page.evaluate(() => window.scrollTo(0, 0))
   }
  }
  if (spec.dialog) {
   const opener = page.getByRole('button', { name: /^(Phase|Thêm giai đoạn|Add phase)$/i })
   await opener.click()
   await page.getByRole('dialog').waitFor()
   await page.waitForTimeout(700)
   result.dialog = await geometry(page)
   await page.screenshot({ path: path.join(out, `${id}-dialog.png`), fullPage: false })
   result.focusInitiallyInside = await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))
   result.focusTrap = []
   for (let i = 0; i < 16; i++) { await page.keyboard.press('Tab'); result.focusTrap.push(await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))) }
   await page.keyboard.press('Escape')
   result.escapeClosed = await page.getByRole('dialog').count() === 0
   result.focusRestored = await opener.evaluate(el => el === document.activeElement)
   await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
   await opener.click()
   await page.getByRole('dialog').waitFor()
   result.dialogAfterScroll = await geometry(page)
   await page.keyboard.press('Shift+Tab')
   result.reverseFocusTrap = await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))
   await page.keyboard.press('Escape')
  }
  if (process.env.QA_INTERACTIONS === '1' && spec.route === 'tasks' && !spec.state && !spec.long && (spec.count ?? 17) === 17 && spec.width === 390 && spec.locale === 'vi' && spec.theme === 'light') {
   const search = page.locator('input[aria-label="Tìm công việc…"]')
   await search.fill('Phân tích'); await page.waitForTimeout(800)
   const renderedCount = async () => page.evaluate(names => names.filter(name => document.body.innerText.includes(name)).length, fixture().tasks.map(t => t.name))
   result.taskInteractions = { searchedCount: await renderedCount(), searchUrl: page.url() }
   for (const name of [/^(Bảng|Board)$/i, /^(Danh sách|List)$/i]) {
    const button = page.getByRole('button', { name })
    if (await button.count()) { await button.click(); await page.waitForTimeout(250); result.taskInteractions[`preservedAfter${name.source}`] = await search.inputValue() === 'Phân tích' }
   }
   const listUrl = page.url()
   await page.goBack(); await page.waitForTimeout(350)
   result.taskInteractions.backRestoresBoard = new URL(page.url()).searchParams.get('view') === 'board' && await search.inputValue() === 'Phân tích'
   await page.goForward(); await page.waitForTimeout(350)
   result.taskInteractions.forwardRestoresList = page.url() === listUrl && await search.inputValue() === 'Phân tích'
   const filtersButton = page.getByRole('button', { name: /^Bộ lọc/ })
   await filtersButton.click(); await page.getByRole('dialog').waitFor()
   result.taskInteractions.filterDialog = await geometry(page)
   result.taskInteractions.filterFocusTrap = []
   for (let i = 0; i < 16; i++) { await page.keyboard.press('Tab'); result.taskInteractions.filterFocusTrap.push(await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))) }
   const footerButton = page.getByRole('dialog').getByRole('button', { name: /hiển thị|xem|kết quả/i }).last()
   if (await footerButton.count()) result.taskInteractions.filterFooterRect = await footerButton.boundingBox()
   await page.keyboard.press('Escape')
   result.taskInteractions.filterClosedRestored = await page.getByRole('dialog').count() === 0 && await filtersButton.evaluate(el => el === document.activeElement)
   await page.screenshot({ path: path.join(out, `${id}-search.png`), fullPage: false })
   await search.fill(''); await page.waitForTimeout(800)
   result.taskInteractions.clearedCount = await renderedCount()
   const taskName = page.getByText(fixture().tasks[0].name, { exact: true }).first()
   await taskName.click(); await page.getByRole('dialog').waitFor()
   await page.waitForTimeout(350)
   result.taskInteractions.drawerOpened = await page.getByRole('dialog').getByText(fixture().tasks[0].name, { exact: true }).count() > 0
   result.taskInteractions.drawerGeometry = await geometry(page)
   result.taskInteractions.drawerFocusTrap = []
   for (let i = 0; i < 16; i++) { await page.keyboard.press('Tab'); result.taskInteractions.drawerFocusTrap.push(await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))) }
   const save = page.getByRole('dialog').getByRole('button', { name: /Lưu/ }).last()
   if (await save.count()) result.taskInteractions.drawerFooterRect = await save.boundingBox()
   await page.screenshot({ path: path.join(out, `${id}-task-drawer.png`), fullPage: false })
   await page.keyboard.press('Escape')
   result.taskInteractions.drawerClosed = await page.getByRole('dialog').count() === 0
   result.taskInteractions.drawerFocusRestored = await taskName.evaluate(el => el.closest('button') === document.activeElement)
  }
 } catch (e) { result.failure = e.message; await page.screenshot({ path: path.join(out, `${id}-failure.png`) }).catch(() => {}) }
 result.traffic = s.traffic; result.errors = s.errors
 result.checks = {
  loaded: !result.failure,
  noDocumentOverflow: result.geometry ? !result.geometry.documentOverflow : false,
  noRawTranslationKeys: result.geometry ? result.geometry.rawTranslationKeys.length === 0 : false,
  reducedMotion: result.geometry?.reducedMotion === true,
  noUnexpectedRuntimeErrors: spec.state === 'error' || s.errors.length === 0,
  ...(spec.dialog && !result.failure ? { dialogFitsViewport: result.dialog.dialog.top >= 0 && result.dialog.dialog.bottom <= result.dialog.height, forwardFocusTrap: result.focusTrap.every(Boolean), reverseFocusTrap: result.reverseFocusTrap, escapeCloses: result.escapeClosed, openerFocusRestored: result.focusRestored } : {}),
  ...(result.navigation?.groups.length ? { navigationHas13Links: result.navigation.links.length === 13, navigationKeyboard: result.navigation.groups.every(g => g.openedWithEnter && g.closedWithEscape && g.focusRestored), navigationNoOpenOverflow: result.navigation.groups.every(g => g.noOpenOverflow) } : {})
  ,...(result.wbsTree ? { wbs3Phases: result.wbsTree.phaseCount === 3, wbsKeyboard: result.wbsTree.rows.every(row => row.closedInitially && row.expandedWithEnter && row.closedWithEnter && (!row.actions || row.actions.opened && row.actions.noOverflow && row.actions.closedWithEscape && row.actions.focusRestored)) } : {})
  ,...(result.taskInteractions ? { taskSearchOneResult: result.taskInteractions.searchedCount === 1, taskClear17Results: result.taskInteractions.clearedCount === 17, taskDrawerOpensCloses: !!(result.taskInteractions.drawerOpened && result.taskInteractions.drawerClosed), taskViewPreservesSearch: Object.entries(result.taskInteractions).filter(([key]) => key.startsWith('preservedAfter')).every(([, pass]) => pass), taskHistoryRestoresState: !!(result.taskInteractions.backRestoresBoard && result.taskInteractions.forwardRestoresList), taskFilterKeyboard: !!(result.taskInteractions.filterFocusTrap?.every(Boolean) && result.taskInteractions.filterClosedRestored) } : {})
 }
 report.cases.push(result)
 await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2))
 await s.context.close()
 console.log(id, result.failure || `overflow=${result.geometry?.documentOverflow}`)
}
async function main() {
 await fs.mkdir(out, { recursive: true })
 const browser = await chromium.launch({ headless: true, executablePath: process.env.QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
 let specs
 if (mode === 'baseline') specs = [390, 320, 1440].map(width => ({ route: 'wbs', width, locale: 'vi', theme: 'light', dialog: true })).concat(['tasks', 'overview', 'gantt'].flatMap(route => [390, 1440].map(width => ({ route, width, locale: 'vi', theme: 'light' }))))
 else if (mode.startsWith('smoke')) specs = ['wbs', 'tasks', 'overview', 'gantt'].flatMap(route => (route === 'wbs' ? [320, 390, 1440] : [390, 1440]).map(width => ({ route, width, locale: 'vi', theme: 'light', dialog: route === 'wbs' })))
 else if (mode.startsWith('broad')) specs = ['/dashboard', '/portfolios', '/portfolios/21', '/projects', '/projects/2/timesheet', '/projects/2/members', '/projects/2/chat', '/projects/2/documents', '/admin', '/admin/users', '/admin/roles', '/admin/audit'].flatMap(url => [390, 1440].map(width => ({ path: url, route: url.slice(1).replaceAll('/', '-'), width, locale: 'vi', theme: 'light' })))
 else specs = [320, 390, 768, 1024, 1440].flatMap(width => ['vi', 'en'].flatMap(locale => ['light', 'dark'].flatMap(theme => ['wbs', 'tasks', 'overview', 'gantt'].map(route => ({ width, locale, theme, route, dialog: route === 'wbs' }))))).concat([0, 1, 50].flatMap(count => ['wbs', 'tasks', 'gantt'].map(route => ({ width: 390, locale: 'vi', theme: 'light', route, count, long: count === 50 })))).concat(['loading', 'error'].flatMap(state => ['wbs', 'tasks', 'gantt'].map(route => ({ width: 390, locale: 'vi', theme: 'light', route, state }))))
 if (process.env.QA_ROUTE) specs = specs.filter(s => process.env.QA_ROUTE.split(',').includes(s.route))
 if (process.env.QA_WIDTH) specs = specs.filter(s => process.env.QA_WIDTH.split(',').map(Number).includes(s.width))
 for (const spec of specs) await capture(browser, spec)
 await browser.close()
 report.completed = new Date().toISOString()
 report.summary = { cases: report.cases.length, passed: report.cases.filter(c => Object.values(c.checks).every(Boolean)).length, failures: report.cases.filter(c => !Object.values(c.checks).every(Boolean)).map(c => ({ id: c.id, failedChecks: Object.entries(c.checks).filter(([, pass]) => !pass).map(([key]) => key), failure: c.failure })) }
 await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2))
 console.log(`Saved ${report.cases.length} cases to ${out}`)
 console.log(JSON.stringify(report.summary))
 if (mode !== 'baseline' && report.summary.failures.length) process.exitCode = 1
}
main().catch(e => { console.error(e); process.exitCode = 1 })
