<script setup lang="ts">
import gsap from 'gsap'
import { useAnnotation } from '~/logics/useAnnotation'
const props = defineProps<{
  visible: boolean
  wordData: any
}>()
const element = ref()
function onMouseMove(e) {
  if (element.value) {
    gsap.to(element.value, {
      duration: 0.4,
      x: e.clientX + 18,
      y: e.clientY - 18,
    })
  }
}
const title = ref('')
const interpretation = ref('')
const loading = ref(false)
// const isFinished = ref(false)
addEventListener('mousemove', onMouseMove)
watch(() => props.visible, async (e) => {
  if (props.visible && props.wordData.name) {
    loading.value = true
    const { data } = await useAnnotation(props.wordData.name)
    title.value = data.value?.[0]
    if (props.wordData.interpretation) {
      const { data: data2 } = await useAnnotation(props.wordData.interpretation)
      interpretation.value = data2.value?.[0]
    }
    loading.value = false
  }
})
</script>

<template>
  <div
    ref="element" fixed top-0 left-0 z-99999 pointer-events-none transition="duration-75"
    :style="{
      opacity: `${visible ? '1' : '0'}`,
    }"
    class="bg-gray-400/90 border-rd-6px max-w-30em p-10px text-black"
  >
    <div v-if="!loading" class="text-1.4em border-b-1px border-gray-800 mb-0.5em" v-html="title" />
    <div w-8em flex="~" justify="center" py="4px">
      <Loading v-if="loading" dark:text="white 40px" text="40px gray-900" />
    </div>
    <div v-if="wordData?.zhcn && !loading">
      【释义】{{ wordData?.zhcn }}
    </div>
    <div v-if="wordData?.interpretation && !loading" v-html="interpretation" />
    <div v-if="wordData?.exampleSentence && !loading" class="text-0.9em text-gray-700">
      ● {{ wordData?.exampleSentence }}
    </div>
  </div>
</template>

<style scoped>

</style>
