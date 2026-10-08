import { afterEach, describe, expect, it, vi } from 'vitest'
import { jobPollingInterval, isTerminalJob } from './jobPolling'

afterEach(() => vi.restoreAllMocks())

describe('job polling policy', () => {
  it('continues polling while queued or running and stops each terminal result', () => {
    for (const status of ['PENDING', 'PROCESSING', 'queued', 'running']) {
      expect(jobPollingInterval({ data: { status } })).toBe(5000)
    }
    for (const status of ['COMPLETED', 'FAILED', 'succeeded', 'failed']) {
      expect(isTerminalJob(status)).toBe(true)
      expect(jobPollingInterval({ data: { status } })).toBe(false)
    }
  })

  it('backs off status checks during cold start or temporary provider errors', () => {
    expect(jobPollingInterval({ error: new Error('Network timeout'), errorUpdateCount: 1 })).toBe(5000)
    expect(jobPollingInterval({ error: { response: { status: 503 } }, errorUpdateCount: 3 })).toBe(20000)
    expect(jobPollingInterval({ error: new Error('Network timeout'), errorUpdateCount: 20 })).toBe(30000)
    expect(jobPollingInterval({ data: { status: 'COMPLETED' }, error: { response: { status: 503 } }, errorUpdateCount: 1 })).toBe(5000)
  })

  it('stops polling when authorization or object access is lost', () => {
    for (const status of [401, 403, 404]) {
      expect(jobPollingInterval({ error: { response: { status } } })).toBe(false)
    }
  })
})
