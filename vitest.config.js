import { defineConfig } from 'vitest/config';

// Unit tests run in a node environment with a lightweight localStorage stub
// (test/setup.js) so the dual-path services exercise their mock branch without
// pulling in a full DOM implementation.
export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
});
