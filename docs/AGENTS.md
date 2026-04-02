# a11yer-vue docs

Nuxt 4 documentation site for the a11yer-vue library.

## Prerequisites

The a11yer-vue library must be built before running the docs dev server or generating the static site:

```bash
# From the repo root
bun run build
```

This populates `../dist/` which the docs site imports via a Nuxt alias.

## Development

```bash
bun run dev
```

## Static generation

```bash
bun run build
```

Output is written to `.output/public/`.
