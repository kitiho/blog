<script setup lang="ts">
import { useAnnotationJP } from '~/logics/useAnnotationJP'

const props = defineProps<{
  fullText: string
  words: string[]
}>()
function signWords() {
  let res = props.fullText
  props.words.forEach((word: string) => {
    res = res.replace(word, `<span class="bg-red-400/50">${word}</span>`)
  })
  return res
}
const { html } = useAnnotationJP(signWords())
</script>

<template>
  <h2 class="jpNoteTitle" v-html="html" />
</template>

<style scoped>
.jpNoteTitle {
  line-height: 2;
}
</style>

<style>
.jpNoteTitle rt {
  font-size: 12px;
  font-weight: normal;
}
</style>
