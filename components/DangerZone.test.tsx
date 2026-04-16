import { render, screen } from '@testing-library/react'
import DangerZone from './DangerZone'

describe('DangerZone', () => {
  it('renders the title', () => {
    render(<DangerZone title="Danger" description="Be careful" children={null} />)
    expect(screen.getByRole('heading', { name: 'Danger' })).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<DangerZone title="Danger" description="This is irreversible" children={null} />)
    expect(screen.getByText('This is irreversible')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <DangerZone title="Danger" description="desc">
        <button>Delete</button>
      </DangerZone>
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
})
