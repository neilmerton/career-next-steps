import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import LatestUpdates from './LatestUpdates'
import type { DashboardData } from '@/lib/data/dashboard'
import type { UpdateWithRelations } from '@/types/database'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/lib/queries/dashboard', () => ({ useDashboardData: vi.fn() }))

import { useDashboardData } from '@/lib/queries/dashboard'
const mockUseDashboardData = vi.mocked(useDashboardData)

const vacancyUpdate: UpdateWithRelations = {
  id: 'u1', user_id: 'u1',
  job_vacancy_id: 'v1', contact_id: null,
  notes: 'Had a great interview',
  occurred_at: '2026-04-15T10:00:00.000Z',
  new_status: 'interviewing', new_next_contact_date: null,
  created_at: '2026-04-15T10:00:00.000Z',
  job_vacancy: { id: 'v1', title: 'Senior Engineer', company: 'Acme Ltd' },
  contact: null,
}

const contactUpdate: UpdateWithRelations = {
  id: 'u2', user_id: 'u1',
  job_vacancy_id: null, contact_id: 'c1',
  notes: 'Left a voicemail',
  occurred_at: '2026-04-15T11:00:00.000Z',
  new_status: null, new_next_contact_date: '2026-04-20',
  created_at: '2026-04-15T11:00:00.000Z',
  job_vacancy: null,
  contact: { id: 'c1', name: 'Jane Smith', company: 'Recruiter Co' },
}

const nextDayUpdate: UpdateWithRelations = {
  id: 'u3', user_id: 'u1',
  job_vacancy_id: 'v2', contact_id: null,
  notes: 'Submitted application',
  occurred_at: '2026-04-16T09:00:00.000Z',
  new_status: 'applied', new_next_contact_date: null,
  created_at: '2026-04-16T09:00:00.000Z',
  job_vacancy: { id: 'v2', title: 'Frontend Developer', company: null },
  contact: null,
}

const baseData: DashboardData = {
  statusCounts: {}, totalVacancies: 0,
  upcomingContacts: [], latestUpdates: [],
}

describe('LatestUpdates', () => {
  it('renders nothing while pending', () => {
    mockUseDashboardData.mockReturnValue({ data: undefined, isPending: true } as any)
    const { container } = render(<LatestUpdates />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when there are no updates', () => {
    mockUseDashboardData.mockReturnValue({ data: baseData, isPending: false } as any)
    render(<LatestUpdates />)
    expect(screen.getByText(/no updates yet/i)).toBeInTheDocument()
  })

  it('renders the notes for each update', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate, contactUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByText('Had a great interview')).toBeInTheDocument()
    expect(screen.getByText('Left a voicemail')).toBeInTheDocument()
  })

  it('renders the vacancy title and company for vacancy updates', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Ltd')).toBeInTheDocument()
  })

  it('links vacancy updates to the vacancy detail page', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByRole('link', { name: /senior engineer/i })).toHaveAttribute('href', '/vacancies/v1')
  })

  it('renders the contact name for contact updates', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [contactUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('links contact updates to the contact detail page', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [contactUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByRole('link', { name: /jane smith/i })).toHaveAttribute('href', '/contacts/c1')
  })

  it('renders the new status when present', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByText(/status.*interviewing/i)).toBeInTheDocument()
  })

  it('renders the new next contact date when present', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [contactUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    expect(screen.getByText(/next contact.*2026-04-20/i)).toBeInTheDocument()
  })

  it('groups updates by date with a heading per day', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate, contactUpdate, nextDayUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    // vacancyUpdate and contactUpdate are on 2026-04-15, nextDayUpdate is on 2026-04-16
    expect(screen.getByText('15 Apr 2026')).toBeInTheDocument()
    expect(screen.getByText('16 Apr 2026')).toBeInTheDocument()
  })

  it('places updates from the same day under the same group', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, latestUpdates: [vacancyUpdate, contactUpdate] },
      isPending: false,
    } as any)
    render(<LatestUpdates />)
    // Both on 2026-04-15 — only one group heading
    expect(screen.getAllByText('15 Apr 2026')).toHaveLength(1)
  })
})
