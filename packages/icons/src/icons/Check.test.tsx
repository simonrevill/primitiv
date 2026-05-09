import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Check } from './Check'

describe('Check icon', () => {
  it('renders an svg element', () => {
    render(<Check data-testid="icon" />)
    expect(screen.getByTestId('icon').tagName).toBe('svg')
  })

  it('passes size prop through to the underlying svg', () => {
    render(<Check data-testid="icon" size={32} />)
    const svg = screen.getByTestId('icon')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
  })

  it('passes className through to the underlying svg', () => {
    render(<Check data-testid="icon" className="text-green-500" />)
    expect(screen.getByTestId('icon')).toHaveClass('text-green-500')
  })

  it('is aria-hidden by default', () => {
    render(<Check data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
  })
})
