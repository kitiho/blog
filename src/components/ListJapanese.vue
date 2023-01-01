<script setup lang="ts">
import ListJapaneseTitle from './ListJapneseItemTitle.vue'
import WithJPAnotation from './WithJPAnotation.vue'

const props = defineProps<{ japanese: Record<string, any[]> }>()
</script>

<template>
  <template v-for="key in Object.keys(japanese)" :key="key">
    <!-- <h2 class="mt-10 font-bold lh-6" v-html="" /> -->
    <ListJapaneseTitle :full-text="key" :words="japanese[key].map(v => v.name)" />
    <div class="py-2 -mx-3">
      <div v-for="item, idx in japanese[key]" :key="idx" mb-1em>
        <h3 mt="!0" border-b="2px solid #dddddd">
          {{ item.name }}
        </h3>
        <div pl-1em>
          <WithJPAnotation :sentence="item.interpretation " />
        </div>
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
