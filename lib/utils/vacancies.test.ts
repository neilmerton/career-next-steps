import { describe, it, expect } from 'vitest'
import type { VacancyStatus, VacancySource } from '@/types/database'
import {
  STATUS_LABELS,
  SOURCE_LABELS,
  STATUS_ORDER,
  ALL_STATUSES,
  ALL_SOURCES,
} from './vacancies'

const ALL_STATUS_VALUES: VacancyStatus[] = [
  'applied', 'interviewing', 'offered', 'accepted', 'rejected', 'withdrawn',
]

const ALL_SOURCE_VALUES: VacancySource[] = [
  'linkedin', 'indeed', 'referral', 'company_website', 'recruiter', 'other',
]

describe('STATUS_LABELS', () => {
  it('has a label for every VacancyStatus', () => {
    for (const status of ALL_STATUS_VALUES) {
      expect(STATUS_LABELS).toHaveProperty(status)
      expect(typeof STATUS_LABELS[status]).toBe('string')
      expect(STATUS_LABELS[status].length).toBeGreaterThan(0)
    }
  })

  it('has no extra keys beyond the known statuses', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(ALL_STATUS_VALUES.length)
  })
})

describe('SOURCE_LABELS', () => {
  it('has a label for every VacancySource', () => {
    for (const source of ALL_SOURCE_VALUES) {
      expect(SOURCE_LABELS).toHaveProperty(source)
      expect(typeof SOURCE_LABELS[source]).toBe('string')
      expect(SOURCE_LABELS[source].length).toBeGreaterThan(0)
    }
  })

  it('has no extra keys beyond the known sources', () => {
    expect(Object.keys(SOURCE_LABELS)).toHaveLength(ALL_SOURCE_VALUES.length)
  })
})

describe('STATUS_ORDER', () => {
  it('contains every VacancyStatus exactly once', () => {
    expect(STATUS_ORDER).toHaveLength(ALL_STATUS_VALUES.length)
    for (const status of ALL_STATUS_VALUES) {
      expect(STATUS_ORDER).toContain(status)
    }
  })

  it('places active statuses before terminal ones', () => {
    const active = ['applied', 'interviewing', 'offered']
    const terminal = ['accepted', 'rejected', 'withdrawn']
    const lastActiveIndex = Math.max(...active.map(s => STATUS_ORDER.indexOf(s as VacancyStatus)))
    const firstTerminalIndex = Math.min(...terminal.map(s => STATUS_ORDER.indexOf(s as VacancyStatus)))
    expect(lastActiveIndex).toBeLessThan(firstTerminalIndex)
  })
})

describe('ALL_STATUSES', () => {
  it('contains every VacancyStatus exactly once', () => {
    expect(ALL_STATUSES).toHaveLength(ALL_STATUS_VALUES.length)
    for (const status of ALL_STATUS_VALUES) {
      expect(ALL_STATUSES).toContain(status)
    }
  })
})

describe('ALL_SOURCES', () => {
  it('contains every VacancySource exactly once', () => {
    expect(ALL_SOURCES).toHaveLength(ALL_SOURCE_VALUES.length)
    for (const source of ALL_SOURCE_VALUES) {
      expect(ALL_SOURCES).toContain(source)
    }
  })
})
