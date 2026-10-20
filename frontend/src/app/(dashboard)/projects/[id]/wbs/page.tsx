'use client'
import { useFormatter, useTranslations } from 'next-intl'

import { useEffect, useId, useState } from 'react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { CalendarDays, CheckCircle2, Flag, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Modal } from '@/components/common/Modal'
import { ErrorState } from '@/components/common/PageState'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton, SkeletonCard, SkeletonRegion, SkeletonText } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { WBSTree } from '@/features/wbs/components/WBSTree'
import { usePhaseImpact, useWBS, useWBSActions } from '@/features/wbs/hooks/useWBS'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import type { Epic, Milestone, Phase, Sprint } from '@/types/wbs.types'

type Editor =
  | { kind: 'phase'; item?: Phase }
  | { kind: 'sprint'; phaseId: number; item?: Sprint }
  | { kind: 'epic'; item?: Epic }
  | { kind: 'milestone'; item?: Milestone }

export default function WBSPage() {
  const projectId = useNumericParam()
  const query = useWBS(projectId)
  const projectQuery = useProjectDetail(projectId)
  const actions = useWBSActions(projectId)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [deleting, setDeleting] = useState<Phase | null>(null)
  // Dùng ConfirmDialog chung thay cho window.confirm để khớp giao diện.
  const [confirming, setConfirming] = useState<{ label: string; run: () => void } | null>(null)
  const t = useTranslations('wbs')
  const format = useFormatter()
  const dateLabel = (value: string | null) => value ? format.dateTime(new Date(value), { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : t('dateNotSet')
  const confirmDelete = (label: string, mutation: () => void) => setConfirming({ label, run: mutation })
  if (query.isLoading) return <WBSSkeleton />
  if (query.isError || !query.data) return <ErrorState message={t('loadError')} retryLabel={t('retry')} onRetry={() => void query.refetch()} />
  const wbs = query.data
  const canManage = Boolean(projectQuery.data?.current_user_role === 'PM' || projectQuery.data?.capabilities.can_update)
  return <div className="space-y-4">
    <SectionHeader
      title={t('title')}
      description={t('subtitle')}
      className="mb-0 flex-col sm:flex-row sm:items-end"
      action={canManage && <div className="flex flex-wrap items-center gap-2">
        <Button fullWidth={false} onClick={() => setEditor({ kind: 'phase' })}><Plus className="h-4 w-4" aria-hidden="true" />{t('addPhase')}</Button>
        <details className="relative" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}>
          <summary className="flex min-h-11 cursor-pointer items-center rounded-lg border bg-card px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{t('createOther')}</summary>
          <div className="absolute right-0 top-full z-20 mt-1 min-w-48 rounded-lg border bg-popover p-1 shadow-lg" onClick={event => { const details = event.currentTarget.closest('details'); if (details) details.open = false }}>
            <Button variant="ghost" className="justify-start" onClick={() => setEditor({ kind: 'epic' })}>{t('addEpic')}</Button>
            <Button variant="ghost" className="justify-start" onClick={() => setEditor({ kind: 'milestone' })}>{t('addMilestone')}</Button>
          </div>
        </details>
      </div>}
    />

    <WBSTree phases={wbs.phases} unphasedSprints={wbs.unphased_sprints} canManage={canManage}
      onEditPhase={phase => setEditor({ kind: 'phase', item: phase })}
      onDeletePhase={setDeleting}
      onAddSprint={phaseId => setEditor({ kind: 'sprint', phaseId })}
      onEditSprint={sprint => setEditor({ kind: 'sprint', phaseId: sprint.phase_id ?? 0, item: sprint })}
      onDeleteSprint={sprint => confirmDelete(sprint.name, () => actions.deleteSprint.mutate(sprint.id))}
      onStartSprint={sprint => actions.startSprint.mutate(sprint.id)}
      onCompleteSprint={sprint => actions.completeSprint.mutate(sprint.id)} />

    {/* ===== Epic và mốc (milestone) dạng danh sách trong card ===== */}
    <div className="grid gap-6 xl:grid-cols-2">
      <Card flush as="section" className="overflow-hidden" aria-labelledby="wbs-epics">
        <div className="border-b px-4 py-3"><BlockTitle id="wbs-epics" icon={<Flag className="h-5 w-5" aria-hidden="true" />}>{t('epics')}</BlockTitle></div>
        {wbs.epics.length === 0 ? <div className="p-4"><Empty label={t('noEpics')} /></div> : <ul className="divide-y">{wbs.epics.map(epic => <li key={epic.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
          <div className="flex min-w-0 items-center gap-3">
            {/* Màu epic do người dùng chọn nên giữ dạng style; mặc định dùng token muted-foreground. */}
            <span className="h-3 w-3 shrink-0 rounded-full bg-muted-foreground" style={epic.color ? { background: epic.color } : undefined} aria-hidden="true" />
            <div className="min-w-0"><strong className="block break-words text-body-sm [overflow-wrap:anywhere] font-medium">{epic.name}</strong><Badge tone={statusTone(epic.status)} size="sm" className="mt-1">{t(`statuses.${epic.status}`)}</Badge></div>
          </div>
          {canManage && <div className="flex shrink-0">
            <IconButton label={t('editEpic')} onClick={() => setEditor({ kind: 'epic', item: epic })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label={t('deleteEpic')} destructive onClick={() => confirmDelete(epic.name, () => actions.deleteEpic.mutate(epic.id))}><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
          </div>}
        </li>)}</ul>}
      </Card>
      <Card flush as="section" className="overflow-hidden" aria-labelledby="wbs-milestones">
        <div className="border-b px-4 py-3"><BlockTitle id="wbs-milestones" icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}>{t('milestones')}</BlockTitle></div>
        {wbs.milestones.length === 0 ? <div className="p-4"><Empty label={t('noMilestones')} /></div> : <ul className="divide-y">{wbs.milestones.map(milestone => <li key={milestone.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
          <div className="min-w-0">
            <strong className="block break-words text-body-sm [overflow-wrap:anywhere] font-medium">{milestone.name}</strong>
            <div className="mt-1 flex flex-wrap items-center gap-2"><span className="text-caption tabular-nums text-muted-foreground">{dateLabel(milestone.due_date)}</span><Badge tone={statusTone(milestone.status)} size="sm" dot>{t(`statuses.${milestone.status}`)}</Badge></div>
          </div>
          {canManage && <div className="flex shrink-0">
            {milestone.status !== 'COMPLETED' && <IconButton label={t('completeMilestone')} onClick={() => actions.completeMilestone.mutate(milestone.id)}><CheckCircle2 className="h-4 w-4" aria-hidden="true" /></IconButton>}
            <IconButton label={t('editMilestone')} onClick={() => setEditor({ kind: 'milestone', item: milestone })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label={t('deleteMilestone')} destructive onClick={() => confirmDelete(milestone.name, () => actions.deleteMilestone.mutate(milestone.id))}><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
          </div>}
        </li>)}</ul>}
      </Card>
    </div>
    <EntityEditor editor={editor} onClose={() => setEditor(null)} actions={actions} />
    <ConfirmDialog
      open={confirming !== null}
      title={t('deleteConfirm', { name: confirming?.label ?? '' })}
      description={t('deleteWarning')}
      confirmLabel={t('delete')}
      onConfirm={() => { confirming?.run(); setConfirming(null) }}
      onClose={() => setConfirming(null)}
    />
    <DeletePhaseDialog phase={deleting} phases={wbs.phases} onClose={() => setDeleting(null)} onDelete={(strategy, targetPhaseId) => actions.deletePhase.mutate({ id: deleting!.id, strategy, targetPhaseId }, { onSuccess: () => setDeleting(null) })} isLoading={actions.deletePhase.isPending} />
  </div>
}

function EntityEditor({ editor, onClose, actions }: { editor: Editor | null; onClose: () => void; actions: ReturnType<typeof useWBSActions> }) {
  const t = useTranslations('wbs')
  const formId = useId()
  const [form, setForm] = useState<Record<string, string>>({})
  useEffect(() => { if (!editor) return; const item = editor.item; setForm({ name: item?.name || '', description: 'description' in (item || {}) ? String((item as Epic | Milestone | Phase).description || '') : '', goal: 'goal' in (item || {}) ? String((item as Sprint).goal || '') : '', start_date: 'start_date' in (item || {}) ? String((item as Phase | Sprint).start_date || '') : '', end_date: 'end_date' in (item || {}) ? String((item as Phase | Sprint).end_date || '') : '', due_date: 'due_date' in (item || {}) ? String((item as Milestone).due_date || '') : '', color: 'color' in (item || {}) ? String((item as Epic).color || '#3b82f6') : '#3b82f6', status: item?.status || '' }) }, [editor])
  if (!editor) return null
  const submit = (event: React.FormEvent) => { event.preventDefault(); const cleaned = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value || null])); const done = { onSuccess: onClose }
    if (editor.kind === 'phase') editor.item ? actions.updatePhase.mutate({ id: editor.item.id, body: cleaned }, done) : actions.createPhase.mutate(cleaned as never, done)
    if (editor.kind === 'sprint') editor.item ? actions.updateSprint.mutate({ id: editor.item.id, body: cleaned }, done) : actions.createSprint.mutate({ phaseId: editor.phaseId, body: cleaned as never }, done)
    if (editor.kind === 'epic') editor.item ? actions.updateEpic.mutate({ id: editor.item.id, body: cleaned }, done) : actions.createEpic.mutate(cleaned as never, done)
    if (editor.kind === 'milestone') editor.item ? actions.updateMilestone.mutate({ id: editor.item.id, body: cleaned }, done) : actions.createMilestone.mutate(cleaned as never, done)
  }
  const pending = Object.values(actions).some(value => 'isPending' in value && value.isPending)
  return <Modal open onClose={onClose} title={t(`editor.${editor.item ? 'edit' : 'create'}.${editor.kind}`)}
    footer={<div className="flex justify-end gap-2">
      <Button type="button" variant="outline" fullWidth={false} onClick={onClose}>{t('cancel')}</Button>
      <Button type="submit" form={formId} fullWidth={false} isLoading={pending}>{t('save')}</Button>
    </div>}>
    <form id={formId} className="space-y-4" onSubmit={submit}>
      <Field label={t('fields.name')}><Input required minLength={3} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
      {editor.kind === 'sprint'
        ? <Field label={t('fields.goal')}><textarea className={TEXTAREA_CLASS} value={form.goal || ''} onChange={e => setForm({ ...form, goal: e.target.value })} /></Field>
        : <Field label={t('fields.description')}><textarea className={TEXTAREA_CLASS} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>}
      {(editor.kind === 'phase' || editor.kind === 'sprint') && <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('fields.startDate')}><Input type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} /></Field>
        <Field label={t('fields.endDate')}><Input type="date" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} /></Field>
      </div>}
      {editor.kind === 'milestone' && <Field label={t('fields.dueDate')}><Input type="date" value={form.due_date || ''} onChange={e => setForm({ ...form, due_date: e.target.value })} /></Field>}
      {editor.kind === 'epic' && <Field label={t('fields.color')}><Input type="color" value={form.color || '#3b82f6'} onChange={e => setForm({ ...form, color: e.target.value })} /></Field>}
      {editor.item && <Field label={t('fields.status')}><Select value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })}>{statusOptions(editor.kind).map(status => <option key={status} value={status}>{t(`statuses.${status}`)}</option>)}</Select></Field>}
    </form>
  </Modal>
}

