import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Draftdata/', // 改為儲存庫名稱，這是 GitHub Pages 的標準設定
})