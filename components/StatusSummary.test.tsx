import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import StatusSummary from './StatusSummary'
import type { DashboardData } from '@/lib/data/dashboard'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/lib/queries/dashboard', () => ({ useDashboardData: vi.fn() }))

import { useDashboardData } from '@/lib/queries/dashboard'
const mockUseDashboardData = vi.mocked(useDashboardData)

const dashboardData: DashboardData = {
  statusCounts: { applied: 3, interviewing: 1, offered: 0 },
  totalVacancies: 4,
  upcomingContacts: [],
  latestUpdates: [],
}

describe('StatusSummary', () => {
  it('renders nothing while pending', () => {
    mockUseDashboardData.mockReturnValue({ data: undefined, isPending: true } as any)
    const { container } = render(<StatusSummary />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when there are no vacancies', () => {
    mockUseDashboardData.mockReturnValue({
      data: { ...dashboardData, totalVacancies: 0, statusCounts: {} },
      isPending: false,
    } as any)
    render(<StatusSummary />)
    expect(screen.getByText(/no vacancies yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add one/i })).toHaveAttribute('href', '/vacancies/new')
  })

  it('renders a card for each status in display order', () => {
    mockUseDashboardData.mockReturnValue({ data: dashboardData, isPending: false } as any)
    render(<StatusSummary />)
    // STATUS_ORDER has 6 entries — all should render regardless of count
    expect(screen.getAllByRole('link').filter(l => l.getAttribute('href') === '/vacancies')).toHaveLength(6)
  })

  it('renders the correct count for each status', () => {
    mockUseDashboardData.mockReturnValue({ data: dashboardData, isPending: false } as any)
    render(<StatusSummary />)
    expect(screen.getByText('3')).toBeInTheDocument() // applied
    expect(screen.getByText('1')).toBeInTheDocument() // interviewing
  })

  it('renders 0 for statuses not present in statusCounts', () => {
    mockUseDashboardData.mockReturnValue({ data: dashboardData, isPending: false } as any)
    render(<StatusSummary />)
    // rejected, withdrawn, accepted are not in statusCounts — should show 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(3)
  })

  it('renders a status label for each card', () => {
    mockUseDashboardData.mockReturnValue({ data: dashboardData, isPending: false } as any)
    render(<StatusSummary />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Interviewing')).toBeInTheDocument()
    expect(screen.getByText('Offered')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })
})
