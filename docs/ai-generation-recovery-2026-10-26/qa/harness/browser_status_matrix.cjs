/* Supplemental real-browser status matrix; called by browser_qa.cjs full. */
module.exports = async function statusMatrix(env, storageState, locale, width) {
  const { browser, api, fixture, catalogs, report, assert, origin, watch, shot, openAI, freshContext, snapshot, control, jobState, noCreation } = env;
  const label = `states-${locale}-${width}`;
  const text = catalogs[locale].clarifier;
  const before = await snapshot();
  const context = await freshContext(storageState, locale, width);
  const page = await context.newPage(); await page.setViewportSize({width,height:width<500?844:960}); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(30000); watch(page, label);
  async function load(status, extra) {
    await jobState(status, extra); await page.goto(`${origin}/projects`); return openAI(page, locale);
  }
  try {
    let modal = await load('PENDING');
    await modal.getByText(text.queued, {exact:true}).waitFor(); await shot(page, `${label}-pending`);
    modal = await load('PROCESSING');
    await modal.getByText(text.generating, {exact:true}).waitFor(); await shot(page, `${label}-processing`);
    await context.setOffline(true);
    await modal.getByText(text.offlineStatus, {exact:true}).waitFor(); await shot(page, `${label}-offline`);
    const offlineBefore = (await snapshot()).requests.filter(r => r.method === 'GET' && r.path.includes('/ai/jobs/')).length;
    await page.waitForTimeout(5500);
    const offlineAfter = (await snapshot()).requests.filter(r => r.method === 'GET' && r.path.includes('/ai/jobs/')).length;
    assert.equal(offlineAfter, offlineBefore, 'Offline must pause status GET');
    await context.setOffline(false);
    await modal.getByText(text.generating, {exact:true}).waitFor();
    const background = await context.newPage();
    await background.goto('about:blank'); await background.bringToFront();
    await page.waitForTimeout(300);
    const visibility = await page.evaluate(() => document.visibilityState);
    assert.equal(visibility, 'hidden', 'This run must actually hide the app tab; rerun QA_HEADED=1 if headless Chrome keeps all pages visible');
    await modal.getByText(text.pausedStatus, {exact:true}).waitFor();
    const hiddenBefore = (await snapshot()).requests.filter(r => r.method === 'GET' && r.path.includes('/ai/jobs/')).length;
    await page.waitForTimeout(5500);
    assert.equal((await snapshot()).requests.filter(r => r.method === 'GET' && r.path.includes('/ai/jobs/')).length, hiddenBefore, 'Hidden tab must pause status GET');
    await page.bringToFront(); await background.close();
    await modal.getByText(text.generating, {exact:true}).waitFor(); await shot(page, `${label}-visible-again`);
    // Long wait uses actual elapsed wall time once. Other matrix rows cover copy/viewport states.
    if (locale === 'en' && width === 1440) {
      await modal.getByText(text.longWait, {exact:true}).waitFor({timeout: 130000});
      await shot(page, `${label}-long-wait-120s`);
      const retry = modal.getByRole('button', {name: text.checkStatus, exact:true});
      await retry.waitFor();
      const read = page.waitForResponse(r => r.url().endsWith(`/ai/jobs/${fixture.completed_job_id}`) && r.status() === 200);
      await retry.click(); await read;
    }
    await jobState('COMPLETED'); await control({job_get_503_remaining:1});
    await page.reload(); modal = await openAI(page, locale);
    await modal.getByText(text.statusUnavailable, {exact:true}).waitFor(); await shot(page, `${label}-GET503`);
    const retryRead = page.waitForResponse(r => r.url().endsWith(`/ai/jobs/${fixture.completed_job_id}`) && r.status() === 200);
    await modal.getByRole('button', {name:text.retryStatus, exact:true}).click(); await retryRead;
    await modal.getByRole('button', {name:text.viewProject, exact:true}).waitFor();
    modal = await load('FAILED');
    await modal.getByText(text.generationFailed, {exact:true}).waitFor(); await shot(page, `${label}-failed`);
    modal = await load('COMPLETED', {missing_project_link:true});
    await modal.getByText(text.missingProject, {exact:true}).waitFor(); await shot(page, `${label}-missing-project`);
    assert.equal(await modal.getByRole('button', {name:text.viewProject, exact:true}).count(), 0);
    await jobState('COMPLETED');
    await modal.getByRole('button', {name:text.checkStatus, exact:true}).click();
    await modal.getByRole('button', {name:text.viewProject, exact:true}).waitFor();
    // Keyboard remains trapped in dialog and Escape closes it.
    await page.keyboard.press('Tab');
    assert.equal(await modal.evaluate(el => el.contains(document.activeElement)), true);
    await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
    await noCreation(before, await snapshot());
    report.scenarios.push({name:label, outcome:'PASS', statuses:['PENDING','PROCESSING','offline','hidden','GET503','FAILED','missing-project','COMPLETED'], actualHidden:true, longWait120s:locale==='en'&&width===1440, noCreation:true, keyboard:true});
    return await context.storageState();
  } finally {
    await context.setOffline(false); await control(); await jobState('COMPLETED'); if(context._qaNative) await page.close(); else await context.close();
  }
};

