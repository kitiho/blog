<script setup lang="ts">
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from '~/utils/analyzer'

const props = defineProps<{ japanese: Record<string, any[]> }>()
const kuroshiro = ref<any>()
const convertedObj = ref<any>({})
const loading = ref(false)

function hasKanji(str: string) {
  return Kuroshiro.Util.hasKanji(str)
}
async function getConvertedTitles() {
  const titles = Object.keys(props.japanese)
  for (let i = 0; i < titles.length; i++) {
    const rawTitle = titles[i]
    const words = props.japanese[rawTitle].map(v => v.name)
    let addFocusWordsTitle = rawTitle
    words.forEach((word: string) => {
      addFocusWordsTitle = addFocusWordsTitle.replace(word, `<span class="bg-red/30">${word}</span>`)
    })
    const convertedTitle = await kuroshiro.value.convert(addFocusWordsTitle, { mode: 'furigana', to: 'hiragana' })
    const convertedDetailArr = []
    for (let j = 0; j < props.japanese[rawTitle].length; j++) {
      const detail = props.japanese[rawTitle][j]
      const interpretation = await kuroshiro.value.convert(detail.interpretation, { mode: 'furigana', to: 'hiragana' })
      const exampleSentence = await kuroshiro.value.convert(detail.exampleSentence, { mode: 'furigana', to: 'hiragana' })
      convertedDetailArr.push({
        name: detail.name,
        interpretation,
        exampleSentence,
      })
    }
    convertedObj.value[convertedTitle] = convertedDetailArr
  }
}

onMounted(async () => {
  loading.value = true
  kuroshiro.value = new Kuroshiro()
  await kuroshiro.value.init(new KuromojiAnalyzer({ dictPath: '/dict/' }))
  await getConvertedTitles()
  loading.value = false
})
</script>

<template>
  <div v-if="!loading">
    <template v-for="title in Object.keys(convertedObj)" :key="title">
      <h2 class="jpNoteTitle" v-html="title" />
      <div class="py-2 -mx-3">
        <div v-for="item, idx in convertedObj[title]" :key="idx" mb-1em>
          <h3 mt="!0" border-b="2px solid #dddddd">
            {{ item.name }}
          </h3>
          <div v-if="item.interpretation" :class="`${hasKanji(item.interpretation) ? 'pt-1em pb-0.5rem' : 'py-0.5rem'}`" border-rd="8px" dark:text="#dddddd" mb="1em" px="16px" bg="blue/10" v-html="item.interpretation" />
          <div v-if="item.exampleSentence" :class="`${hasKanji(item.interpretation) ? 'pt-1em pb-0.5rem' : 'py-0.5rem'}`" border-rd="8px" dark:text="#dddddd" bg="yellow/10" mb="1em" px="16px" v-html="item.exampleSentence" />
        </div>
      </div>
    </template>
  </div>
  <div v-else w-full flex="~" justify="center">
    <Loading dark:text="white 40px" text="40px gray-900" />
  </div>
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
