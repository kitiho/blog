<script lang="ts">
import type { PropType, VNode } from 'vue'
import { isJapanese } from '~/logics/japaneseUtil'
import { useAnnotation } from '~/logics/useAnnotation'
export default {
  props: {
    title: {
      type: String,
    },
    words: {
      type: Array as PropType<String[]>,
      default: () => [],
    },
  },
  emits: ['onMouseInWord', 'onMouseLeaveWord'],
  setup(props, ctx) {
    let str = props.title
    props.words.forEach((word) => {
      str = str!.replace(`${word}`, `<span>${word}</span>`)
    })
    const { data, isFinished } = useAnnotation(str!)
    const html = computed(() => data.value?.[0])
    const vnode = ref<VNode[]>([])
    const domReg = /(?<=(<span[^>]*?>)).*?(?=(<\/span>))/g
    const bracketReg = /\((.+?)\)/g

    watch(() => html.value, (e) => {
      const wordSpanArr = e.match(domReg).map((v: string) => {
        return h('span', {
          class: 'bg-red/30 underline cursor-pointer',
          innerHTML: v,
          onmouseenter: () => {
            v = v.replace(bracketReg, '')
            let res = ''
            for (const char of v) {
              if (isJapanese([char]))
                res = res.concat(char)
            }
            ctx.emit('onMouseInWord', res)
          },
          onmouseleave: () => {
            ctx.emit('onMouseLeaveWord')
          },
        })
      })
      const otherNodeArr = e.replace(domReg, '$').replaceAll('<span>$</span>', '$').split('$').map((v: string) => h('span', { innerHTML: v }))
      otherNodeArr.forEach((v: VNode, index: number) => {
        vnode.value.push(v)
        if (wordSpanArr[index])
          vnode.value.push(wordSpanArr[index])
      })
    })
    return () => h('h2', { class: 'border-gray/30 border-b-4px pb-10px' }, ...vnode.value)
  },
}
</script>

