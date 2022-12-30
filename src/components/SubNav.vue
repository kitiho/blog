<script setup lang="ts">
import { useRoute } from 'vue-router'

const inactiveStyle = 'opacity-20 hover:opacity-50'

const route = useRoute()
</script>

<template>
  <div class="prose m-auto mb-8 select-none">
    <div mb-0 flex="~ gap2 sm:gap3 wrap" text-xl sm:text-3xl>
      <router-link to="/posts" class="!border-none !font-400" :class="route.path === '/posts' ? '' : inactiveStyle">
        Posts
      </router-link>
    </div>
  </div>
</template>
