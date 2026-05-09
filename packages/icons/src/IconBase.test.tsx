import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { IconBase } from './IconBase'

describe('IconBase defaults', () => {
  it('renders an svg element', () => {
    render(<IconBase data-testid="icon" />)
    expect(screen.getByTestId('icon').tagName).toBe('svg')
  })

  it('defaults width and height to 24', () => {
    render(<IconBase data-testid="icon" />)
    const svg = screen.getByTestId('icon')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('has viewBox of 0 0 24 24', () => {
    render(<IconBase data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('has fill set to currentColor', () => {
    render(<IconBase data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('fill', 'currentColor')
  })

  it('is aria-hidden by default', () => {
    render(<IconBase data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('IconBase props', () => {
  it('applies a numeric size to width and height', () => {
    render(<IconBase data-testid="icon" size={16} />)
    const svg = screen.getByTestId('icon')
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('applies a string size to width and height', () => {
    render(<IconBase data-testid="icon" size="1rem" />)
    const svg = screen.getByTestId('icon')
    expect(svg).toHaveAttribute('width', '1rem')
    expect(svg).toHaveAttribute('height', '1rem')
  })

  it('applies className to the svg element', () => {
    render(<IconBase data-testid="icon" className="my-class" />)
    expect(screen.getByTestId('icon')).toHaveClass('my-class')
  })

  it('allows overriding fill', () => {
    render(<IconBase data-testid="icon" fill="red" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('fill', 'red')
  })

  it('removes aria-hidden when aria-label is provided', () => {
    render(<IconBase data-testid="icon" aria-label="Search" />)
    expect(screen.getByTestId('icon')).not.toHaveAttribute('aria-hidden')
  })

  it('renders children inside the svg', () => {
    render(
      <IconBase data-testid="icon">
        <path data-testid="path" d="M0 0" />
      </IconBase>
    )
    expect(screen.getByTestId('path')).toBeInTheDocument()
  })
})

describe('IconBase ref', () => {
  it('forwards ref to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>()
    render(<IconBase ref={ref} data-testid="icon" />)
    expect(ref.current).toBe(screen.getByTestId('icon'))
  })
})
