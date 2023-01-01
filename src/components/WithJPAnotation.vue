<script setup lang="ts">
import Kuroshiro from 'kuroshiro'
import kuromoji from '~/utils/src/index.js'
import KuromojiAnalyzer from '~/utils/analyzer'
import { useAnnotationJP } from '~/logics/useAnnotationJP'
const props = defineProps<{
  sentence: string
}>()
const { html } = useAnnotationJP(props.sentence)
</script>

<template>
  <div v-html="html" />
</template>

<style scoped>

</style>
