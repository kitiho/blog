<script setup lang="ts">
import ListJapaneseDetail from './ListJapaneseDetail.vue'
import ListJapaneseTitle from './ListJapaneseTitle.vue'

const props = defineProps<{ japanese: Record<string, any[]> }>()
</script>

<template>
  <template v-for="title in Object.keys(japanese)" :key="title">
    <ListJapaneseTitle :title="title" :words="japanese[title].map(v => v.name)" />
    <div class="py-2 -mx-3">
      <div v-for="item, idx in japanese[title]" :key="idx" mb-1em>
        <h3 mt="!0" border-b="2px solid #dddddd">
          {{ item.name }}
        </h3>
        <ListJapaneseDetail :sentence="item.interpretation" bg="bg-blue/10" />
        <ListJapaneseDetail :sentence="item.exampleSentence" bg="bg-yellow/10" />
      </div>
    </div>
  </template>
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
