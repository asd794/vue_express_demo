import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [
  //   vue(),
  // ],
  // resolve: {
  //   alias: {
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // }
  
  server: {
    // 指定開發服務器的主機名（預設是 'localhost'）
    host: '0.0.0.0',
    port: 80,
  },

})
