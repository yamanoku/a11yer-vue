<script setup lang="ts">
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code: string
  lang?: string
}>()

const html = await codeToHtml(props.code.trim(), {
  lang: props.lang ?? 'ts',
  theme: 'github-dark',
})
</script>

<template>
  <div
    class="rounded-lg overflow-x-auto text-sm [&_pre]:p-6 [&_pre]:m-0"
    v-html="html"
  />
</template>
