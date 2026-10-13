import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import { processMessagesEn } from '@/features/process/testMessages'
import type { ProcessModelGraph } from '@/features/process/types'
import { ProcessDiagram } from './ProcessDiagram'

const model: ProcessModelGraph = {
  name: 'Order',
  lanes: [{ id: 'l1', name: 'Sales' }],
  nodes: [
    { id: 's', type: 'start_event', name: 'Start', lane_id: 'l1' },
    { id: 'g', type: 'exclusive_gateway', name: 'Valid?', lane_id: 'l1' },
    { id: 't', type: 'task', name: 'Approve order', lane_id: 'l1' },
    { id: 'e', type: 'end_event', name: 'Done', lane_id: 'l1' },
  ],
  flows: [
    { id: 'f1', source: 's', target: 'g' },
    { id: 'f2', source: 'g', target: 't', label: 'Yes' },
    { id: 'f3', source: 't', target: 'e' },
  ],
}

function setup() {
  return render(
    <NextIntlClientProvider locale="en" messages={processMessagesEn}>
      <ProcessDiagram model={model} steps={[{ order: 1, node_id: 't', lane: 'Sales', step: 'Approve order', type: 'task', type_label: 'Task', next: 'Done' }]} />
    </NextIntlClientProvider>,
  )
}

describe('ProcessDiagram', () => {
  it('vẽ SVG có nhãn truy cập, title cho từng node và nhãn cạnh', () => {
    const { container } = setup()
    expect(screen.getByRole('img', { name: /Process diagram Order: 1 lanes, 4 elements/ })).toBeInTheDocument()
    const titles = [...container.querySelectorAll('g[data-node-id] > title')].map(n => n.textContent)
    expect(titles).toEqual(['Start event: Start', 'Exclusive gateway (X): Valid?', 'Task: Approve order', 'End event: Done'])
    expect(container.querySelector('[data-node-type="task"] rect')).not.toBeNull()
    expect(container.querySelector('[data-node-type="exclusive_gateway"] polygon')).not.toBeNull()
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('có danh sách bước dạng văn bản', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Process steps' })).toBeInTheDocument()
    expect(screen.getByText('1. Approve order')).toBeInTheDocument()
    expect(screen.getByText('Next: Done')).toBeInTheDocument()
  })

  it('phóng to/thu nhỏ thay đổi kích thước SVG', async () => {
    setup()
    const svg = screen.getByRole('img')
    const width = Number(svg.getAttribute('width'))
    await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(Number(svg.getAttribute('width'))).toBeCloseTo(width * 1.25)
    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }))
    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(screen.getByText('Zoom 75%')).toBeInTheDocument()
  })
})
