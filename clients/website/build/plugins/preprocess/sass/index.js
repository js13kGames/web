import { dirname }       from 'node:path'
import { fileURLToPath } from 'node:url'
import sass              from 'sass'
import build             from '../../../index.js'

export default {
  style({ filename, attributes, content }) {
    // Compiler errors out if given an empty string - plus we can avoid the processing in such a case.
    if (attributes.lang !== 'sass' || !content.length) {
      return { code: content }
    }

    // Prepend our global vars to each style block.
    content = `@import "styles/config"\n${content}`

    const options = {
      // TODO(alcore) Evaluate perf impact, although in theory SASS should have less work to do
      // when it does not need to pretty print *and* we get less bytes to process further down
      // the pipe.
      style:    'compressed',
      syntax:   'indented',
      loadPaths: [build.src.path, dirname(filename)]
    }

    // TODO(alcore) Ideally we'd be handling all paths as URLs instead, as per native ESM defs.
    return sass.compileStringAsync(content, options).then(result => ({
      code:         result.css,
      dependencies: result.loadedUrls.map(u => fileURLToPath(u))
    }))
  }
}
