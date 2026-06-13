Nuxt 4 documentation site for the a11yer-vue library, deployed to Cloudflare Pages.

## Getting Started

First, build the a11yer-vue library, then run the docs dev server:

```bash
# From the repo root: build the library (tsup -> ../dist/)
bun run build

# Then, in this directory
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/pages/index.vue`. The page auto-updates as you edit the file.

The docs site imports the local `a11yer-vue` build via a Nuxt alias (`../dist/index.js`, see `nuxt.config.ts`), so the library must be built first.

## Learn More

To learn more about Nuxt, take a look at the following resources:

- [Nuxt Documentation](https://nuxt.com/docs) - learn about Nuxt features and API.

## Deploy on Cloudflare Pages

This site is deployed via Cloudflare Pages (Git integration). Build settings:

- **Root directory**: repo root (leave blank — the library must be built before the docs)
- **Build command**: `bun install --frozen-lockfile && bun run build && cd docs && bun install && bun run build`
- **Build output directory**: `docs/dist`
- **Environment variable**: `BUN_VERSION=1.3.14`

On Cloudflare's build environment, Nuxt auto-selects the `cloudflare-pages-static` Nitro
preset, which emits the static site (plus `_headers` / `_redirects`) to `docs/dist`.
Locally, `bun run build` uses the default `static` preset and outputs to `docs/.output/public`.
