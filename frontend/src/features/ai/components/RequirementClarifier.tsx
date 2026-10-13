'use client'

import { CheckCircle2, HelpCircle, Lightbulb, MinusCircle, Pencil, Send, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { Badge } from '@/components/ui/Badge'
import { Skeleton, SkeletonRegion, SkeletonText } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { projectKeys } from '@/features/projects/hooks/useProjects'
import { useAIJob } from '@/features/ai/hooks/useAIGenerator'
import {
  isTurnFailed,
  isTurnRunning,
  loadActiveBriefId,
  loadGenerationJobId,
  saveActiveBriefId,
  saveGenerationJobId,
  useBriefActions,
  useRecentBriefs,
  useRequirementBrief,
} from '@/features/ai/hooks/useRequirementBrief'
import {
  BRIEF_ITEM_KEYS,
  type BriefItem,
  type BriefItemKey,
  type RequirementBriefDetail,
} from '@/features/ai/types/requirementBrief.types'

const KNOWN_ERRORS = [
  'ai_quota_exceeded',
  'clarify_turn_pending',
  'no_open_question',
  'brief_not_clarifying',
  'clarify_turn_limit',
  'brief_items_missing',
  'brief_not_found',
  'brief_not_ready',
  'brief_generation_pending',
] as const

/** Lấy mã lỗi backend (detail dạng chuỗi) từ lỗi Axios. */
function errorCode(error: unknown): string | null {
  const detail = (error as { response?: { data?: { detail?: unknown } } } | null)?.response?.data?.detail
  return typeof detail === 'string' ? detail : null
}

function httpStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } } | null)?.response?.status
}

function ErrorNotice({ error }: { error: unknown }) {
  const t = useTranslations('clarifier')
  if (!error) return null
  const code = errorCode(error)
  const known = KNOWN_ERRORS.find((c) => c === code)
  return <Alert>{known ? t(`errors.${known}`) : t('errors.generic')}</Alert>
}

// Ô nhập nhiều dòng cùng kiểu với Input (bo 8px, viền input, focus ring).
const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

// Bong bóng hội thoại: AI bên trái nền muted, người dùng bên phải nền accent.
const AI_BUBBLE = 'max-w-[90%] break-words rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-body-sm text-foreground'
const USER_BUBBLE = 'ml-auto max-w-[90%] break-words rounded-xl rounded-tr-sm bg-accent px-3 py-2 text-body-sm text-accent-foreground'

const STATUS_ICON = {
  clear: CheckCircle2,
  missing: HelpCircle,
  assumed: Lightbulb,
  skipped: MinusCircle,
} as const

interface ItemRowProps {
  briefId: number
  itemKey: BriefItemKey
  item: BriefItem
  editable: boolean
}

