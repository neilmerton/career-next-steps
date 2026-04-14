import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, isOverdue, addDays } from './dates'

describe('formatDate', () => {
  it('formats a date string as "D Mon YYYY"', () => {
    expect(formatDate('2026-04-15')).toBe('15 Apr 2026')
  })

  it('formats single-digit days without padding', () => {
    expect(formatDate('2026-04-01')).toBe('1 Apr 2026')
  })

  it('formats January correctly', () => {
    expect(formatDate('2026-01-20')).toBe('20 Jan 2026')
  })

  it('formats December correctly', () => {
    expect(formatDate('2025-12-31')).toBe('31 Dec 2025')
  })

  it('treats the date as local (no UTC shift)', () => {
    // If Date() were constructed in UTC, '2026-04-01' could roll back to Mar 31
    // in timezones behind UTC. Parsing as local prevents this.
    expect(formatDate('2026-04-01')).toContain('Apr')
  })
})

describe('isOverdue', () => {
  beforeEach(() => {
    // Fix "today" to 2026-04-14
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 14)) // month is 0-indexed
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for a date in the past', () => {
    expect(isOverdue('2026-04-13')).toBe(true)
  })

  it('returns true for today', () => {
    expect(isOverdue('2026-04-14')).toBe(true)
  })

  it('returns false for a date in the future', () => {
    expect(isOverdue('2026-04-15')).toBe(false)
  })
})

describe('addDays', () => {
  it('adds days within the same month', () => {
    expect(addDays('2026-04-10', 5)).toBe('2026-04-15')
  })

  it('rolls over into the next month', () => {
    expect(addDays('2026-04-28', 5)).toBe('2026-05-03')
  })

  it('rolls over into the next year', () => {
    expect(addDays('2025-12-30', 5)).toBe('2026-01-04')
  })

  it('subtracts days when given a negative value', () => {
    expect(addDays('2026-04-10', -3)).toBe('2026-04-07')
  })

  it('returns the same date when adding zero days', () => {
    expect(addDays('2026-04-14', 0)).toBe('2026-04-14')
  })
})
