import { defineConfig } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import { codeBlocks } from './src/lib/code-blocks.mjs'

export default defineConfig({
  site: 'https://stuartmacfarlane.co.uk',
  markdown: {
    syntaxHighlight: false,
    processor: satteri({ hastPlugins: [codeBlocks] }),
  },
})
