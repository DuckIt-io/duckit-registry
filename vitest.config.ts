import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['packages/cli/src/**/__tests__/**/*.test.ts'],
  },
})
