import { bundledLanguages, codeToHast } from 'shiki'
import { codeTheme } from './code-theme.mjs'

const text = (value) => ({ type: 'text', value })
const element = (tagName, properties, children) => ({
  type: 'element', tagName, properties, children,
})

export const codeBlocks = {
  name: 'article-code',
  element: {
    filter: ['pre'],
    async visit(node, context) {
      const code = node.children.find((child) => child.tagName === 'code')
      if (!code) return

      // Markdown adds one terminal newline when it renders a code node.
      const source = context.textContent(code).replace(/\n$/, '')
      const language = code.data?.lang ?? 'text'
      const filename = code.data?.meta?.match(/(?:^|\s)title="([^"]+)"/)?.[1]
      const syntax = Object.hasOwn(bundledLanguages, language) ? language : 'text'
      const highlighted = await codeToHast(source, { lang: syntax, theme: codeTheme })
      const pre = highlighted.children[0]
      pre.properties.tabIndex = 0
      pre.properties.ariaLabel = filename ?? language + ' code'

      return element('div', { className: ['code-block'] }, [
        element('div', { className: ['code-toolbar'] }, [
          element('span', {}, [text(filename ?? language)]),
          element('button', {
            type: 'button',
            'data-copy-code': JSON.stringify(source),
          }, [text('Copy')]),
        ]),
        pre,
      ])
    },
  },
}
