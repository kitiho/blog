export function useAnnotation(str: string) {
  return useFetch(`${import.meta.env.VITE_APP_API_URL}/api/ruby?text=${str}&mode=furigana&to=hiragana`, {
    immediate: true,
  }).get().json()
}
