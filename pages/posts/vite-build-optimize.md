---
title: Vite Build Optimize
date: 2022-12-30T15:05:48.966Z
lang: zh
duration: 6min
---

[[toc]]

## 视图分析 Visualizer

使用vite插件(其实是rollup插件)

 [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      // 生成的文件名字
      filename: 'stats.html',
      // 标题
      title: '',
      // 直接打开文件
      open: true,
      // 生成哪种类型的图, 有以下这几种 sunburst, treemap, network, raw-data, list.
      template: 'treemap',
      // 收集gzip的大小并显示.
      gzipSize: false,
      // 收集gzip的大小并显示.
      brotliSize: false,
      // 使用rollup的emitFile生成文件 在同一个地方控制这些文件
      emitFile: false,
      // 使用sourcemap来计算大小 (e.g. after UglifyJs or Terser). 要把插件放在最后使用.
      sourcemap: false,
      // 指定一个root
      projectRoot: process.cwd(),
      // 过滤包含的和排除的
      // Filter type is { bundle?: picomatchPattern, file?: picomatchPattern }
      include: undefined,
      exclude: undefined,
    })],
})
```

生成的图,蓝色用于标记项目自己的文件,绿色用于标记依赖项。

在图中即可看出哪些文件比较大,如果是自己写的那么可能就要优化代码逻辑,如果是依赖的第三方库,就可以采用CDN形式加载,减少打包体积.

## 第三方库CDN引入

同样使用vite插件来管理CDN.
[vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)
```ts
export default {
  plugins: [
    importToCDN({
      modules: [
        autoComplete('react'),
        autoComplete('react-dom'),
        {
          name: 'react-dom',
          // A variable that will be assigned to the module in global scope, Rollup requires this
          var: 'ReactDOM',
          // Specify the load path on the CDN
          path: 'dist/index.full.js',
          // You can alternatively specify multiple style sheets which will be loaded from the CDN
          css: 'dist/index.css'
        },
      ],
    }),
  ],
}
```
有一些可以使用(autoComplete)的库
```
"react" | "react-dom" | "react-router-dom" | 
"antd" | "ahooks" | "@ant-design/charts" | 
"vue" | "vue2" | "@vueuse/shared" | 
"@vueuse/core" | "moment" | 
"eventemitter3" | "file-saver" | 
"browser-md5-file" | "xlsx | "crypto-js" |
"axios" | "lodash" | "localforage"
```

### 常用的CDN地址
- [unpkg.com](//unpkg.com)
- [cdnjs.cloudflare.com](//cdnjs.cloudflare.com)
- [jsdelivr.com](//www.jsdelivr.com)

CDN网站有时候访问不到了,我们是需要有B plan的.
另外还需要注意有些库用CDN引入之后,还需要引入其依赖的库.

## 依赖文件分包

没配置分包功能的话,打包出来的文件相对集中,且文件体积大.分包能让每个文件体积变小,并且加载的时候是并行(这里后续可以深入)

直接在vite中进行配置
```ts
export default {
  build: {
    outDir: 'dist', // 输出目录名
    minify: 'terser', // 压缩方式
    terserOptions: {
      compress: {
        drop_console: true, // 剔除console,和debugger
        drop_debugger: true,
      },
    },
    // chunkSizeWarningLimit: 1500,大文件报警阈值设置,不建议使用
    rollupOptions: {
      output: { // 静态资源分类打包
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) { // 静态资源分拆打包
          if (id.includes('node_modules'))
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
        }
      }
    }
  }
}
```
[`terser`](https://www.npmjs.com/package/terser)需要单独install一下.

这里就涉及到具体的rollup配置了,后续可以整理整理

## gzip压缩文件

使用[`vite-plugin-compression`](https://github.com/vbenjs/vite-plugin-compression)插件

```ts
import viteCompression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用,相当于开关在这里
      threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b，1b=8B, 1B=1024KB  那我们这里相当于 9kb多吧，就会压缩
      algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // 文件后缀
    })]
})
```
