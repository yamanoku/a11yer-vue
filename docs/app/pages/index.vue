<script setup lang="ts">
useSeoMeta({
  title: 'a11yer-vue — Automatic Accessibility for Vue 3',
  description: 'Wrap your Vue 3 app in <A11yer> and accessibility is automatically handled.',
})

const INSTALL_CODE = `bun add a11yer-vue    # npm i a11yer-vue / pnpm add a11yer-vue / yarn add a11yer-vue`

const USAGE_CODE = `<script setup>
import { A11yer } from "a11yer-vue";
<\/script>

<template>
  <A11yer>
    <YourApp />
  </A11yer>
</template>`

const CONFIG_CODE = `<A11yer
  :config="{
    a11y: {
      minContrastRatio: 7,         // WCAG AAA (default: 4.5)
      focusVisible: true,          // default: true
      reducedMotion: 'auto',       // 'auto' | 'always' | 'never'
      autoImgAlt: true,            // default: true
      announceSpaNavigation: true, // default: true
      autoContrastFix: true,       // default: true
    },
  }"
>
  <App />
</A11yer>`

const features = [
  {
    title: 'Images',
    desc: 'Alt text from filename (Title Case), decorative detection, SVG aria-hidden',
  },
  {
    title: 'Forms',
    desc: 'aria-required, aria-invalid + error linking, input labels, autocomplete',
  },
  {
    title: 'Keyboard',
    desc: 'Enter/Space on div[role=button], roving tabindex for tabs/menus/toolbars',
  },
  {
    title: 'Focus',
    desc: 'Focus trap for modals, focus-visible CSS, focus restoration on close',
  },
  {
    title: 'Contrast',
    desc: 'Auto-fix insufficient contrast via CSS override (hex/rgb/hsl/oklch)',
  },
  {
    title: 'Navigation',
    desc: 'Skip link, SPA route announcements, document title from h1',
  },
  {
    title: 'Tables',
    desc: 'scope=col/row on th elements',
  },
  {
    title: 'Motion',
    desc: 'prefers-reduced-motion CSS injection',
  },
]

const compatLibs = [
  'Headless UI',
  'Ark UI',
  'Vuetify',
  'Element Plus',
  'PrimeVue',
  'Naive UI',
]
</script>

<template>
  <main id="main-content" class="max-w-5xl mx-auto px-6 py-16">
    <!-- Hero -->
    <section class="mb-20">
      <h2 class="text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
        Automatic Accessibility for Vue 3
      </h2>
      <p class="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl">
        Wrap your app in <code class="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm font-mono">A11yer</code> and
        accessibility is automatically handled. No hooks, no props to spread, no components to replace.
      </p>
      <AppCodeBlock :code="USAGE_CODE" lang="vue" />
      <div class="mt-6">
        <AppCodeBlock :code="INSTALL_CODE" lang="bash" />
      </div>
    </section>

    <!-- What it does -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-8">What it does</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="item in features"
          :key="item.title"
          class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5"
        >
          <h3 class="font-semibold text-zinc-900 dark:text-white mb-2">{{ item.title }}</h3>
          <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Live Demo -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Live Demo</h2>
      <p class="text-zinc-600 dark:text-zinc-400 mb-8">
        This page is wrapped in
        <code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">
          &lt;A11yer&gt;
        </code>
        . The elements below have deliberate a11y issues that are automatically fixed.
      </p>
      <AppDemoSection />
    </section>

    <!-- Config -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Configuration</h2>
      <AppCodeBlock :code="CONFIG_CODE" lang="vue" />
    </section>

    <!-- Compatibility -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Plays nice with others
      </h2>
      <p class="text-zinc-600 dark:text-zinc-400 mb-6">
        a11yer-vue detects elements managed by existing libraries and skips them. No conflicts.
      </p>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="lib in compatLibs"
          :key="lib"
          class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-700 dark:text-zinc-300"
        >
          {{ lib }}
        </span>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="mb-20 border-l-4 border-amber-400 pl-6 py-2">
      <p class="text-sm text-zinc-600 dark:text-zinc-400">
        <strong>Disclaimer:</strong> a11yer-vue automatically fixes many common accessibility issues,
        but does not guarantee full WCAG 2.2 compliance. Use it as a safety net alongside manual
        a11y audits and screen reader testing.
      </p>
    </section>
  </main>
</template>
