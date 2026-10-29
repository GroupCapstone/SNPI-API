import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    pool: 'forks',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
