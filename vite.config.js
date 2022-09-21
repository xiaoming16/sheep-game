/*
 * @Author: Mr·bi
 * @Date: 2022-09-19 22:56:10
 * @explain: 
 * @LastEditTime: 2022-09-20 12:15:15
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // devServer: {
  //   host: '0.0.0.0',
  //   open: false, // 配置自动启动浏览器
  //   hotOnly: true, // 热更新
  // },
})
