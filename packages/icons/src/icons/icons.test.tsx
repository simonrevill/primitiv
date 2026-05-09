import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { IconProps } from '../types'
import * as icons from './index'

type IconComponent = (props: IconProps) => React.ReactElement

const iconEntries = Object.entries(icons) as [string, IconComponent][]

describe('all icons', () => {
  it.each(iconEntries)('%s renders an svg with correct defaults', (_, Icon) => {
    const { container } = render(<Icon data-testid="icon" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
