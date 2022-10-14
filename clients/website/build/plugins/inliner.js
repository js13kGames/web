import { transform } from '@parcel/css'
import html          from '../utils/html.js'

export default function() {
  return {
    name: 'js13k:inline-global-css',
    transformIndexHtml: {
      enforce: 'post',
      apply:   'build',
      transform(src, ctx) {
        for (const [id, asset] of Object.entries(ctx.bundle)) {
          if (id.endsWith('.css')) {
            let { code } = transform({
              filename:  'master.css',
              code:      Buffer.from(asset.source),
              minify:    true,
              sourceMap: false,
              targets: {
                // Semver versions are represented using a single 24-bit number, with one component per byte.
                // e.g. to represent Safari 13.2.0, the following applies:
                safari:  (13 << 16) | (2 << 8),
                android: (80 << 16),
                edge:    (80 << 16),
                chrome:  (80 << 16),
                firefox: (80 << 16)
              }
            })

            src = src.replace(new RegExp(`<link rel="stylesheet"[^>]*?href="/${id}"[^>]*?>`), `<style>${code}</style>`)

            break
          }
        }

        // Final minification pass on the compiled index.html.
        return html.minify(src, {
          removeOptionalTags:          true,
          collapseInlineTagWhitespace: true,
          minifyJS:                    true,
          minifyCSS:                   {
            level: {
              1: { all: true },
              2: { all: true }
            }
          }
        })
      }
    }
  }
}