function DeletePhaseDialog({ phase, phases, onClose, onDelete, isLoading }: { phase: Phase | null; phases: Phase[]; onClose: () => void; onDelete: (strategy: 'cascade' | 'reassign' | 'unlink', target?: number) => void; isLoading: boolean }) {
  const t = useTranslations('wbs')
  const impact = usePhaseImpact(phase?.id ?? null)
  const [strategy, setStrategy] = useState<'cascade' | 'reassign' | 'unlink'>('unlink')
  const [target, setTarget] = useState('')
  const [confirmation, setConfirmation] = useState('')
  useEffect(() => { setStrategy('unlink'); setTarget(''); setConfirmation('') }, [phase])
  if (!phase) return null
  const canSubmit = strategy !== 'reassign' ? strategy !== 'cascade' || confirmation === phase.name : Boolean(target)
  return <Modal open onClose={onClose} title={t('deleteConfirm', { name: phase.name })} description={t('impact.description')}
    footer={impact.data && <div className="flex justify-end gap-2">
      <Button variant="outline" fullWidth={false} onClick={onClose}>{t('cancel')}</Button>
      <Button variant="destructive" fullWidth={false} disabled={!canSubmit || impact.isLoading || impact.isError} isLoading={isLoading} onClick={() => onDelete(strategy, target ? Number(target) : undefined)}>{t('deletePhase')}</Button>
    </div>}>
    {impact.isLoading ? <SkeletonRegion label={t('impact.loading')} className="grid grid-cols-2 gap-2 sm:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}</SkeletonRegion>
      : impact.isError ? <ErrorState message={t('impact.error')} retryLabel={t('retry')} onRetry={() => void impact.refetch()} />
      : impact.data && <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2 text-body-sm sm:grid-cols-3">{Object.entries({ sprints: impact.data.sprint_count, tasks: impact.data.task_count, subtasks: impact.data.subtask_count, externalLinks: impact.data.external_dependency_count, assignments: impact.data.assignment_count, worklogs: impact.data.worklog_count }).map(([label, value]) => <div key={label} className="rounded-lg border bg-muted/40 p-3"><strong className="text-h4 tabular-nums">{value}</strong><p className="text-caption text-muted-foreground">{t(`impact.${label}`)}</p></div>)}</div>
        <Field label={t('impact.strategy')}><Select value={strategy} onChange={e => setStrategy(e.target.value as typeof strategy)}>
          <option value="unlink">{t('impact.unlink')}</option>
          <option value="reassign">{t('impact.reassign')}</option>
          <option value="cascade">{t('impact.cascade')}</option>
        </Select></Field>
        {strategy === 'reassign' && <Field label={t('impact.targetPhase')}><Select required value={target} onChange={e => setTarget(e.target.value)}><option value="">{t('impact.selectPhase')}</option>{phases.filter(item => item.id !== phase.id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>}
        {strategy === 'cascade' && <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <Field label={t('impact.confirmCascade', { name: phase.name })}><Input value={confirmation} onChange={e => setConfirmation(e.target.value)} /></Field>
        </div>}
      </div>}
  </Modal>
}

const TEXTAREA_CLASS = 'min-h-24 w-full rounded-lg border border-input bg-card p-3 text-body shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-body-sm'

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-2 text-body-sm font-medium"><span>{label}</span>{children}</label> }
function Empty({ label }: { label: string }) { return <p className="rounded-lg border border-dashed bg-card/60 p-4 text-center text-body-sm text-muted-foreground">{label}</p> }
/** Tiêu đề khối (H3) kèm biểu tượng nhấn màu primary. */
function BlockTitle({ id, icon, children }: { id: string; icon?: React.ReactNode; children: React.ReactNode }) { return <h3 id={id} className="flex items-center gap-2 text-h4">{icon && <span className="text-primary">{icon}</span>}{children}</h3> }
/** Ánh xạ trạng thái WBS sang tông Badge ngữ nghĩa (không hard-code màu). */
function statusTone(status: string): BadgeTone {
  if (['COMPLETED', 'DONE', 'CLOSED'].includes(status)) return 'success'
  if (['IN_PROGRESS', 'ACTIVE', 'OPEN'].includes(status)) return 'primary'
  if (['AT_RISK', 'ON_HOLD'].includes(status)) return 'warning'
  if (['MISSED', 'CANCELLED'].includes(status)) return 'danger'
  return 'neutral'
}
function IconButton({ label, children, onClick, destructive = false }: { label: string; children: React.ReactNode; onClick: () => void; destructive?: boolean }) { return <button type="button" title={label} aria-label={label} onClick={event => { event.preventDefault(); event.stopPropagation(); onClick() }} className={cn('inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', destructive ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:text-foreground')}>{children}</button> }
/** Khung xương trang WBS: tiêu đề, 2 phase, 2 card epic/milestone. */
function WBSSkeleton() {
  const t = useTranslations('wbs')
  return <SkeletonRegion label={t('loading')} className="space-y-4">
    <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div>
    <div className="space-y-4">{[0, 1].map(i => <div key={i} className="rounded-xl border border-border/80 bg-card p-4 shadow-soft"><Skeleton className="h-5 w-1/3" /><SkeletonText lines={1} className="mt-3 w-1/2" /></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>
  </SkeletonRegion>
}
function statusOptions(kind: Editor['kind']) { return kind === 'phase' ? ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] : kind === 'sprint' ? ['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] : kind === 'epic' ? ['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED'] : ['PENDING', 'AT_RISK', 'COMPLETED', 'MISSED'] }