function ItemRow({ briefId, itemKey, item, editable }: ItemRowProps) {
  const t = useTranslations('clarifier')
  const actions = useBriefActions()
  const fieldId = useId()
  // mode: 'edit' sửa trực tiếp mục, 'assume' sửa nội dung giả định rồi chấp nhận
  const [mode, setMode] = useState<'view' | 'edit' | 'assume'>('view')
  const [draft, setDraft] = useState('')
  const Icon = STATUS_ICON[item.status]
  const isAssumption = item.status === 'assumed'
  const userConfirmed = item.status === 'clear'
  const proposal = item.status === 'missing' ? item.proposed_assumption : null
  const busy = actions.accept.isPending || actions.reject.isPending || actions.patch.isPending

  const save = async () => {
    try {
      if (mode === 'assume') await actions.accept.mutateAsync({ id: briefId, key: itemKey, value: draft.trim() })
      else await actions.patch.mutateAsync({ id: briefId, key: itemKey, update: { status: 'clear', value: draft.trim() } })
      setMode('view')
    } catch {
      // Lỗi hiển thị qua ErrorNotice bên dưới.
    }
  }

  return (
    <li
      data-testid={`item-${itemKey}`}
      data-status={item.status}
      className={cn(
        'min-w-0 rounded-lg p-3 text-body-sm',
        isAssumption ? 'border-2 border-dashed border-warning/60 bg-warning-soft' : 'border bg-card',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Icon className={cn('h-4 w-4 shrink-0', userConfirmed ? 'text-success' : isAssumption ? 'text-warning' : 'text-muted-foreground')} aria-hidden="true" />
        <span className="font-medium text-foreground">{t(`items.${itemKey}`)}</span>
        {/* Nhãn trạng thái: giả định viền đứt, xác nhận màu success, còn lại trung tính. */}
        <Badge
          size="sm"
          tone={isAssumption ? 'warning' : userConfirmed ? 'success' : 'neutral'}
          className={cn('uppercase', isAssumption && 'border-dashed')}
        >
          {isAssumption
            ? item.source === 'ai_assumption_confirmed' ? t('status.assumedAccepted') : t('status.assumed')
            : t(`status.${item.status}`)}
        </Badge>
        {editable && mode === 'view' && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            fullWidth={false}
            className="-my-2 ml-auto"
            aria-label={t('editItem', { item: t(`items.${itemKey}`) })}
            onClick={() => { setDraft(item.value ?? ''); setMode('edit') }}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      {item.value && mode === 'view' && (
        <p className={cn('mt-2 break-words text-foreground', isAssumption && 'italic')}>
          {isAssumption && <span className="sr-only">{t('status.assumed')}: </span>}
          {item.value}
        </p>
      )}
      {proposal && mode === 'view' && editable && (
        <div className="mt-3 rounded-lg border border-dashed border-warning/60 bg-warning-soft p-3">
          <p className="flex items-center gap-1.5 text-overline uppercase text-warning">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            {t('proposal')}
          </p>
          <p className="mt-1 break-words italic text-foreground">{proposal}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" fullWidth={false} disabled={busy}
              onClick={() => actions.accept.mutate({ id: briefId, key: itemKey })}>{t('accept')}</Button>
            <Button type="button" size="sm" variant="outline" fullWidth={false} disabled={busy}
              onClick={() => { setDraft(proposal); setMode('assume') }}>{t('editAccept')}</Button>
            <Button type="button" size="sm" variant="ghost" fullWidth={false} disabled={busy}
              onClick={() => actions.reject.mutate({ id: briefId, key: itemKey })}>{t('reject')}</Button>
          </div>
        </div>
      )}
      {mode !== 'view' && (
        <div className="mt-3 space-y-2">
          <Label htmlFor={fieldId}>{t('itemValue', { item: t(`items.${itemKey}`) })}</Label>
          <textarea
            id={fieldId}
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={TEXTAREA_CLASSES}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" fullWidth={false} disabled={!draft.trim()} isLoading={busy} onClick={() => void save()}>
              {mode === 'assume' ? t('accept') : t('save')}
            </Button>
            <Button type="button" size="sm" variant="outline" fullWidth={false} onClick={() => setMode('view')}>{t('cancel')}</Button>
          </div>
        </div>
      )}
      <ErrorNotice error={actions.accept.error ?? actions.reject.error ?? actions.patch.error} />
    </li>
  )
}

function Conversation({ brief }: { brief: RequirementBriefDetail }) {
  const t = useTranslations('clarifier')
  return (
    <ol className="space-y-3" aria-label={t('conversation')}>
      <li className={USER_BUBBLE}>
        <span className="sr-only">{t('you')}: </span>{brief.idea}
      </li>
      {brief.qa_history.map((turn, index) => (
        <li key={index} className="space-y-2">
          <p className={AI_BUBBLE}>
            <span className="font-semibold">{t('ai')}: </span>{turn.question}
          </p>
          {turn.answer && (
            <p className={USER_BUBBLE}>
              <span className="sr-only">{t('you')}: </span>{turn.answer}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

function BriefView({ brief, onGenerated }: { brief: RequirementBriefDetail; onGenerated: (jobId: string) => void }) {
  const t = useTranslations('clarifier')
  const actions = useBriefActions()
  const answerId = useId()
  const [answer, setAnswer] = useState('')
  const running = isTurnRunning(brief)
  const failed = isTurnFailed(brief)
  const clarifying = brief.status === 'clarifying'
  const counts = brief.item_counts
  // Câu hỏi đang mở là câu cuối chưa có trả lời.
  const lastTurn = brief.qa_history[brief.qa_history.length - 1]
  const canAnswer = clarifying && !running && !failed && Boolean(brief.open_question)

  const submitAnswer = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await actions.answer.mutateAsync({ id: brief.id, answer: answer.trim() })
      setAnswer('')
    } catch {
      // Lỗi hiển thị bên dưới.
    }
  }

  const generate = async (mode: 'skip' | 'finalize') => {
    try {
      const res = await actions.generate.mutateAsync({ id: brief.id, mode: brief.status === 'ready' ? 'ready' : mode })
      onGenerated(res.job_id)
    } catch {
      // Lỗi hiển thị bên dưới.
    }
  }

  return (
    <div className="min-w-0 space-y-4">
      <Conversation brief={brief} />
      {brief.open_question && lastTurn?.question !== brief.open_question && (
        <p className={AI_BUBBLE}>
          <span className="font-semibold">{t('ai')}: </span>{brief.open_question}
        </p>
      )}
      {running && (
        // Bong bóng AI dạng khung xương trong lúc chờ câu hỏi tiếp theo.
        <div role="status" className="max-w-[90%] space-y-2 rounded-xl rounded-tl-sm bg-muted px-3 py-2">
          <p className="text-body-sm text-muted-foreground">{t('analyzing')}</p>
          <SkeletonText lines={2} className="w-56 max-w-full" />
        </div>
      )}
      {failed && (
        <div className="space-y-2">
          <Alert>{t('turnFailed')}</Alert>
          <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" isLoading={actions.answer.isPending}
            onClick={() => actions.answer.mutate({ id: brief.id, answer: null })}>{t('retryTurn')}</Button>
        </div>
      )}
      {canAnswer && (
        <form onSubmit={submitAnswer} className="space-y-2">
          <Label htmlFor={answerId}>{t('answerLabel')}</Label>
          <textarea id={answerId} rows={2} required value={answer} onChange={(e) => setAnswer(e.target.value)}
            className={TEXTAREA_CLASSES} />
          <div className="flex justify-end">
            <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={actions.answer.isPending}>
              {!actions.answer.isPending && <Send className="h-4 w-4" aria-hidden="true" />}
              {t('send')}
            </Button>
          </div>
        </form>
      )}
      <ErrorNotice error={actions.answer.error} />
      {clarifying && (
        <p className="text-caption text-muted-foreground">{t('turnsRemaining', { count: brief.turns_remaining })}</p>
      )}

      <section aria-labelledby={`${answerId}-progress`} className="space-y-3 border-t pt-4">
        <div className="space-y-2">
          <h3 id={`${answerId}-progress`} className="text-h4 text-foreground">
            {t('progress', { resolved: counts.resolved, total: counts.total })}
          </h3>
          {/* Thanh tiến độ trang trí; số liệu đã có trong tiêu đề. */}
          <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out-soft"
              style={{ width: `${counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0}%` }}
            />
          </div>
          <p className="text-caption text-muted-foreground">{t('legend')}</p>
        </div>
        <ul className="space-y-2">
          {BRIEF_ITEM_KEYS.map((key) => (
            <ItemRow key={key} briefId={brief.id} itemKey={key} item={brief.items[key]} editable={brief.status !== 'consumed' && !running} />
          ))}
        </ul>
      </section>

      <ErrorNotice error={actions.generate.error} />
      {brief.status !== 'consumed' && (
        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          {clarifying && (
            <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" disabled={running}
              isLoading={actions.generate.isPending} onClick={() => void generate('skip')}>{t('skipAndGenerate')}</Button>
          )}
          {(brief.can_finalize || brief.status === 'ready') && (
            <Button type="button" fullWidth={false} className="w-full sm:w-auto" disabled={running}
              isLoading={actions.generate.isPending} onClick={() => void generate('finalize')}>
              {!actions.generate.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />} {t('createProject')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function IdeaForm({ onCreated, onResume }: { onCreated: (id: number) => void; onResume: (id: number) => void }) {
  const t = useTranslations('clarifier')
  const ideaId = useId()
  const [idea, setIdea] = useState('')
  const actions = useBriefActions()
  const recent = useRecentBriefs(true)
  const resumable = (recent.data ?? []).filter((b) => b.status === 'clarifying' || b.status === 'ready')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const res = await actions.create.mutateAsync(idea.trim())
      onCreated(res.brief.id)
    } catch {
      // Lỗi hiển thị bên dưới.
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-4">
        <ErrorNotice error={actions.create.error} />
        <div>
          <Label htmlFor={ideaId}>{t('ideaLabel')}</Label>
          <textarea id={ideaId} rows={4} required maxLength={4000} value={idea} onChange={(e) => setIdea(e.target.value)}
            placeholder={t('ideaPlaceholder')}
            className={TEXTAREA_CLASSES} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={actions.create.isPending}>
            {!actions.create.isPending && <Sparkles className="h-4 w-4" aria-hidden="true" />} {t('start')}
          </Button>
        </div>
      </form>
      {resumable.length > 0 && (
        <section className="space-y-3 border-t pt-4">
          <h3 className="text-h4 text-foreground">{t('resumeTitle')}</h3>
          <ul className="space-y-2">
            {resumable.map((b) => (
              <li key={b.id} className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border bg-card p-3 text-body-sm transition-colors hover:bg-muted/40">
                <span className="min-w-0 flex-1 truncate text-foreground">{b.idea}</span>
                <Badge size="sm" tone="neutral">
                  {t('progress', { resolved: b.item_counts.resolved, total: b.item_counts.total })}
                </Badge>
                <Button type="button" variant="outline" size="sm" fullWidth={false} onClick={() => onResume(b.id)}>{t('resume')}</Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function GenerationStatus({ jobId, onViewProject, onRestart }: {
  jobId: string
  onViewProject: (projectId: number) => void
  onRestart: () => void
}) {
  const t = useTranslations('clarifier')
  const queryClient = useQueryClient()
  const job = useAIJob(jobId)
  const status = job.data?.status

  useEffect(() => {
    if (status === 'COMPLETED') void queryClient.invalidateQueries({ queryKey: projectKeys.all })
  }, [status, queryClient])

  if (job.isError) {
    return (
      <div className="space-y-4">
        <ErrorNotice error={job.error} />
        <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={() => void job.refetch()} isLoading={job.isFetching}>
          {t('retryStatus')}
        </Button>
      </div>
    )
  }
  if (status === 'FAILED') {
    return (
      <div className="space-y-4">
        <Alert>{t('generationFailed')}</Alert>
        <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={onRestart}>{t('backToBrief')}</Button>
      </div>
    )
  }
  if (status === 'COMPLETED') {
    return (
      <div className="space-y-4">
        <Alert variant="success">{t('generated')}</Alert>
        {job.data?.project_id && (
          <div className="flex justify-end">
            <Button type="button" fullWidth={false} className="w-full sm:w-auto" onClick={() => onViewProject(job.data!.project_id!)}>{t('viewProject')}</Button>
          </div>
        )}
      </div>
    )
  }
  return (
    // Khung xương mô phỏng kế hoạch dự án đang được AI soạn (giai đoạn + công việc).
    <div role="status" className="space-y-4 py-2">
      <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        {t('generating')}
      </p>
      <div aria-hidden="true" className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <Skeleton className="h-4 w-1/3" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    </div>
  )
}

export interface RequirementClarifierProps {
  onViewProject: (projectId: number) => void
}

/** Luồng hỏi làm rõ: ý tưởng, hội thoại từng câu, bảng tiến độ mục, sinh dự án. */
export function RequirementClarifier({ onViewProject }: RequirementClarifierProps) {
  const t = useTranslations('clarifier')
  const [briefId, setBriefId] = useState<number | null>(null)
  const [genJobId, setGenJobId] = useState<string | null>(null)
  const brief = useRequirementBrief(briefId)

  // Khôi phục hồ sơ và job sinh dự án đã lưu sau khi tải lại trang (chỉ chạy phía client).
  useEffect(() => {
    setBriefId(loadActiveBriefId())
    setGenJobId(loadGenerationJobId())
  }, [])

  const selectBrief = (id: number | null) => {
    saveActiveBriefId(id)
    setBriefId(id)
  }
  const setGeneration = (id: string | null) => {
    saveGenerationJobId(id)
    setGenJobId(id)
  }
  const startOver = () => {
    selectBrief(null)
    setGeneration(null)
  }

  // Hồ sơ đã lưu không còn tồn tại (404) thì quay về màn nhập ý tưởng.
  const notFound = brief.isError && httpStatus(brief.error) === 404
  useEffect(() => {
    if (notFound) {
      saveActiveBriefId(null)
      setBriefId(null)
    }
  }, [notFound])

  if (genJobId) {
    return (
      <GenerationStatus
        jobId={genJobId}
        onViewProject={(projectId) => { startOver(); onViewProject(projectId) }}
        onRestart={() => setGeneration(null)}
      />
    )
  }
  if (briefId === null) return <IdeaForm onCreated={selectBrief} onResume={selectBrief} />
  if (brief.isError && !notFound) {
    return (
      <div className="space-y-4">
        <ErrorNotice error={brief.error} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" fullWidth={false} onClick={() => void brief.refetch()}>{t('retryStatus')}</Button>
          <Button type="button" variant="ghost" fullWidth={false} onClick={startOver}>{t('newIdea')}</Button>
        </div>
      </div>
    )
  }
  if (!brief.data) {
    // Khung xương hội thoại trong lúc tải hồ sơ đã lưu.
    return (
      <SkeletonRegion label={t('conversation')} className="space-y-3 py-2">
        <Skeleton className="ml-auto h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-14 w-3/4 rounded-xl" />
        <Skeleton className="ml-auto h-10 w-1/2 rounded-xl" />
      </SkeletonRegion>
    )
  }
  return (
    <div className="space-y-4">
      <BriefView brief={brief.data} onGenerated={setGeneration} />
      <div className="flex justify-start">
        <Button type="button" variant="ghost" fullWidth={false} onClick={startOver}>{t('newIdea')}</Button>
      </div>
    </div>
  )
}
