<script setup lang="ts">
import Kuroshiro from 'kuroshiro'

const props = defineProps<{ japanese: Record<string, any[]> }>()
const convertedObj = ref<any>({})
const loading = ref(false)

function hasKanji(str: string) {
  return Kuroshiro.Util.hasKanji(str)
}
async function convert({ mode = 'furigana', to = 'hiragana', text }: { text: string; mode?: string; to?: string }) {
  return useFetch(`${import.meta.env.VITE_APP_API_URL}/api/ruby?text=${text}&mode=${mode}&to=${to}`, {
  }).get().json()
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
    const { data } = await convert({ text: addFocusWordsTitle })
    const convertedTitle = data.value[0]
    const convertedDetailArr = []
    for (let j = 0; j < props.japanese[rawTitle].length; j++) {
      const detail = props.japanese[rawTitle][j]
      const { data: interpretationData } = await convert({ text: detail.interpretation })
      const interpretation = interpretationData.value[0]
      const { data: exampleSentenceData } = await convert({ text: detail.exampleSentence })
      const exampleSentence = exampleSentenceData.value[0]
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
          <div
            v-if="item.interpretation" :class="`${hasKanji(item.interpretation) ? 'pt-1em pb-0.5rem' : 'py-0.5rem'}`"
            border-rd="8px" dark:text="#dddddd" mb="1em" px="16px" bg="blue/10" v-html="item.interpretation"
          />
          <div
            v-if="item.exampleSentence"
            :class="`${hasKanji(item.interpretation) ? 'pt-1em pb-0.5rem' : 'py-0.5rem'}`" border-rd="8px"
            dark:text="#dddddd" bg="yellow/10" mb="1em" px="16px" v-html="item.exampleSentence"
          />
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
