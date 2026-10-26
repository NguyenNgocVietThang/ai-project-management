// Local synthetic fixture with many real phase/sprint relationships and orphan IDs.
const { fixture: baseFixture } = require('../ui-redesign-2026-10-20/fixtures.cjs')
function fixture(spec = {}) {
 const data = baseFixture(spec)
 const phases = Array.from({length:12}, (_,i) => ({...data.wbs.phases[0], id:11+i, name:`Giai đoạn ${i+1} — Phân tích và phát triển`, sprints:[{id:51+i,phase_id:11+i,name:`Sprint ${i+1} — Phát triển và nghiệm thu`,status:'PLANNED',start_date:null,end_date:null}]}))
 data.wbs.phases=phases
 data.project.phases=phases
 data.tasks.forEach((t,i)=>{t.status=['TODO','IN_PROGRESS','IN_REVIEW','DONE','BLOCKED'][i%5];t.phase_id=i%13===12?null:11+i%12;t.sprint_id=i%13===12?null:51+i%12})
 if(data.tasks.length>1&&!spec.presentation)data.tasks[1].name='LongUnbrokenTaskName'.repeat(9)
 if(data.tasks.length>2){data.tasks.at(-1).phase_id=999;data.tasks.at(-1).sprint_id=999}
 return data
}
module.exports={fixture}
