import { defineConfig } from 'vite'
import { svelte }       from '@sveltejs/vite-plugin-svelte'

import { fnv }        from '../utils/index.js'
import mds            from '../plugins/mds/index.js'
import preprocessSass from '../plugins/preprocess/sass/index.js'

// https://vitejs.dev/config
export default defineConfig(async ({ command, mode }) => {
  const isProductionBuild = (command === 'build' && mode === 'production')

  return {
    server: {
      watch: {
        ignored: ['**/.idea/**']
      },
    },

    build: {
      target:                'esnext',
      polyfillModulePreload: false,
      polyfillDynamicImport: false,
      manifest:              false,
      assetsDir:             'a',
      reportCompressedSize:  true,
      cssCodeSplit:          false,
      minify:                isProductionBuild,
      rollupOptions: {
        output: {
          entryFileNames: v => `a/${fnv(v.facadeModuleId)}.js`,
          assetFileNames: v => `a/${fnv(v.name)}[extname]`,
          chunkFileNames: v => `a/${fnv(v.facadeModuleId ?? v.name)}.js`,
          manualChunks:   undefined,
        }
      }
    },

    css: {
      postcss: {
        plugins: [
          // Ideally temporary, but even when those get properly fixed upstream...
          // - https://github.com/vitejs/vite/issues/5833
          // - https://github.com/vitejs/vite/issues/6333
          // ... this still gets rid of a useless @charset declaration, where UTF-8 is the default anyway.
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          },

          ...isProductionBuild ? [
            (await import('cssnano')).default,
          ] : [],
        ],
      }
    },

    plugins: [
      svelte({
        extensions: ['.svelte', '.mds', '.md'],
        preprocess: [
          mds(mode, command),
          ...isProductionBuild ? [(await import('../plugins/preprocess/index.js')).collapseHtml] : [],
          preprocessSass
        ],
        onwarn: (warning, handler) => {
          // TODO(alcore) Temporary.
          if (warning.code.startsWith('a11y-')) return

          handler(warning)
        }
      }),

      ...isProductionBuild ? [(await import('../plugins/inliner.js')).default()] : [],
    ]
  }
})
