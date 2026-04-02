# a11yer-vue

[![CI](https://github.com/yamanoku/a11yer-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/yamanoku/a11yer-vue/actions/workflows/ci.yml)
[![E2E](https://github.com/yamanoku/a11yer-vue/actions/workflows/e2e.yml/badge.svg)](https://github.com/yamanoku/a11yer-vue/actions/workflows/e2e.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Wrap your Vue 3 app in `<A11yer>` and accessibility is automatically handled.

No hooks to call. No props to spread. No components to replace. Just wrap and ship.

> [!NOTE]
> React version is [EdamAme-x/a11yer](https://github.com/EdamAme-x/a11yer).

## Install

```bash
bun add a11yer-vue    # npm i a11yer-vue / pnpm add a11yer-vue / yarn add a11yer-vue
```

Requires `vue ^3.0.0` as a peer dependency (already installed in any Vue 3 project).

## Usage

Wrap your root component with `<A11yer>`. The recommended place is your app's entry component.

```vue
<!-- App.vue -->
<script setup>
import { A11yer } from "a11yer-vue";
</script>

<template>
  <A11yer>
    <RouterView />
  </A11yer>
</template>
```

That's it.

### Skip link

`<A11yer>` automatically injects a skip navigation link targeting `#main-content`. Add the matching `id` to your main content area so keyboard users can skip to it:

```vue
<template>
  <A11yer>
    <header>...</header>
    <main id="main-content">
      <!-- page content -->
    </main>
  </A11yer>
</template>
```

The skip link label is automatically localised to the page language (`document.documentElement.lang`). Supported languages: English, Japanese, Chinese, Korean, Spanish, French, German, Portuguese.

## What it does

a11yer-vue silently scans and patches your DOM for accessibility issues:

| Category | What gets fixed |
|----------|----------------|
| **Structure** | `html[lang]` injection, skip link, `document.title` from `<h1>` |
| **Images** | `alt=""` on decorative images, `role="img"` on informative images in links, `aria-hidden` on decorative SVGs |
| **Forms** | `aria-required`, `aria-invalid` + `aria-describedby` error linking, input label linking, `autocomplete` inference |
| **Tables** | `scope="col"` / `scope="row"` on `<th>` |
| **Keyboard** | Enter/Space on `div[role="button"]` etc., `tabindex="0"` |
| **Composites** | Roving tabindex for tablist, toolbar, radiogroup, menu, listbox, tree |
| **Dialogs** | Auto focus trap + focus restoration for `[role="dialog"][aria-modal="true"]` |
| **Tooltips** | Escape to dismiss `[role="tooltip"]`, `[popover]` |
| **Contrast** | Auto-fix via CSS color override (hex, rgb, hsl, oklch, oklab) |
| **Motion** | `prefers-reduced-motion` CSS injection |
| **Focus** | `:focus-visible` outline |
| **SPA** | Route change announcements via `aria-live` |

## Config

All features are enabled by default. Override via the `config` prop:

```vue
<script setup>
import { A11yer } from "a11yer-vue";
</script>

<template>
  <A11yer
    :config="{
      a11y: {
        minContrastRatio: 7,         // WCAG AAA (default: 4.5 for AA)
        focusVisible: true,          // default: true
        focusStyle: {                // default: 2px solid currentColor
          outline: '3px solid blue',
          outlineOffset: '2px',
        },
        reducedMotion: 'auto',       // 'auto' | 'always' | 'never'
        autoImgAlt: true,            // default: true
        announceSpaNavigation: true, // default: true
        autoContrastFix: true,       // default: true
      },
    }"
  >
    <RouterView />
  </A11yer>
</template>
```

You can also define the config as a reactive object:

```vue
<script setup>
import { ref } from "vue";
import { A11yer } from "a11yer-vue";
import type { A11yerConfig } from "a11yer-vue";

const a11yConfig = ref<A11yerConfig>({
  a11y: { minContrastRatio: 7 },
});
</script>

<template>
  <A11yer :config="a11yConfig">
    <RouterView />
  </A11yer>
</template>
```

## How it works

1. On mount, critical patches run synchronously (html[lang], skip link, img alt, aria-required)
2. Remaining patches are split across `requestIdleCallback` batches to avoid blocking the main thread
3. A `MutationObserver` watches for DOM changes and re-patches affected subtrees
4. Open Shadow DOM roots and same-origin iframes are recursively scanned
5. Contrast fixes use `getComputedStyle` + alpha blending + canvas fallback for exotic color formats

## Plays nice with others

a11yer-vue detects elements managed by existing a11y libraries and skips them:

- Headless UI (Tailwind)
- Ark UI / Zag
- Vuetify
- Element Plus
- PrimeVue
- Naive UI

No double-injection. No conflicts.

## Frameworks

| Framework | Notes |
|-----------|-------|
| Vite + Vue 3 | Works out of the box. |
| Nuxt 3 | SSR-safe. Wrap in `<ClientOnly>` if you encounter hydration warnings. |

### Nuxt 3

```vue
<!-- app.vue -->
<template>
  <ClientOnly>
    <A11yer>
      <NuxtPage />
    </A11yer>
  </ClientOnly>
</template>

<script setup>
import { A11yer } from "a11yer-vue";
</script>
```

## Browser support

Tested on every push via Playwright E2E + axe-core in CI (3 parallel jobs):

| Engine | Viewports tested |
|--------|-----------------|
| Chromium (Chrome) | Desktop 1280px, Tablet 768px, Mobile 375px |
| Firefox | Desktop 1280px, Tablet 768px, Mobile 375px |
| WebKit (Safari) | Desktop 1280px, Tablet 768px, Mobile 375px |

## Testing

```bash
bun run test          # Unit tests (Vitest + happy-dom, 190+ tests)
bun run test:e2e      # E2E tests (Playwright, all browsers — run in CI, see below)
```

E2E tests run in GitHub Actions, not locally. To run locally via Docker:

```bash
docker build -t a11yer-vue-test .
```

## API

```ts
// That's the entire public API
import { A11yer } from "a11yer-vue";
import type { A11yerProps, A11yerConfig } from "a11yer-vue";
```

### `A11yer`

Vue 3 component. Accepts a single optional prop:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `A11yerConfig` | `undefined` | Override any default a11y settings |

Exposes a default slot for your app content.

### `A11yerConfig`

```ts
interface A11yerConfig {
  a11y?: {
    minContrastRatio?: number;       // default: 4.5 (WCAG AA)
    focusVisible?: boolean;          // default: true
    focusStyle?: {
      outline?: string;              // default: "2px solid currentColor"
      outlineOffset?: string;        // default: "2px"
    };
    reducedMotion?: "auto" | "always" | "never"; // default: "auto"
    autoImgAlt?: boolean;            // default: true
    announceSpaNavigation?: boolean; // default: true
    autoContrastFix?: boolean;       // default: true
  };
}
```

## Disclaimer

a11yer-vue automatically fixes many common accessibility issues, but it does not guarantee full WCAG 2.2 compliance. Automated tools can address approximately 30-40% of WCAG success criteria. The remaining criteria require human judgment, manual testing with assistive technology, and content-level decisions (meaningful alt text, logical heading structure, comprehensible error messages, etc.).

**Do not rely on a11yer-vue as your sole accessibility solution.** Use it as a safety net alongside manual a11y audits, screen reader testing, and accessibility-focused design practices.

## Acknowledgments

a11yer-vue is a Vue 3 port inspired by [EdamAme-x/a11yer](https://github.com/EdamAme-x/a11yer), the original framework-agnostic accessibility library. The core concepts, patch strategies, and overall architecture of this library are deeply informed by that work. Many thanks to [EdamAme-x](https://github.com/EdamAme-x) for creating and sharing it.

## License

MIT
