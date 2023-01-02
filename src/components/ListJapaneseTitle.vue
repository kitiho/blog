<script setup lang="ts">
import { useAnnotation } from '~/logics/useAnnotation'

const props = defineProps<{
  title: string
  words: string[]
}>()
const addSignStr = computed(() => {
  let str = props.title
  props.words.forEach((word: string) => {
    str = str.replace(word, `<span class="bg-red/30">${word}</span>`)
  })
  return str
})
const { data } = useAnnotation(addSignStr.value)
const html = computed(() => data.value?.[0])
</script>

<template>
  <h2 v-html="html" />
</template>

<style scoped>

</style>
