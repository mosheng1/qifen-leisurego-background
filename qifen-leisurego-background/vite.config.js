import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import legacy from '@vitejs/plugin-legacy';
export default defineConfig({
  base: './',
  plugins: [
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    // origin: 'http://localhost:8080',
    // disableHostCheck:true,
    proxy: {
      // 在此处编写代理规则
      '/background': {
        target: 'http://qf.wpzllq.cn', //接口域名
        // target: 'https://quan.c1.sidoc.cn', //接口域名
        // target: 'https://quan.c1.sidoc.cn', //接口域名
        // target: 'https://xianqu.c1.sidoc.cn', //接口域名
        changeOrigin: true,       //是否跨域  
      }
    }
  },
})

