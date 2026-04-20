import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

import { installPopoverPolyfill } from './src/test/popoverPolyfill'

installPopoverPolyfill()

afterEach(() => {
  cleanup()
})
