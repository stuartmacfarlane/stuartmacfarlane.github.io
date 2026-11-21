import { bundledThemes } from 'shiki'

const { default: baseTheme } = await bundledThemes['github-dark-dimmed']()

export const codeTheme = {
  ...baseTheme,
  name: 'slate-technical',
  colors: {
    ...baseTheme.colors,
    'editor.background': '#090e19',
    'editor.foreground': '#f1f5ff',
  },
  tokenColors: baseTheme.tokenColors.map((rule) => {
    const scopes = Array.isArray(rule.scope) ? rule.scope : [rule.scope]
    if (scopes.includes('string')) {
      return { ...rule, settings: { ...rule.settings, foreground: '#bef264' } }
    }
    if (scopes.includes('comment')) {
      return { ...rule, settings: { ...rule.settings, foreground: '#8796b1' } }
    }
    return rule
  }),
}
