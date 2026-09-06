import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Chỉ lấy test của chúng ta: node_modules và .next chứa hàng nghìn file khớp mẫu.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
