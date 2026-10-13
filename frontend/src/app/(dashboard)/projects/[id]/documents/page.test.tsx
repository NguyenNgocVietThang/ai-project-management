import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../../../messages/en.json'
import vi_ from '../../../../../../messages/vi.json'
import type { GeneratedDocument } from '@/features/documents/types'
import DocumentsPage from './page'

const mocks = vi.hoisted(() => ({
  useProjectDocuments: vi.fn(),
  useGenerateDocument: vi.fn(),
  useDownloadDocument: vi.fn(),
  saveActiveBriefId: vi.fn(),
}))

vi.mock('@/hooks/useNumericParam', () => ({ useNumericParam: () => 7 }))
vi.mock('@/features/documents/hooks/useDocuments', () => ({
  useProjectDocuments: mocks.useProjectDocuments,
  useGenerateDocument: mocks.useGenerateDocument,
  useDownloadDocument: mocks.useDownloadDocument,
}))
vi.mock('@/features/ai/hooks/useRequirementBrief', () => ({ saveActiveBriefId: mocks.saveActiveBriefId }))
// Modal hỏi làm rõ thật cần React Query/router; thay bằng bản giả hiển thị trạng thái mở.
vi.mock('@/features/ai/components/AIGeneratorModal', () => ({
  AIGeneratorModal: ({ open }: { open: boolean }) => (open ? <div role="dialog">clarifier</div> : null),
}))

function doc(id: number, over: Partial<GeneratedDocument> = {}): GeneratedDocument {
  return {
    id, project_id: 7, brief_id: 3, doc_type: 'SRS', language: 'vi', version: id, status: 'ready',
    progress: { completed_groups: 4, total_groups: 4 }, missing_items: [], warnings: [], error_code: null,
    file_size: 100, job_id: 50 + id, job_status: 'succeeded', created_by_id: 1,
    created_at: '2026-10-01T10:00:00Z', completed_at: null, ...over,
  }
}

function setup(list: GeneratedDocument[], { locale = 'en', generateError = undefined as unknown } = {}) {
  const generate = { mutate: vi.fn(), isPending: false, isError: Boolean(generateError), error: generateError, data: undefined, variables: undefined }
  const download = { mutate: vi.fn(), isPending: false, isError: false, variables: undefined }
  mocks.useProjectDocuments.mockReturnValue({ isLoading: false, isError: false, data: list, refetch: vi.fn() })
  mocks.useGenerateDocument.mockReturnValue(generate)
  mocks.useDownloadDocument.mockReturnValue(download)
  const messages = locale === 'en' ? en : vi_
  render(<NextIntlClientProvider locale={locale} messages={messages}><DocumentsPage /></NextIntlClientProvider>)
  return { generate, download }
}

beforeEach(() => vi.clearAllMocks())

describe('trang tài liệu', () => {
  it('sinh SRS/BRD theo ngôn ngữ đã chọn (mặc định vi)', async () => {
    const { generate } = setup([])
    expect(screen.getByText('No documents yet')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Generate SRS' }))
    expect(generate.mutate).toHaveBeenCalledWith({ doc_type: 'SRS', language: 'vi' })
    await userEvent.selectOptions(screen.getByLabelText('Document language'), 'en')
    await userEvent.click(screen.getByRole('button', { name: 'Generate BRD' }))
    expect(generate.mutate).toHaveBeenLastCalledWith({ doc_type: 'BRD', language: 'en' })
  })

  it('hiển thị trạng thái bằng chữ, tiến độ nhóm, cảnh báo và tải tài liệu sẵn sàng', async () => {
    const ready = doc(2, { warnings: ['Bỏ cột thừa'] })
    const { download } = setup([ready, doc(1, { status: 'generating', progress: { completed_groups: 1, total_groups: 4 } })])
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('Generating')).toBeInTheDocument()
    expect(screen.getByText('1 of 4 section groups written')).toBeInTheDocument()
    expect(screen.getByText('1 warning')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Download/ })).toHaveLength(1)
    await userEvent.click(screen.getByRole('button', { name: 'Download SRS v2' }))
    expect(download.mutate).toHaveBeenCalledWith(ready)
  })

  it('cần làm rõ: liệt kê mục thiếu đã dịch và mở luồng hỏi với đúng hồ sơ', async () => {
    setup([doc(1, { status: 'needs_clarification', brief_id: 9, missing_items: ['goals', 'success_criteria'] })], { locale: 'vi' })
    expect(screen.getByText('Cần làm rõ')).toBeInTheDocument()
    expect(screen.getByText(vi_.clarifier.items.goals)).toBeInTheDocument()
    expect(screen.getByText(vi_.clarifier.items.success_criteria)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục làm rõ yêu cầu' }))
    expect(mocks.saveActiveBriefId).toHaveBeenCalledWith(9)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('không có hồ sơ: hướng dẫn tạo hồ sơ, không có nút mở luồng hỏi', () => {
    setup([doc(1, { status: 'needs_clarification', brief_id: null, missing_items: ['no_brief'] })])
    expect(screen.getByText(/has no requirement brief/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue clarifying requirements' })).toBeNull()
  })

  it('lỗi đã biết từ API được dịch', () => {
    setup([], { generateError: { response: { status: 409, data: { detail: 'document_generation_pending' } } } })
    expect(screen.getByRole('alert')).toHaveTextContent('already being generated')
  })

  it('bản ghi thất bại hiển thị lý do', () => {
    setup([doc(1, { status: 'failed', error_code: 'job_failed' })])
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText(/reason: job_failed/)).toBeInTheDocument()
  })
})
