# Stuart Macfarlane

An Astro site for Microsoft 365 administration, built with [Inkfolio](https://github.com/respectevery01/inkfolio) at revision `f0301b1`. The adapted theme source is distributed under the [GNU General Public License](LICENSE).

Adapted for this site on 22 November 2026. The migration configures the theme for an English-language blog on GitHub Pages and replaces the demo content.

## Preview

Use Node.js 24 and run the following commands.

```sh
npm ci
npm run dev
```

Run `npm run build` for a production check and `npm run preview` to preview its output. The production build type-checks the site, generates static pages, and creates the Pagefind search index. GitHub Pages deploys `dist/` from `main` to `stuartmacfarlane.co.uk`.

## Write

Add Markdown files to `src/content/posts/`. A filename such as `intune-notes.md` becomes `/posts/intune-notes/`. Set `title`, `description`, `date` and `tags` in the front matter. Set `draft: true` to keep a post out of published lists and routes.

Edit `site.config.yaml` for the site title, navigation, theme mode and footer.
