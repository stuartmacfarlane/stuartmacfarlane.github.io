# Stuart Macfarlane's technical blog

## Preview locally

Use Node.js 24 and run these commands from the repository root. Open the URL printed by Astro.

```bash
npm ci
npm run dev
```

To check the production site, use `npm run build` followed by `npm run preview`.

## Add an article

Add a Markdown file to `src/content/articles/`. Use a kebab-case filename to set the URL under `/articles/`. Start with this front matter.

```yaml
---
title: A title for the article
description: A short summary for the index and topic pages.
pubDate: 2026-11-21
# updatedDate: 2026-11-22
tags: [Intune, PowerShell]
draft: true
---
```

Start sections at heading level 2. The article layout shows a table of contents when there are at least four level 2 or 3 headings. Drafts appear in development and are excluded from production. Set `draft: false` when the article is ready.

Use fenced code with a language such as `powershell`, `json`, `bash` or `text`. Add an optional filename in the fence info string, for example `powershell title="Detect.ps1"`.
