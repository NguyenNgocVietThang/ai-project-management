module.exports = async function accountBoundary(env, storageState) {
  const {browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,noCreation} = env;
  const before = await snapshot(); const label = 'delayed-me-logout-account-b';
  await control({me_delay_ms:30000});
  const context = await freshContext(storageState, 'en', 1440);
  const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(65000); watch(page,label);
  try {
    const oldMeRequest = page.waitForRequest(r => r.url().endsWith('/auth/me'));
    let oldMeAt, bMeAt;
    const oldMeResponse = page.waitForResponse(async r => r.url().endsWith('/auth/me') && r.status() === 200 && (await r.json()).id === fixture.owner_a).then(response => { oldMeAt=Date.now(); return response; });
    await page.goto(`${origin}/projects`,{waitUntil:'domcontentloaded'}); await oldMeRequest;
    // Existing dashboard shell can render after refresh while profile remains empty.
    const modal = await openAI(page,'en');
    await modal.getByText(catalogs.en.clarifier.restoringSession,{exact:true}).waitFor();
    await shot(page,'delayed-me-empty-owner-restoring');
    assert.equal(report.network.filter(r=>r.label===label&&r.event==='request'&&r.path.includes('/ai/jobs/')).length,0);
    await page.keyboard.press('Escape');
    await control(); // Captured A response keeps its delay; new B me is immediate.
    const loggedOut = page.waitForResponse(r=>r.url().endsWith('/auth/logout')&&r.status()===200);
    await page.getByRole('button',{name:catalogs.en.nav.logout,exact:true}).click(); await loggedOut;
    await page.waitForURL(url=>url.pathname==='/login',{timeout:60000});
    await page.locator('#email').fill(fixture.email_b); await page.locator('#password').fill(fixture.password);
    const bMe = page.waitForResponse(async r=>r.url().endsWith('/auth/me')&&r.status()===200&&(await r.json()).id===fixture.owner_b).then(response=>{bMeAt=Date.now();return response;});
    await page.locator('form button[type=submit]').click(); await bMe;
    await oldMeResponse; assert.ok(oldMeAt>bMeAt,'A profile must actually arrive after B profile');
    await page.waitForURL(url=>url.pathname!=='/login',{timeout:120000,waitUntil:'domcontentloaded'});
    // Assert before any full navigation can erase a stale in-memory identity.
    await page.getByText('Recovery QA B',{exact:true}).waitFor();
    assert.equal(await page.getByText('Recovery QA A',{exact:true}).count(),0);
    await shot(page,'account-b-after-old-a-me-same-document');
    await page.goto(`${origin}/projects`);
    await page.getByText('Recovery QA B',{exact:true}).waitFor();
    assert.equal(await page.getByText('Recovery QA A',{exact:true}).count(),0);
    const bModal = await openAI(page,'en');
    await bModal.locator('textarea').waitFor();
    assert.equal(await bModal.getByRole('button',{name:catalogs.en.clarifier.viewProject,exact:true}).count(),0);
    await shot(page,'account-b-no-a-recovery');
    const after = await snapshot(); await noCreation(before,after);
    assert.equal(after.requests.slice(before.requests.length).filter(r=>r.subject===String(fixture.owner_b)&&r.path===`/api/v1/ai/jobs/${fixture.completed_job_id}`).length,0);
    const legacy = await page.evaluate(()=>({brief:localStorage.getItem('ai.requirementBrief.activeId'),job:localStorage.getItem('ai.requirementBrief.generationJobId')}));
    assert.deepEqual(legacy,{brief:'999991',job:'999992'});
    report.scenarios.push({name:label,outcome:'PASS',oldMeAfterLogoutAndB:true,noAIdentity:true,noAJobForB:true,legacyPreserved:true});
  } finally { await control(); await context.close(); }
};



