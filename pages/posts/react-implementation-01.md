---
title: React Implementation 001 Project Init and JSX
date: 2023-02-04
lang: zh
duration: 6min
---

[[toc]]

> Github [kitiho-react](https://github.com/kitiho/kitiho-react)

### 1. 项目搭建

使用`pnpm`的`workspace`特性搭建`monorepo`仓库。

```yaml
packages:
  - 'packages/*'
```

使用`eslint`规范代码风格化，这里我采用了自己的`eslint`规范

```sh
pnpm i -D -w eslint @kitiho/eslint-config
```

使用[husky](https://typicode.github.io/husky/#/)和[commitlint](https://commitlint.js.org/)搭建`lint`和`commit`规范化。

> 有一些具体操作见官网

```sh
pnpm i -D -w husky commitlint @commitlint/cli @commitlint/config-conventional 
```

### 2. `jsx`转换

`jsx`会被`babel`编译成这样。
```js
// <div>hello</div>

import { jsx as _jsx } from 'react/jsx-runtime'
/* #__PURE__ */ _jsx('div', {
  children: 'hello'
})
```

会用到一个`jsx`函数，我们就需要去实现这个`jsx`函数。这个函数将会返回ReactElement数据结构。

所以我们现在需要一个创建`ReactElement`的函数，和一个`jsx`函数。

```ts
export const ReactElement = function (type: ElementType, key: Key, ref: Ref, props: Props): IReactElement {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    key,
    ref,
    props,
    type,
    __mark: 'kitiho',
  }
  return element
}
```

```ts
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  const props: Props = {}
  let key: Key = null
  let ref: Ref = null

  for (const prop in config) {
    const val = config[prop]
    if (prop === 'key') {
      if (val !== undefined)
        key = `${val}`
      continue
    }

    if (prop === 'ref') {
      if (val !== undefined)
        ref = val
      continue
    }

    // 判断是不是config自己的prop 而不是原型的prop
    if ({}.hasOwnProperty.call(config, prop))
      props[prop] = val
  }

  const maybeChildrenLength = maybeChildren.length
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1)
      props.children = maybeChildrenLength[0]
    else
      props.children = maybeChildrenLength
  }

  return ReactElement(type, key, ref, props)
}
```
>  开发环境的`jsx`跟生产环境的`jsx`函数有所不同，还有一个`jsxDEV`，就是把`maybeChildren`给去掉，

### 3. rollup打包

这里创建了一些工具方法，去拿到`package.json`的数据啊，路径啊，细节就不多说。

```js
import generatePkgJson from 'rollup-plugin-generate-package-json'
import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'
const { name, module } = getPackageJSON('react')
const pkgPath = resolvePkgPath(name)
const pkgDistPath = resolvePkgPath(name, true)
export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins({ typescript: {} }),
      // 生成package.json
      generatePkgJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({ name, description, version, main: 'index.js' }),
      }),
    ],
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd',
      },
    ],
    plugins: [
      ...getBaseRollupPlugins({ typescript: {} }),
    ],
  },
]

export function getBaseRollupPlugins({
  typescript = {},
}) {
  return [cjs(), ts(typescript)]
}
```

这里打包出来的有`index.js`，`jsx-runtime.js`，`jsx-dev-runtime.js`，以及`package.json`。

`getBaseRollupPlugins`是获得一些基础插件，`commonjs`和`typescript`用到的插件。

打完包就可以使用`pnpm link --global`来调试。
