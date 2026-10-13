'use client'
import { useTranslations } from 'next-intl'

import { useEffect, useState } from 'react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { CalendarDays, CheckCircle2, ChevronDown, Flag, Layers3, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { usePhaseImpact, useWBS, useWBSActions } from '@/features/wbs/hooks/useWBS'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatDate, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'
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
  const confirmDelete = (label: string, mutation: () => void) => setConfirming({ label, run: mutation })
  if (query.isLoading) return <WBSSkeleton />
  if (query.isError || !query.data) return <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
  const wbs = query.data
  const canManage = Boolean(projectQuery.data?.current_user_role === 'PM' || projectQuery.data?.capabilities.can_update)
  return <div className="space-y-8">
    <SectionHeader
      title={t('title')}
      description={t('subtitle')}
      className="mb-0 flex-col sm:flex-row sm:items-end"
      action={canManage && <div className="flex flex-wrap gap-2">
        <Button variant="outline" fullWidth={false} onClick={() => setEditor({ kind: 'epic' })}><Plus className="h-4 w-4" aria-hidden="true" />Epic</Button>
        <Button variant="outline" fullWidth={false} onClick={() => setEditor({ kind: 'milestone' })}><Plus className="h-4 w-4" aria-hidden="true" />Milestone</Button>
        <Button fullWidth={false} onClick={() => setEditor({ kind: 'phase' })}><Plus className="h-4 w-4" aria-hidden="true" />Phase</Button>
      </div>}
    />

    {/* ===== Giai đoạn (phase) và các sprint con ===== */}
    <section className="space-y-4" aria-labelledby="wbs-phases">
      <BlockTitle id="wbs-phases" icon={<Layers3 className="h-5 w-5" aria-hidden="true" />}>{t('phases')}</BlockTitle>
      {wbs.phases.length === 0 && <Empty label={t('noPhases')} />}
      {wbs.phases.map(phase => <details key={phase.id} open className="group overflow-hidden rounded-xl border border-border/80 bg-card shadow-soft">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground -rotate-90 transition-transform duration-200 group-open:rotate-0" aria-hidden="true" />
              <strong className="text-body font-semibold">{phase.name}</strong>
              <Badge tone={statusTone(phase.status)} size="sm" dot>{formatStatus(phase.status)}</Badge>
            </div>
            <p className="mt-1 pl-6 text-caption tabular-nums text-muted-foreground">{formatDate(phase.start_date)} – {formatDate(phase.end_date)} · {t('taskCount', { count: phase.task_count })}</p>
          </div>
          {canManage && <span className="flex gap-1">
            <IconButton label="Edit phase" onClick={() => setEditor({ kind: 'phase', item: phase })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label="Add sprint" onClick={() => setEditor({ kind: 'sprint', phaseId: phase.id })}><Plus className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label="Delete phase" onClick={() => setDeleting(phase)} destructive><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
          </span>}
        </summary>
        <div className="grid gap-3 border-t bg-muted/40 p-4 lg:grid-cols-2">
          {phase.sprints.map(sprint => <Card key={sprint.id} className="p-4 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><strong className="text-body-sm font-semibold">{sprint.name}</strong><Badge tone={statusTone(sprint.status)} size="sm">{formatStatus(sprint.status)}</Badge></div>
                <p className="mt-1 text-caption tabular-nums text-muted-foreground">{t('taskCount', { count: sprint.task_count })} · {sprint.story_points_completed}/{sprint.story_points_committed} pts</p>
              </div>
              {canManage && <div className="flex">
                <IconButton label="Edit sprint" onClick={() => setEditor({ kind: 'sprint', phaseId: phase.id, item: sprint })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
                <IconButton label="Delete sprint" destructive onClick={() => confirmDelete(sprint.name, () => actions.deleteSprint.mutate(sprint.id))}><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
              </div>}
            </div>
            {canManage && (sprint.status === 'PLANNED' || sprint.status === 'ACTIVE') && <div className="mt-3 flex gap-2">
              {sprint.status === 'PLANNED' && <Button variant="outline" size="sm" fullWidth={false} onClick={() => actions.startSprint.mutate(sprint.id)}>{t('start')}</Button>}
              {sprint.status === 'ACTIVE' && <Button variant="outline" size="sm" fullWidth={false} onClick={() => actions.completeSprint.mutate(sprint.id)}>{t('complete')}</Button>}
            </div>}
          </Card>)}
          {phase.sprints.length === 0 && <Empty label={t('noSprints')} />}
        </div>
      </details>)}
    </section>

    {wbs.unphased_sprints.length > 0 && <section className="space-y-4" aria-labelledby="wbs-unphased">
      <BlockTitle id="wbs-unphased">{t('unphasedSprints')}</BlockTitle>
      <div className="grid gap-3 md:grid-cols-2">{wbs.unphased_sprints.map(sprint => <Card key={sprint.id} className="p-4 sm:p-4"><strong className="text-body-sm font-semibold">{sprint.name}</strong><p className="mt-1 text-caption tabular-nums text-muted-foreground">{t('taskCount', { count: sprint.task_count })}</p></Card>)}</div>
    </section>}

    {/* ===== Epic và mốc (milestone) dạng danh sách trong card ===== */}
    <div className="grid gap-6 xl:grid-cols-2">
      <Card flush as="section" className="overflow-hidden" aria-labelledby="wbs-epics">
        <div className="border-b px-4 py-3"><BlockTitle id="wbs-epics" icon={<Flag className="h-5 w-5" aria-hidden="true" />}>{t('epics')}</BlockTitle></div>
        {wbs.epics.length === 0 ? <div className="p-4"><Empty label={t('noEpics')} /></div> : <ul className="divide-y">{wbs.epics.map(epic => <li key={epic.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
          <div className="flex min-w-0 items-center gap-3">
            {/* Màu epic do người dùng chọn nên giữ dạng style; mặc định dùng token muted-foreground. */}
            <span className="h-3 w-3 shrink-0 rounded-full bg-muted-foreground" style={epic.color ? { background: epic.color } : undefined} aria-hidden="true" />
            <div className="min-w-0"><strong className="block truncate text-body-sm font-medium">{epic.name}</strong><Badge tone={statusTone(epic.status)} size="sm" className="mt-1">{formatStatus(epic.status)}</Badge></div>
          </div>
          {canManage && <div className="flex shrink-0">
            <IconButton label="Edit epic" onClick={() => setEditor({ kind: 'epic', item: epic })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label="Delete epic" destructive onClick={() => confirmDelete(epic.name, () => actions.deleteEpic.mutate(epic.id))}><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
          </div>}
        </li>)}</ul>}
      </Card>
      <Card flush as="section" className="overflow-hidden" aria-labelledby="wbs-milestones">
        <div className="border-b px-4 py-3"><BlockTitle id="wbs-milestones" icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}>{t('milestones')}</BlockTitle></div>
        {wbs.milestones.length === 0 ? <div className="p-4"><Empty label={t('noMilestones')} /></div> : <ul className="divide-y">{wbs.milestones.map(milestone => <li key={milestone.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
          <div className="min-w-0">
            <strong className="block truncate text-body-sm font-medium">{milestone.name}</strong>
            <div className="mt-1 flex flex-wrap items-center gap-2"><span className="text-caption tabular-nums text-muted-foreground">{formatDate(milestone.due_date)}</span><Badge tone={statusTone(milestone.status)} size="sm" dot>{formatStatus(milestone.status)}</Badge></div>
          </div>
          {canManage && <div className="flex shrink-0">
            {milestone.status !== 'COMPLETED' && <IconButton label="Complete milestone" onClick={() => actions.completeMilestone.mutate(milestone.id)}><CheckCircle2 className="h-4 w-4" aria-hidden="true" /></IconButton>}
            <IconButton label="Edit milestone" onClick={() => setEditor({ kind: 'milestone', item: milestone })}><Pencil className="h-4 w-4" aria-hidden="true" /></IconButton>
            <IconButton label="Delete milestone" destructive onClick={() => confirmDelete(milestone.name, () => actions.deleteMilestone.mutate(milestone.id))}><Trash2 className="h-4 w-4" aria-hidden="true" /></IconButton>
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
  return <Modal open onClose={onClose} title={`${editor.item ? 'Edit' : 'New'} ${editor.kind}`}><form className="space-y-4" onSubmit={submit}><Field label="Name"><Input required minLength={3} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>{editor.kind === 'sprint' ? <Field label="Goal"><textarea className={TEXTAREA_CLASS} value={form.goal || ''} onChange={e => setForm({ ...form, goal: e.target.value })} /></Field> : <Field label="Description"><textarea className={TEXTAREA_CLASS} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>}{(editor.kind === 'phase' || editor.kind === 'sprint') && <div className="grid gap-4 sm:grid-cols-2"><Field label="Start date"><Input type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} /></Field><Field label="End date"><Input type="date" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} /></Field></div>}{editor.kind === 'milestone' && <Field label="Due date"><Input type="date" value={form.due_date || ''} onChange={e => setForm({ ...form, due_date: e.target.value })} /></Field>}{editor.kind === 'epic' && <Field label="Color"><Input type="color" value={form.color || '#3b82f6'} onChange={e => setForm({ ...form, color: e.target.value })} /></Field>}{editor.item && <Field label="Status"><Select value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })}>{statusOptions(editor.kind).map(status => <option key={status}>{status}</option>)}</Select></Field>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" fullWidth={false} onClick={onClose}>Cancel</Button><Button type="submit" fullWidth={false} isLoading={pending}>Save</Button></div></form></Modal>
}

function DeletePhaseDialog({ phase, phases, onClose, onDelete, isLoading }: { phase: Phase | null; phases: Phase[]; onClose: () => void; onDelete: (strategy: 'cascade' | 'reassign' | 'unlink', target?: number) => void; isLoading: boolean }) {
  const impact = usePhaseImpact(phase?.id ?? null)
  const [strategy, setStrategy] = useState<'cascade' | 'reassign' | 'unlink'>('unlink')
  const [target, setTarget] = useState('')
  const [confirmation, setConfirmation] = useState('')
  useEffect(() => { setStrategy('unlink'); setTarget(''); setConfirmation('') }, [phase])
  if (!phase) return null
  const canSubmit = strategy !== 'reassign' ? strategy !== 'cascade' || confirmation === phase.name : Boolean(target)
  return <Modal open onClose={onClose} title={`Delete ${phase.name}`} description="Review the live impact before choosing how child work should be handled.">{impact.isLoading ? <SkeletonRegion label="Calculating impact…" className="grid grid-cols-2 gap-2 sm:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}</SkeletonRegion> : impact.data && <div className="space-y-6"><div className="grid grid-cols-2 gap-2 text-body-sm sm:grid-cols-3">{Object.entries({ Sprints: impact.data.sprint_count, Tasks: impact.data.task_count, Subtasks: impact.data.subtask_count, 'External links': impact.data.external_dependency_count, Assignments: impact.data.assignment_count, Worklogs: impact.data.worklog_count }).map(([label, value]) => <div key={label} className="rounded-lg border bg-muted/40 p-3"><strong className="text-h4 tabular-nums">{value}</strong><p className="text-caption text-muted-foreground">{label}</p></div>)}</div><Field label="Strategy"><Select value={strategy} onChange={e => setStrategy(e.target.value as typeof strategy)}><option value="unlink">Keep children and unlink</option><option value="reassign">Move to another phase</option><option value="cascade">Delete the entire tree</option></Select></Field>{strategy === 'reassign' && <Field label="Target phase"><Select required value={target} onChange={e => setTarget(e.target.value)}><option value="">Select phase…</option>{phases.filter(item => item.id !== phase.id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>}{strategy === 'cascade' && <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4"><p className="text-body-sm">Type <strong>{phase.name}</strong> to confirm permanent cascade deletion.</p><Input className="mt-3" value={confirmation} onChange={e => setConfirmation(e.target.value)} /></div>}<div className="flex justify-end gap-2"><Button variant="outline" fullWidth={false} onClick={onClose}>Cancel</Button><Button variant="destructive" fullWidth={false} disabled={!canSubmit} isLoading={isLoading} onClick={() => onDelete(strategy, target ? Number(target) : undefined)}>Delete phase</Button></div></div>}</Modal>
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
function IconButton({ label, children, onClick, destructive = false }: { label: string; children: React.ReactNode; onClick: () => void; destructive?: boolean }) { return <button type="button" title={label} aria-label={label} onClick={event => { event.preventDefault(); event.stopPropagation(); onClick() }} className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', destructive ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:text-foreground')}>{children}</button> }
/** Khung xương trang WBS: tiêu đề, 2 phase, 2 card epic/milestone. */
function WBSSkeleton() {
  return <SkeletonRegion label="Loading work breakdown…" className="space-y-8">
    <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div>
    <div className="space-y-4">{[0, 1].map(i => <div key={i} className="rounded-xl border border-border/80 bg-card p-4 shadow-soft"><Skeleton className="h-5 w-1/3" /><SkeletonText lines={1} className="mt-3 w-1/2" /></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>
  </SkeletonRegion>
}
function statusOptions(kind: Editor['kind']) { return kind === 'phase' ? ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] : kind === 'sprint' ? ['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] : kind === 'epic' ? ['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED'] : ['PENDING', 'AT_RISK', 'COMPLETED', 'MISSED'] }
