<script setup lang="ts">
import { isDark } from '~/logics'
</script>

<template>
  <header class="header z-40">
    <router-link
      class="w-10 h-10 absolute lg:fixed m-6 select-none outline-none"
      to="/"
      focusable="false"
    >
      <!-- <Logo text="40px gray-900" dark:text-gray-1 /> -->
      <!-- <Logo2 text="50px gray-900" dark:text-gray-1 /> -->
      <!-- <Logo3 text="50px gray-900" dark:text-gray-1 /> -->
      <!-- <Logo4 text="50px gray-900" dark:text-gray-1 /> -->
      <Logo5 text="50px gray-900" dark:text-gray-1 />
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts" title="Posts">
          <span class="lt-md:hidden">Posts</span>
          <div i-ri-article-line md:hidden />
        </router-link>
        <router-link to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </router-link>
        <router-link to="/japanese" title="日本語">
          <span class="lt-md:hidden">日本語</span>
          <div i-uil-letter-japanese-a class="md:hidden" />
        </router-link>
        <router-link to="/bookmarks" title="Bookmarks">
          <span class="lt-md:hidden">Bookmarks</span>
          <div i-ri-bookmark-line class="md:hidden" />
        </router-link>
        <router-link to="/notes" title="Notes">
          <span class="lt-md:hidden">Notes</span>
          <div i-ri-sticky-note-line class="md:hidden" />
        </router-link>
        <a href="https://twitter.com/enoshima73" target="_blank" title="Twitter" class="lt-md:hidden">
          <feather-twitter />
        </a>
        <a href="https://github.com/kitiho" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
