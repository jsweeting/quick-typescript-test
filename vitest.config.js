import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      exclude: [
        'index.ts',
        ...coverageConfigDefaults.exclude
      ]
    }
  }
})
