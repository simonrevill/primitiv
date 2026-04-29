import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

import { installPopoverPolyfill } from './src/test/popoverPolyfill'
import { installScrollPolyfill } from './src/test/scrollPolyfill'

installPopoverPolyfill()
installScrollPolyfill()

afterEach(() => {
  cleanup()
})
