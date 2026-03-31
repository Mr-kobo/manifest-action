// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    dir: './tests',
    isolate: false,
    setupFiles: ['./tests/setup.ts'],
    threads: false,
    // globalSetup: ['./tests/setup.ts'],

  },
})