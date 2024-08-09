import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defaultTheme } from './theme';

// https://vitejs.dev/config/
export default defineConfig(async ({mode, command}) => ({
  plugins: [vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '_c': path.resolve(__dirname, 'src/components'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      '/api': {
        target: 'http://192.168.10.113:8033/api', // 安蚁测试环境
        // target: loadEnv(mode, __dirname).VITE_FILE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    // 全局变量+全局引入less+配置antdv主题色
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 全局变量使用：@primary-color
        modifyVars: defaultTheme
      }
    }
  },
}));
