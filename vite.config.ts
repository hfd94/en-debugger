import fs from 'node:fs'


import { fileURLToPath, URL } from 'node:url'
import pkg from "./package.json"
import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'
import Vuetify from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import path from 'node:path'

function copyFile() {
  return {
    name: 'copy-electron-dist',
    apply: 'build',

    writeBundle() {
      const sourceFiles = [
        { src: './dist-electron/main/index.js', dest: './dist/main/index.js' },
        { src: './dist-electron/preload/index.js', dest: './dist/preload/index.js' },
      ];

      sourceFiles.forEach(({ src, dest }) => {
        const destinationDir = path.dirname(dest);
        fs.mkdir(destinationDir, { recursive: true }, (err) => {
          if (err) {
            console.error('无法创建目标目录:', err);
            return;
          }
          fs.copyFileSync(src, dest);
        });
      });
    },
  }
}

export default defineConfig(({ command }) => {
  if (command == "serve") {
    fs.rmSync('dist-electron', { recursive: true, force: true })
  }
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG



  return {
    base: "./",
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      Vuetify(),
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'typescript', 'json']
      }),

      isServe && electron([
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
      isServe && electronRender(),
      copyFile()
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