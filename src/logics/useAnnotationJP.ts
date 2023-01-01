import Kuroshiro from 'kuroshiro'
import kuromoji from '~/utils/src/index.js'
import KuromojiAnalyzer from '~/utils/analyzer'

const kuroshiro = new Kuroshiro()
await kuroshiro.init(new KuromojiAnalyzer())

export function useAnnotationJP(rawStr: string) {
  const res = ref('')
  onMounted(async () => {
    res.value = await kuroshiro.convert(rawStr, { mode: 'furigana', to: 'hiragana' })
    console.log(res.value)
  })
  return {
    html: res,
  }
}
