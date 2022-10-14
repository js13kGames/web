import { minify } from 'html-minifier-terser'

const defaultMinifyOptions = {
  caseSensitive:                 true,
  keepClosingSlash:              true,
  collapseBooleanAttributes:     true,
  collapseInlineTagWhitespace:   false,
  collapseWhitespace:            true,
  minifyCSS:                     false,
  minifyJS:                      false,
  minifyURLs:                    true,
  quoteCharacter:                "'",
  removeAttributeQuotes:         true,
  removeEmptyAttributes:         true,
  removeRedundantAttributes:     true,
  removeScriptTypeAttributes:    true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyElements:           true,
  removeComments:                true,
}

export default {
  minify(src, opts) {
    return minify(src, Object.assign({}, defaultMinifyOptions, opts))
  },

  collapseWhitespace(src) {
    return src
      .replace(/<!--[\s\S]*?-->/gu, '') // Remove HTML comments.
      .replace(/>\s*?</gm, '><')        // Remove whitespace between tags (note: unsafe).
      .replace(/\s{2,}/gm, ' ')         // Collapse whitespace down to a single space.
      .replace(/\s/gm, ' ')             // Convert remaining whitespace characters into a space.
      .trim()                           // Remove surrounding whitespace.
  }
}