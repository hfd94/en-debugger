import fs from 'node:fs'

import { fileURLToPath, URL } from 'node:url'
import pkg from "./package.json"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true })


  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      electron([
        {
          // 入口文件
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              }
            }
          }

        },
        {
          entry: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          }

        }, {}
      ]),
      electronRender(),
      Vuetify(),
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler',
        },
      },
    },
    optimizeDeps: {
      include: [
        'monaco-editor/esm/vs/editor/editor.worker?worker',
        'monaco-editor/esm/vs/language/json/json.worker?worker',
        'monaco-editor/esm/vs/language/typescript/ts.worker?worker',
      ]
    }
  }
})
