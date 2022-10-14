import path              from 'node:path'
import { normalizePath } from 'vite'

const ENV  = process.env.NODE_ENV
const root = normalizePath(path.resolve('./'))

export default {
  mode: {
    dev:        ENV === 'development',
    production: ENV === 'production',
    ssr:        process.env.VITE_MODE === 'ssr'
  },

  root: {
    path: root,

    normalizePath(p) {
      p = normalizePath(p)
      if (p.indexOf(root) === 0) {
        // +1 to cover directory separator after the root path.
        return p.substring(root.length + 1)
      }

      return p
    }
  },

  src: {
    path: root + '/src'
  },

  cache: {
    path: root + '/build/.cache'
  },

  output: {
    client: {
      path: root + '/dist'
    }
  }
}