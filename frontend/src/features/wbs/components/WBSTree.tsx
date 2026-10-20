'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { Button } from '@/components/common/Button'
import type { PhaseNode, SprintNode } from '@/types/wbs.types'
import { WBSNodeRow } from './WBSNodeRow'

interface Props {
  phases: PhaseNode[]
  unphasedSprints: SprintNode[]
  canManage: boolean
  onEditPhase: (phase: PhaseNode) => void
  onDeletePhase: (phase: PhaseNode) => void
  onAddSprint: (phaseId: number) => void
  onEditSprint: (sprint: SprintNode) => void
  onDeleteSprint: (sprint: SprintNode) => void
  onStartSprint: (sprint: SprintNode) => void
  onCompleteSprint: (sprint: SprintNode) => void
}

export function WBSTree(props: Props) {
  const t = useTranslations('wbs')
  const format = useFormatter()
  const date = (value: string | null) => value ? format.dateTime(new Date(value), { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : t('dateNotSet')
  const dates = (item: PhaseNode | SprintNode) => !item.start_date && !item.end_date ? t('dateNotSet') : `${date(item.start_date)} – ${date(item.end_date)}`
  const actionClass = 'flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  const action = (label: string, run: () => void, destructive = false) => <button type="button" className={`${actionClass} ${destructive ? 'text-destructive' : ''}`} onClick={run}>{label}</button>

  const sprint = (item: SprintNode) => <WBSNodeRow key={item.id} kind={t('sprint')} name={item.name} status={t(`statuses.${item.status}`)} statusCode={item.status} dates={dates(item)} count={t('taskCount', { count: item.task_count })} actionsLabel={t('actionsFor', { name: item.name })} actions={props.canManage && <>
    {action(t('editSprint'), () => props.onEditSprint(item))}
    {item.status === 'PLANNED' && action(t('start'), () => props.onStartSprint(item))}
    {item.status === 'ACTIVE' && action(t('complete'), () => props.onCompleteSprint(item))}
    {action(t('deleteSprint'), () => props.onDeleteSprint(item), true)}
  </>}>
    {item.goal && <p className="mb-2 break-words text-sm">{item.goal}</p>}
    <p className="text-xs text-muted-foreground">{t('storyPoints', { completed: item.story_points_completed, committed: item.story_points_committed })}</p>
    {item.tasks.length > 0 && <ul className="mt-3 space-y-2">{item.tasks.map(task => <li key={task.id} className="break-words text-sm">{task.name}</li>)}</ul>}
  </WBSNodeRow>

  return <div className="space-y-4">
    <section aria-labelledby="wbs-phases">
      <h3 id="wbs-phases" className="mb-3 text-base font-semibold">{t('phases')}</h3>
      {props.phases.length === 0 && <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">{t('noPhases')}</p>}
      <ul className="space-y-2">{[...props.phases].sort((a, b) => a.order_index - b.order_index).map(phase => <WBSNodeRow key={phase.id} kind={t('phase')} name={phase.name} status={t(`statuses.${phase.status}`)} statusCode={phase.status} dates={dates(phase)} count={t('taskCount', { count: phase.task_count })} actionsLabel={t('actionsFor', { name: phase.name })} actions={props.canManage && <>
        {action(t('editPhase'), () => props.onEditPhase(phase))}
        {action(t('addSprint'), () => props.onAddSprint(phase.id))}
        {action(t('deletePhase'), () => props.onDeletePhase(phase), true)}
      </>}>
        {phase.description && <p className="mb-3 break-words text-sm">{phase.description}</p>}
        {phase.sprints.length > 0 ? <ul className="space-y-2">{phase.sprints.map(sprint)}</ul> : <p className="text-sm text-muted-foreground">{t('noSprints')}</p>}
        {phase.tasks.length > 0 && <ul className="mt-3 space-y-2">{phase.tasks.map(task => <li key={task.id} className="break-words text-sm">{task.name}</li>)}</ul>}
        {props.canManage && <Button variant="outline" fullWidth={false} className="mt-3" onClick={() => props.onAddSprint(phase.id)}>{t('addSprint')}</Button>}
      </WBSNodeRow>)}</ul>
    </section>
    {props.unphasedSprints.length > 0 && <section aria-labelledby="wbs-unphased"><h3 id="wbs-unphased" className="mb-3 text-base font-semibold">{t('unphasedSprints')}</h3><ul className="space-y-2">{props.unphasedSprints.map(sprint)}</ul></section>}
  </div>
}
