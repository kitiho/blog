<script setup lang="ts">
import { hasKanji } from '~/logics/japaneseUtil'
import { useAnnotation } from '~/logics/useAnnotation'

const props = defineProps<{
  sentence: string
  bg: string
}>()

const { data, isFinished } = useAnnotation(props.sentence)
const html = computed(() => data.value?.[0])
</script>

<template>
  <div
    v-if="sentence" :class="`${hasKanji(sentence) ? 'pt-1em pb-0.5rem' : 'py-0.5rem'} ${bg}`" border-rd="8px"
    dark:text="#dddddd" mb="1em" px="16px" v-html="html"
  />
  <div v-if="!isFinished" w-full flex="~" justify="center" pt="1em">
    <Loading dark:text="white 20px" text="40px gray-900" />
  </div>
</template>

<style scoped>

</style>
