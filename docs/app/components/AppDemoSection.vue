<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const TAB_CONTENT: Record<string, string> = {
  Overview: 'a11yer-vue wraps your Vue 3 app and automatically patches accessibility issues in the DOM.',
  Install: 'bun add a11yer-vue — then wrap your root component in <A11yer>.',
  Config: 'Pass a config prop to tune contrast ratio, motion preferences, and more.',
}

const patchedCount = ref(0)
const activeTab = ref('Overview')

const { app } = useRuntimeConfig()
const mountainImgSrc = `${app.baseURL}mountain-landscape.jpg`

let timer: ReturnType<typeof setTimeout> | null = null
let tablistObserver: MutationObserver | null = null

onMounted(() => {
  timer = setTimeout(() => {
    const patched = document.querySelectorAll(
      '[data-a11yer-vue-img-alt], [data-a11yer-vue-keyboard], [data-a11yer-vue-roving], [data-a11yer-vue-required], [data-a11yer-vue-autocomplete], [data-a11yer-vue-label], [data-a11yer-vue-table-headers]',
    )
    patchedCount.value = patched.length
  }, 500)

  const tablist = document.querySelector('[role="tablist"]')
  if (tablist) {
    tablistObserver = new MutationObserver(() => {
      const tabs = tablist.querySelectorAll('[role="tab"]')
      for (const tab of tabs) {
        if (tab.getAttribute('tabindex') === '0') {
          activeTab.value = tab.textContent?.trim() || 'Overview'
        }
      }
    })
    tablistObserver.observe(tablist, {
      attributes: true,
      attributeFilter: ['tabindex', 'aria-selected'],
      subtree: true,
    })
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  tablistObserver?.disconnect()
})

const handleClick = () => {
  alert('Clicked!')
}
</script>

<template>
  <div class="space-y-8">
    <div
      v-if="patchedCount > 0"
      class="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <p class="text-green-800 dark:text-green-200 font-medium">
        a11yer-vue automatically fixed {{ patchedCount }} accessibility issues on this page.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Image without alt -->
      <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">Image without alt</h3>
        <p class="text-sm text-zinc-500 mb-3">
          a11yer-vue derives alt from the filename: "Mountain Landscape"
        </p>
        <img
          :src="mountainImgSrc"
          class="w-full h-32 object-cover rounded"
        />
      </div>

      <!-- Form without labels -->
      <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">
          Form: auto labels + autocomplete
        </h3>
        <form class="space-y-3">
          <div>
            <span class="text-sm text-zinc-600 dark:text-zinc-400">Email</span>
            <input
              type="email"
              name="email"
              class="w-full mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <span class="text-sm text-zinc-600 dark:text-zinc-400">Name</span>
            <input
              name="fname"
              required
              class="w-full mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
          </div>
        </form>
      </div>

      <!-- Table without scope -->
      <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">Table: auto scope</h3>
        <table class="w-full text-sm">
          <thead>
            <tr>
              <th class="text-left py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Feature
              </th>
              <th class="text-left py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-2 px-3 text-zinc-600 dark:text-zinc-400">Alt text</td>
              <td class="py-2 px-3 text-zinc-600 dark:text-zinc-400">Auto</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-zinc-600 dark:text-zinc-400">Focus trap</td>
              <td class="py-2 px-3 text-zinc-600 dark:text-zinc-400">Auto</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Non-native button -->
      <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">
          Keyboard: div[role=button]
        </h3>
        <p class="text-sm text-zinc-500 mb-3">
          a11yer-vue adds tabindex=0 and Enter/Space handler.
        </p>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
          role="button"
          class="inline-block px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded cursor-pointer"
          @click="handleClick"
        >
          Click or press Enter
        </div>
      </div>

      <!-- Tabs — roving tabindex managed by a11yer-vue -->
      <div class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 md:col-span-2">
        <h3 class="font-semibold text-zinc-900 dark:text-white mb-3">
          Roving tabindex: tablist
        </h3>
        <p class="text-sm text-zinc-500 mb-3">
          Arrow keys navigate between tabs. Only the active tab is in the tab order.
          a11yer-vue manages tabindex automatically.
        </p>
        <div
          role="tablist"
          class="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 mb-4"
        >
          <div
            v-for="tab in ['Overview', 'Install', 'Config']"
            :key="tab"
            role="tab"
            :aria-selected="tab === activeTab"
            class="px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors"
            :class="
              tab === activeTab
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            "
            @click="activeTab = tab"
          >
            {{ tab }}
          </div>
        </div>
        <div
          role="tabpanel"
          class="p-4 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          {{ TAB_CONTENT[activeTab] }}
        </div>
      </div>
    </div>
  </div>
</template>
