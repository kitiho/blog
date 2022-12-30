---
title: Projects - Kitiho
display: Projects
subtitle: List of projects that I am proud of
description: List of projects that I am proud of
lineWave: true
projects:
  demo:
    - name: 'sekkei'
      link: 'https://sekkei.kitiho.com'
      desc: 'Try to make 100 design projects on this website'
      icon: 'i-mdi-alpha-s-circle'
    - name: 'my-vue-minesweeper'
      link: 'https://minesweeper.kitiho.com/'
      desc: 'vue minesweeper'
      icon: 'i-mdi-alpha-m-circle'
    - name: 'ki-algorithm'
      link: 'https://algo.kitiho.com/'
      desc: 'Algorithm questions collections for learning. '
      icon: 'i-mdi-alpha-a-circle'
    - name: 'map-my'
      link: 'https://map-analyze.vercel.app/'
      desc: 'Map Data Visualization'
      icon: 'i-mdi-alpha-m-circle'

      
---


<ListProjects :projects="frontmatter.projects" />

<StarsRanking />
