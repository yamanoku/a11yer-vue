<template>
  <A11yer>
    <div class="min-h-screen bg-white dark:bg-zinc-950">
      <header class="border-b border-zinc-200 dark:border-zinc-800">
        <nav class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">
            a11yer-vue
          </h1>
          <div class="flex gap-4">
            <a
              href="https://github.com/yamanoku/a11yer-vue"
              class="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/a11yer-vue"
              class="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              npm
            </a>
          </div>
        </nav>
      </header>

      <NuxtPage />

      <footer class="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div class="max-w-5xl mx-auto px-6 text-center text-sm text-zinc-500">
          MIT License |
          <a
            href="https://github.com/yamanoku"
            class="underline hover:text-zinc-900 dark:hover:text-white"
          >
            yamanoku
          </a>
        </div>
      </footer>
    </div>
  </A11yer>
</template>

<script setup lang="ts">
import { A11yer } from 'a11yer-vue'
</script>
