import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { processMessagesEn } from '@/features/process/testMessages'
import type { ProcessModelRecord } from '@/features/process/types'
import ProcessPage from './page'

const mocks = vi.hoisted(() => ({
  useProcessModel: vi.fn(),
  useGenerateProcess: vi.fn(),
  useProcessJob: vi.fn(),
  saveActiveBriefId: vi.fn(),
}))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '7' }), notFound: vi.fn() }))
vi.mock('@/features/process/hooks/useProcessModel', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/process/hooks/useProcessModel')>()),
  useProcessModel: mocks.useProcessModel,
  useGenerateProcess: mocks.useGenerateProcess,
  useProcessJob: mocks.useProcessJob,
}))
vi.mock('@/features/ai/hooks/useRequirementBrief', () => ({ saveActiveBriefId: mocks.saveActiveBriefId }))
vi.mock('@/features/ai/components/AIGeneratorModal', () => ({
  AIGeneratorModal: ({ open }: { open: boolean }) => (open ? <div>clarifier-open</div> : null),
}))

const record: ProcessModelRecord = {
  id: 1, project_id: 7, brief_id: 3, version: 2, language: 'en', created_by_id: 1, created_at: '2026-10-01T10:00:00Z',
  warnings: ['Gateway has one branch'],
  steps: [{ order: 1, node_id: 't', lane: 'Sales', step: 'Approve', type: 'task', type_label: 'Task', next: '' }],
  model: {
    name: 'Order flow',
    lanes: [{ id: 'l', name: 'Sales' }],
    nodes: [{ id: 's', type: 'start_event', name: 'Start', lane_id: 'l' }, { id: 't', type: 'task', name: 'Approve', lane_id: 'l' }],
    flows: [{ id: 'f', source: 's', target: 't' }],
  },
}

function setup({ data = record as ProcessModelRecord | undefined, error = null as unknown, generateData = undefined as unknown, mutate = vi.fn() } = {}) {
  mocks.useProcessModel.mockReturnValue({ isLoading: false, isError: Boolean(error), error, data, refetch: vi.fn() })
  mocks.useGenerateProcess.mockReturnValue({ mutate, isPending: false, isError: false, data: generateData })
  mocks.useProcessJob.mockReturnValue({ data: undefined })
  return render(<NextIntlClientProvider locale="en" messages={processMessagesEn}><ProcessPage /></NextIntlClientProvider>)
}

beforeEach(() => vi.clearAllMocks())

describe('trang quy trình', () => {
  it('hiển thị sơ đồ, cảnh báo và danh sách bước', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Order flow' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Process diagram Order flow/ })).toBeInTheDocument()
    expect(screen.getByText('1 warning')).toBeInTheDocument()
    expect(screen.getByText('1. Approve')).toBeInTheDocument()
  })

  it('404 hiển thị trạng thái trống và gửi yêu cầu sinh theo ngôn ngữ', async () => {
    const mutate = vi.fn()
    setup({ data: undefined, error: { response: { status: 404, data: { detail: 'process_model_not_found' } } }, mutate })
    expect(screen.getByText('No process yet')).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('Language'), 'en')
    await userEvent.click(screen.getByRole('button', { name: 'Generate process with AI' }))
    expect(mutate).toHaveBeenCalledWith({ language: 'en' })
  })

  it('lỗi khác 404 hiển thị trạng thái lỗi', () => {
    setup({ data: undefined, error: { response: { status: 500, data: {} } } })
    expect(screen.queryByText('No process yet')).not.toBeInTheDocument()
  })

  it('needs_clarification dẫn sang hỏi làm rõ', async () => {
    setup({ generateData: { status: 'needs_clarification', job_id: null, missing_items: ['goals'], skipped_items: [], brief_reopened: true } })
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('The brief was reopened for clarification.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open clarifying questions' }))
    expect(mocks.saveActiveBriefId).toHaveBeenCalledWith(3)
    expect(screen.getByText('clarifier-open')).toBeInTheDocument()
  })

  it('hiển thị trạng thái job đang chạy', () => {
    setup({ generateData: { status: 'queued', job_id: 42, missing_items: [], skipped_items: [], brief_reopened: false } })
    expect(screen.getByText('Job #42 is generating the process…')).toBeInTheDocument()
  })
})
