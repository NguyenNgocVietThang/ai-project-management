// Exercises the production components against a fully intercepted localhost fixture.
const { chromium }=require(process.env.QA_PLAYWRIGHT_MODULE||'C:/Users/VIET THANG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const { session,geometry,fixture }=require('./browser-qa.cjs')
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3100'
const out=path.join(__dirname,'functional')
async function ready(page,view){await page.goto(`${base}/projects/2/tasks?view=${view}`,{waitUntil:'domcontentloaded',timeout:120000});await page.getByRole('status').filter({hasText:/result/}).waitFor({timeout:90000})}
async function run(){
 await fs.mkdir(out,{recursive:true})
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
 const report=[]
 for(const width of [390,1440]){
  const spec={width,locale:'en',theme:'dark',presentation:true,interactions:true,count:17}
  const s=await session(browser,spec),{page}=s,data=fixture(spec)
  const result={width,checks:{}}
  try{
   await ready(page,'list')
   const late=page.getByRole('button',{name:/Giai đoạn 12/})
   await late.scrollIntoViewIfNeeded();await late.click();assert.equal(await late.getAttribute('aria-expanded'),'false');await late.press('Enter');assert.equal(await late.getAttribute('aria-expanded'),'true')
   result.checks.latePhaseKeyboard=true
   const search=page.getByRole('searchbox')
   await search.fill('Phân tích yêu cầu nghiệp vụ');await page.getByRole('status').filter({hasText:'1 result'}).waitFor()
   for(const name of ['Board','Sprint','List']){await page.getByRole('button',{name,exact:true}).click();assert.equal(await search.inputValue(),'Phân tích yêu cầu nghiệp vụ')}
   result.checks.searchPreservedAcrossViews=true
   await page.goBack();assert.equal(new URL(page.url()).searchParams.get('view'),'sprint');assert.equal(await search.inputValue(),'Phân tích yêu cầu nghiệp vụ');await page.goForward();assert.equal(new URL(page.url()).searchParams.get('view'),'list');result.checks.historyRestoresViewAndSearch=true
   await search.fill('');await page.getByRole('status').filter({hasText:'17 results'}).waitFor()
   await page.getByRole('button',{name:data.tasks[0].name,exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Tab');assert.equal(await page.getByRole('dialog').evaluate(el=>el.contains(document.activeElement)),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0)
   result.checks.drawerKeyboard=true
   await page.getByRole('button',{name:'Sprint',exact:true}).click()
   if(width<1024){const select=page.getByLabel('Sprint or backlog');assert.ok((await select.locator('option').count())>=14);await select.selectOption('sprint_id:62');await page.getByRole('heading',{name:/Sprint 12/}).waitFor();await select.selectOption('sprint_id:999');await page.getByRole('heading',{name:'Unavailable sprint #999'}).waitFor();await select.selectOption('sprint_id:none')}
   else{await page.getByRole('navigation',{name:'Sprints and backlog'}).getByRole('button',{name:/Sprint 12/}).click();await page.getByRole('heading',{name:/Sprint 12/}).waitFor();await page.getByRole('navigation',{name:'Sprints and backlog'}).getByRole('button',{name:/Unavailable sprint #999/}).click();await page.getByRole('heading',{name:'Unavailable sprint #999'}).waitFor();await page.getByRole('navigation',{name:'Sprints and backlog'}).getByRole('button',{name:/Backlog/}).click()}
   result.checks.lateSprintUnknownAndBacklogReachable=true
   result.geometry=await geometry(page);assert.equal(result.geometry.documentOverflow,false)
   await page.screenshot({path:path.join(out,`sprint-${width}.png`),fullPage:false})
  }catch(e){result.failure=e.stack;await page.screenshot({path:path.join(out,`failure-${width}.png`)}).catch(()=>{})}
  result.errors=s.errors;report.push(result);await s.context.close()
 }
 // A backend result beyond the board/sprint 200-item page cap remains accessible.
 for(const view of ['board','list','sprint']){
  const s=await session(browser,{width:1440,locale:'en',theme:'light',count:205,presentation:true}),{page}=s
  const result={view,checks:{}}
  try{await ready(page,view);await page.getByRole('button',{name:'Next',exact:true}).click();await page.waitForURL(/page=2/);await page.getByRole('status').filter({hasText:'205 results'}).waitFor();assert.equal(new URL(page.url()).searchParams.get('page'),'2');result.checks.pageTwoAccessible=true}catch(e){result.failure=e.stack}
  result.errors=s.errors;report.push(result);await s.context.close()
 }
 // Keyboard drag uses a real browser; only the local in-memory fixture may change.
 const s=await session(browser,{width:1440,locale:'en',theme:'dark',count:5,presentation:true,interactions:true})
 const result={view:'board',checks:{}}
 try{await ready(s.page,'board');const handle=s.page.getByRole('button',{name:`Move ${fixture({count:5}).tasks[0].name}`,exact:true});await handle.focus();await s.page.keyboard.press('Space');for(let i=0;i<9;i++)await s.page.keyboard.press('ArrowRight');await s.page.keyboard.press('Space');await s.page.waitForTimeout(600);assert.ok(s.traffic.some(r=>r.method==='POST'&&r.path==='/tasks/101/status'));result.checks.keyboardStatusDrop=true}catch(e){result.failure=e.stack}
 result.errors=s.errors;report.push(result);await s.context.close()
 const loading=await session(browser,{width:1440,locale:'en',theme:'dark',count:17,presentation:true,slowFilters:true})
 const loadingResult={view:'sprint-filter-loading',checks:{}}
 try{await ready(loading.page,'sprint');await loading.page.getByRole('navigation',{name:'Sprints and backlog'}).getByRole('button',{name:/Sprint 12/}).click();await loading.page.getByRole('searchbox').fill('Phân tích yêu cầu nghiệp vụ');await loading.page.getByRole('status').filter({hasText:'1 result'}).waitFor();await loading.page.getByRole('heading',{name:/Sprint 12/}).waitFor();loadingResult.checks.selectedSprintSurvivesQueryLoading=true}catch(e){loadingResult.failure=e.stack}
 loadingResult.errors=loading.errors;report.push(loadingResult);await loading.context.close()
 await browser.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({width,view,checks,failure,errors})=>({width,view,checks,failure,errors}))));if(report.some(r=>r.failure||r.errors.length))process.exitCode=1
}
run().catch(e=>{console.error(e);process.exitCode=1})
