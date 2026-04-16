import { render, screen } from '@testing-library/react'
import Timeline from './Timeline'

const items = [
  { id: '1', occurred_at: '2026-04-01T10:00:00.000Z', notes: 'First note', meta: 'Applied' },
  { id: '2', occurred_at: '2026-04-02T11:00:00.000Z', notes: 'Second note' },
]

describe('Timeline', () => {
  it('renders a list item for each entry', () => {
    render(<Timeline items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders the notes for each item', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('First note')).toBeInTheDocument()
    expect(screen.getByText('Second note')).toBeInTheDocument()
  })

  it('renders meta text when provided', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('does not render a meta element when meta is absent', () => {
    render(<Timeline items={[items[1]]} />)
    // Only one <p> — the notes one; no meta paragraph
    const paragraphs = screen.getAllByRole('paragraph')
    expect(paragraphs).toHaveLength(1)
  })

  it('renders a <time> element for each item', () => {
    render(<Timeline items={items} />)
    expect(screen.getAllByRole('time')).toHaveLength(2)
  })

  it('sets the dateTime attribute to the ISO string', () => {
    render(<Timeline items={[items[0]]} />)
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', '2026-04-01T10:00:00.000Z')
  })

  it('renders an empty list when given no items', () => {
    render(<Timeline items={[]} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
