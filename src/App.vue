<script setup lang="ts">
useHead({
  meta: [
    { property: 'og:title', content: 'Kitiho' },
    { property: 'og:image', content: 'https://antfu.me/og-icon.png' },
    { name: 'description', content: 'Kitiho\'s Portfolio' },
  ],
})
</script>

<template>
  <NavBar />
  <main class="px-7 py-10">
    <router-view />
    <Footer />
  </main>
</template>
