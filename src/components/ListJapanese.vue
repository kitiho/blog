<script setup lang="ts">
import ListJapaneseDetail from './ListJapaneseDetail.vue'
import ListJapaneseTitle from './ListJapaneseTitle.vue'
import JapaneseFlotItem from './JapaneseFlotItem.vue'
import { shuffle } from '~/logics'
const props = defineProps<{ japanese: Record<string, any[]> }>()
const visible = ref(false)
const checkingWordData = ref()
function handleWordHover(word, title) {
  console.log(word, title)
  checkingWordData.value = props.japanese[title].find(v => v.name === word)
  visible.value = true
  console.log(checkingWordData.value)
}
function handleMouseLeaveWord() {
  visible.value = false
}
</script>

<template>
  <template v-for="title in Object.keys(japanese).reverse()" :key="title">
    <ListJapaneseTitle
      :title="title" :words="japanese[title].map(v => v.name)"
      @onMouseInWord="word => handleWordHover(word, title)"
      @onMouseLeaveWord="handleMouseLeaveWord"
    />
  </template>
  <JapaneseFlotItem :visible="visible" :word-data="checkingWordData" />
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}

.project-grid a.item:hover {
  background: #88888808;
}
</style>

<style>
.jpNoteTitle rt {
  font-size: 12px;
  font-weight: normal;
}
</style>
