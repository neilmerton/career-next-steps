import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import UpcomingContacts from './UpcomingContacts'
import type { DashboardData } from '@/lib/data/dashboard'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/lib/queries/dashboard', () => ({ useDashboardData: vi.fn() }))

import { useDashboardData } from '@/lib/queries/dashboard'
const mockUseDashboardData = vi.mocked(useDashboardData)

const upcomingContacts: DashboardData['upcomingContacts'] = [
  { id: 'c1', name: 'Jane Smith', next_contact_date: '2099-12-01' },
  { id: 'c2', name: 'Bob Jones', next_contact_date: '2000-01-01' }, // overdue
]

const baseData: DashboardData = {
  statusCounts: {},
  totalVacancies: 0,
  upcomingContacts: [],
  latestUpdates: [],
  recentVacancies: [],
}

describe('UpcomingContacts', () => {
  it('renders nothing while pending', () => {
    mockUseDashboardData.mockReturnValue({ data: undefined, isPending: true } as any)
    const { container } = render(<UpcomingContacts />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when there are no upcoming contacts', () => {
    mockUseDashboardData.mockReturnValue({ data: baseData, isPending: false } as any)
    render(<UpcomingContacts />)
    expect(screen.getByText(/no contacts due in the next 3 days/i)).toBeInTheDocument()
  })

  it('renders a list item for each upcoming contact', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, upcomingContacts },
      isPending: false,
    } as any)
    render(<UpcomingContacts />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders each contact name as a link', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, upcomingContacts },
      isPending: false,
    } as any)
    render(<UpcomingContacts />)
    expect(screen.getByRole('link', { name: 'Jane Smith' })).toHaveAttribute('href', '/contacts/c1')
    expect(screen.getByRole('link', { name: 'Bob Jones' })).toHaveAttribute('href', '/contacts/c2')
  })

  it('renders the formatted next contact date', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, upcomingContacts },
      isPending: false,
    } as any)
    render(<UpcomingContacts />)
    expect(screen.getByText(/1 Dec 2099/)).toBeInTheDocument()
    expect(screen.getByText(/1 Jan 2000/)).toBeInTheDocument()
  })

  it('does not render a date span for contacts without a next_contact_date', () => {
    const noDate: DashboardData['upcomingContacts'] = [
      { id: 'c3', name: 'No Date Contact', next_contact_date: null },
    ]
    mockUseDashboardData.mockReturnValue({
      data: { ...baseData, upcomingContacts: noDate },
      isPending: false,
    } as any)
    render(<UpcomingContacts />)
    expect(screen.queryByText(/\d+ \w+ \d{4}/)).not.toBeInTheDocument()
  })
})
