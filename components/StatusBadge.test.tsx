import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

const cases = [
  ['applied', 'Applied'],
  ['interviewing', 'Interviewing'],
  ['offered', 'Offered'],
  ['accepted', 'Accepted'],
  ['rejected', 'Rejected'],
  ['withdrawn', 'Withdrawn'],
] as const

describe('StatusBadge', () => {
  it.each(cases)('renders label "%s" for status "%s"', (status, label) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
