import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// 监听ui-vue目录变化的插件
const watchUiVuePlugin = () => {
  return {
    name: 'watch-ui-vue',
    configureServer(server) {
      // 获取ui-vue的dist目录
      const uiVuePath = path.resolve(__dirname, '../../ui-vue/dist')
      
      // 监听ui-vue的dist目录变化
      fs.watch(uiVuePath, { recursive: true }, (eventType, filename) => {
        if (filename) {
          console.log(`[watch-ui-vue] 检测到ui-vue变化: ${filename}`)
          // 通知客户端刷新
          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    watchUiVuePlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  optimizeDeps: {
    include: ['vue', 'fast-json-ui-vue'],
    force: true,
    // 禁用依赖预构建缓存
    disabled: false
  },
  server: {
    fs: {
      strict: false
    },
    // 添加热更新配置
    hmr: {
      overlay: true
    },
    watch: {
      // 监听ui-vue目录
      ignored: ['!**/node_modules/fast-json-ui-vue/**']
    }
  }
})
