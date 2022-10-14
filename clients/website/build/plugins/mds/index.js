import { normalizePath }      from 'vite'
import markdownIt             from 'markdown-it'
import anchorPlugin           from 'markdown-it-anchor'
import { createHash }         from 'node:crypto'

import html                   from '../../utils/html.js'
import { slugify }            from '../../utils/index.js'

const cache = {}

let
  preprocessor,
  __pureRenderer

function getPureRenderer() {
  if (__pureRenderer) return __pureRenderer

  __pureRenderer = markdownIt({
    html:        true,
    typographer: true
  })
    .use(anchorPlugin, {
      level: [2],
      slugify,
      tabIndex: false,
      permalink: anchorPlugin.permalink.headerLink({
        class: 't-h-a',
      }),
    })

  return __pureRenderer
}

/*
 *
 */
export default function(mode, command) {
  if (preprocessor) {
    throw new Error('Attempted to initialize MDS preprocessor more than once')
  }

  const isProduction = mode === 'production'

  preprocessor = {
    markup: async ({ content, filename }) => {
      if (!filename.endsWith('.md')) return

      // TODO(alcore) Could do with a faster alternative to SHA1.
      let hash = createHash('sha1')
        .update(content)
        .digest()

      if (cache[filename]?.hash.equals(hash)) {
        return cache[filename].result
      }

      content = String(content)

      // Env variables that will get passed down through markdown processing chain to all plugins, and then back
      // to us again.
      const env = {
        module: {
          path: filename
        },
        stats: {
          words:  0,
          images: 0
        }
      }

      content = (await getPureRenderer()).render(content, env)

      // Minify before inserting custom elements as it may break the HTML parser (on unescaped JS chars).
      // We insert those programmatically, so it's on us to keep those minified.
      if (isProduction) {
        try {
          content = await html.minify(content)
        } catch (e) {
          console.warn('Failed to minify HTML after processing ' + filename)
        }
      }

      let result = {
        code: content,
        map: '',
      }

      cache[filename] = {
        hash,
        result
      }

      return result
    }
  }

  return preprocessor
}

export function compile(content, filename) {
  return preprocessor.markup({
    content,
    filename: normalizePath(filename)
  })
}
