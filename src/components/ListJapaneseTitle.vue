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
const { data, isFinished } = useAnnotation(addSignStr.value)
const html = computed(() => data.value?.[0])
</script>

<template>
  <h2 v-if="html && isFinished" v-html="html" />
  <div v-if="!isFinished" w-full flex="~" justify="center" pt="1em">
    <Loading dark:text="white 20px" text="40px gray-900" />
  </div>
</template>

<style scoped>

</style>
