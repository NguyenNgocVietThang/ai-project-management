module.exports = async function waterfall(env, storageState, locale, width) {
  const {browser,api,fixture,catalogs,report,assert,origin,watch,shot,openAI,freshContext,snapshot,control,jobState,noCreation} = env;
  const before = await snapshot(); const label = `waterfall-${locale}-${width}`;
  const seeded = await api.post(`/__qa/brief/${fixture.owner_a}`); assert.equal(seeded.status(),200); const brief = (await seeded.json()).brief_id;
  const context = await freshContext(storageState,locale,width,false);
  await context.addInitScript(({owner,brief})=>{
    localStorage.setItem(`ai.requirementBrief.activeId.owner:${owner}`,String(brief));
    localStorage.removeItem(`ai.requirementBrief.generationJobId.owner:${owner}`);
  },{owner:fixture.owner_a,brief});
  const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(30000); watch(page,label);
  try {
    await page.goto(`${origin}/projects`); const modal = await openAI(page,locale);
    const selector = modal.getByRole('combobox',{name:catalogs[locale].clarifier.methodologyLabel,exact:true});
    await selector.waitFor(); assert.equal(await selector.inputValue(),'agile','Confirmed method selector must visibly default Agile');
    await selector.selectOption('waterfall'); assert.equal(await selector.inputValue(),'waterfall'); await selector.scrollIntoViewIfNeeded();
    await shot(page,`${label}-confirmed-selector`);
    const postResponse = page.waitForResponse(r=>r.url().endsWith('/ai/generate-project-from-brief')&&r.status()===202);
    await modal.getByRole('button',{name:catalogs[locale].clarifier.createProject,exact:true}).click();
    const accepted = await postResponse; const job = await accepted.json();
    await modal.getByRole('button',{name:catalogs[locale].clarifier.viewProject,exact:true}).waitFor({timeout:60000});
    const after = await snapshot();
    const requestRow = after.tables.ai_requests.find(row=>String(row.id)===job.job_id);
    assert.equal(requestRow.input_data_json.methodology,'waterfall');
    assert.equal(requestRow.input_data_json.brief_id,brief);
    const project = after.tables.projects.find(row=>row.id===requestRow.project_id);
    assert.equal(project.methodology,'waterfall','Project DB must persist waterfall, independently of echoed AI output');
    assert.equal(after.tables.jobs.length-before.tables.jobs.length,1);
    assert.equal(after.tables.projects.length-before.tables.projects.length,1);
    assert.equal(after.tables.ai_requests.length-before.tables.ai_requests.length,1);
    assert.equal(after.provider_calls.length-before.provider_calls.length,1);
    const phases = after.tables.phases.filter(row=>row.project_id===project.id);
    const tasks = after.tables.tasks.filter(row=>row.project_id===project.id);
    const deps = after.tables.dependencies.filter(row=>tasks.some(task=>task.id===row.successor_id));
    assert.equal(phases.length,3);assert.equal(tasks.length,3);assert.equal(deps.length,2);
    assert.equal(after.tables.sprints.filter(row=>row.project_id===project.id).length,0);
    const networkPost = report.network.find(r=>r.label===label&&r.event==='request'&&r.path.endsWith('/ai/generate-project-from-brief'));
    assert.equal(networkPost.data.methodology,'waterfall');
    const durable = after.tables.jobs.find(row=>row.payload?.ai_request_id===requestRow.id);
    assert.equal(durable.owner_id,fixture.owner_a); assert.equal(durable.status,'succeeded'); assert.equal(durable.request_dispatched,true);
    const pick=(row,keys)=>Object.fromEntries(keys.map(key=>[key,row[key]]));
    report.dbEvidence ??= [];
    report.dbEvidence.push({scenario:label,requestBody:networkPost.data,accepted:job,
      aiRequest:pick(requestRow,['id','user_id','request_type','status','project_id','input_data_json']),
      durableJob:pick(durable,['id','kind','owner_id','project_id','status','attempts','request_dispatched','request_dispatched_at']),
      project:pick(project,['id','name','pm_id','methodology','start_date','end_date']),
      phases:phases.map(row=>pick(row,['id','project_id','name'])),
      tasks:tasks.map(row=>pick(row,['id','project_id','phase_id','name','estimated_hours','start_date','end_date'])),
      dependencies:deps.map(row=>pick(row,['id','predecessor_id','successor_id','dependency_type','lag_days'])),
      sprintCount:0,providerDispatchDelta:after.provider_calls.length-before.provider_calls.length,
      countDelta:{jobs:after.tables.jobs.length-before.tables.jobs.length,aiRequests:after.tables.ai_requests.length-before.tables.ai_requests.length,projects:after.tables.projects.length-before.tables.projects.length}});
    await modal.getByRole('button',{name:catalogs[locale].clarifier.viewProject,exact:true}).click();
    await page.waitForURL(url=>url.pathname===`/projects/${project.id}/overview`,{timeout:120000,waitUntil:'domcontentloaded'});
    await page.getByText(catalogs[locale].project.methodologies.waterfall,{exact:true}).first().waitFor(); await shot(page,`${label}-persisted-badge`);
    report.scenarios.push({name:label,outcome:'PASS',job_id:job.job_id,project_id:project.id,requestMethodology:networkPost.data.methodology,dbMethodology:project.methodology,phases:phases.length,tasks:tasks.length,dependencies:deps.length,sprints:0,providerDelta:1});
    return await context.storageState();
  } finally { await context.close(); }
};



