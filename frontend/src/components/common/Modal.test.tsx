import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

/**
 * Modal trước đây không bẫy focus, không khôi phục focus, và dùng ID cứng
 * "modal-title" — nên hai modal mở cùng lúc (chuyện thường ở trang Tasks) tạo ra
 * ID trùng và screen reader đọc sai tiêu đề.
 */
describe('Modal', () => {
  it('đưa focus vào bên trong khi mở', async () => {
    render(
      <Modal open onClose={() => {}} title="Edit task">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    )
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
  })

  it('giữ Tab bên trong dialog', async () => {
    const user = userEvent.setup()
    render(
      <Modal open onClose={() => {}} title="Edit task">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')

    for (let i = 0; i < 6; i += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('đóng khi nhấn Escape', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal open onClose={onClose} title="Edit task">
        <button type="button">First</button>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('trả focus về nơi nó xuất phát khi đóng', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const { rerender } = render(
      <Modal open onClose={() => {}} title="Edit task">
        <button type="button">First</button>
      </Modal>
    )
    rerender(
      <Modal open={false} onClose={() => {}} title="Edit task">
        <button type="button">First</button>
      </Modal>
    )

    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('cấp ID riêng cho mỗi dialog', () => {
    render(
      <>
        <Modal open onClose={() => {}} title="First dialog">
          <span>a</span>
        </Modal>
        <Modal open onClose={() => {}} title="Second dialog">
          <span>b</span>
        </Modal>
      </>
    )

    const labels = screen.getAllByRole('dialog').map((d) => d.getAttribute('aria-labelledby'))
    expect(new Set(labels).size).toBe(2)
  })

  it('nối phần mô tả vào dialog cho screen reader', () => {
    render(
      <Modal open onClose={() => {}} title="Delete phase" description="This cannot be undone.">
        <span>a</span>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    const describedBy = dialog.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('This cannot be undone.')
  })
})
