import { render as renderUI, screen, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'
import { useState } from 'react'

const render = (ui: React.ReactNode, options?: RenderOptions) => renderUI(ui, { wrapper: ({ children }) => <NextIntlClientProvider locale="en" messages={{ common: { close: 'Close' } }}>{children}</NextIntlClientProvider>, ...options })

/**
 * Modal trước đây không bẫy focus, không khôi phục focus, và dùng ID cứng
 * "modal-title" — nên hai modal mở cùng lúc (chuyện thường ở trang Tasks) tạo ra
 * ID trùng và screen reader đọc sai tiêu đề.
 */
describe('Modal', () => {
  it('portals the overlay to body outside a transformed ancestor', () => {
    const { container } = render(
      <div style={{ transform: 'translateY(20px)', filter: 'blur(0)' }}>
        <Modal open onClose={() => {}} title="Viewport dialog"><p>Content</p></Modal>
      </div>
    )
    const overlay = screen.getByRole('dialog').parentElement!
    expect(overlay.parentElement).toBe(document.body)
    expect(container).not.toContainElement(overlay)
  })

  it('keeps the footer outside the scrolling body and submits its linked form', async () => {
    const submit = vi.fn(event => event.preventDefault())
    render(
      <Modal open onClose={() => {}} title="Long form" footer={<button type="submit" form="modal-form">Save</button>}>
        <form id="modal-form" onSubmit={submit}><input aria-label="Name" /></form>
      </Modal>
    )
    const form = screen.getByRole('textbox').closest('form')!
    const save = screen.getByRole('button', { name: 'Save' })
    expect(form.parentElement).not.toContainElement(save)
    await userEvent.setup().click(save)
    expect(submit).toHaveBeenCalledOnce()
  })

  it('wraps Shift+Tab from the first control to the last control', async () => {
    render(<Modal open onClose={() => {}} title="Edit"><button type="button">Last</button></Modal>)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await userEvent.setup().tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
  })

  it('skips controls in hidden sections when wrapping focus', async () => {
    render(<Modal open onClose={() => {}} title="Edit">
      <button type="button">Last visible</button>
      <div style={{ display: 'none' }}><button type="button">Hidden</button></div>
      <fieldset disabled><button type="button">Disabled</button></fieldset>
    </Modal>)
    await userEvent.setup().tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Last visible' })).toHaveFocus()
  })

  it('closes only the top dialog and restores focus and scrolling after nested dialogs', async () => {
    const outerClose = vi.fn()
    const user = userEvent.setup()
    function NestedDialogs() {
      const [innerOpen, setInnerOpen] = useState(false)
      return <Modal open onClose={outerClose} title="Outer">
        <button type="button" onClick={() => setInnerOpen(true)}>Open inner</button>
        <Modal open={innerOpen} onClose={() => setInnerOpen(false)} title="Inner"><button type="button">Inner action</button></Modal>
      </Modal>
    }
    const previousOverflow = document.body.style.overflow
    const { unmount } = render(<NestedDialogs />)
    await user.click(screen.getByRole('button', { name: 'Open inner' }))
    await user.tab({ shift: true })
    expect(screen.getByRole('dialog', { name: 'Inner' })).toContainElement(document.activeElement as HTMLElement)
    await user.keyboard('{Escape}')
    expect(outerClose).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', { name: 'Inner' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open inner' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe(previousOverflow)
  })

  it('keeps input focus while a parent rerenders with an inline close callback', async () => {
    function Form() {
      const [value, setValue] = useState('')
      return <Modal open onClose={() => {}} title="Edit"><input aria-label="Name" value={value} onChange={e => setValue(e.target.value)} /></Modal>
    }
    render(<Form />)
    await userEvent.setup().type(screen.getByRole('textbox'), 'Project')
    expect(screen.getByRole('textbox')).toHaveValue('Project')
    expect(screen.getByRole('textbox')).toHaveFocus()
  })
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
