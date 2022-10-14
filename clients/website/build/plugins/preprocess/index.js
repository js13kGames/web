import html from '../../utils/html.js'

export const collapseHtml = {
  markup({ _, content }) {
    const
      blocks = new Map,
      tags = [
        ['<script', '</script>'],
        ['<style', '</style>'],
        ['<pre', '</pre>'],
      ]

    let
      code  = content,
      count = 0

    for (const tag of tags) {
      let start
      while ((start = code.indexOf(tag[0])) !== -1) {
        const
          end    = code.indexOf(tag[1], start) + tag[1].length,
          inner  = code.slice(start, end),
          marker = `<___mrk_${count}>`

        blocks.set(marker, inner)

        code   = code.substring(0, start) + marker + code.substring(end)
        count += 1
      }
    }

    code = html.collapseWhitespace(code)

    // Restore the blocks.
    for (const marker of blocks.keys()) {
      code = code.replace(marker, blocks.get(marker))
    }

    return {
      code
    }
  }
}
