---
title: Notes - Kitiho
display: Notes
subtitle: 一些代码片段,笔记
description: 一些代码片段,笔记
lineWave: true
---

<article>

## CustomRequest

_2023/02/09_

```ts
async function customRequest(option) {
  const { onProgress, onError, onSuccess, fileItem, name } = option
  const prefix = `avatar-${new Date().getTime()}`
  const fmData = new FormData()
  fmData.append('Path', user.value.id!)
  fmData.append('Object', `${prefix}-${fileItem.name}`)
  fmData.append('Overwrite', 'true')
  fmData.append('File', fileItem.file)
  const res = await postFilesPublic({
    formData: fmData,
  })
  await postChangeAvatar({
    avatarUrl: `${import.meta.env.VITE_APP_API}/api/files/public/p/${res.path}${res.name}`,
  })
  await appStore.getUser()
}

/**
 * 上传文件
 */
export function postFilesPublic({
  formData,
  handleProgress,
}: {
  formData: FormData
  handleProgress?: (e: any) => void
}) {
  return http.post('/api/files/public', formData, {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: handleProgress,
  })
}
```


## Typescript Library `tsconfig.json`

_2023/01/19_

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "esnext",
    "lib": ["esnext"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true
  }
}
```
## 封装axios示例

_2022/12/12_

```ts
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
export interface Result<T = any> {
  code: number
  message: string
  result: T
}
const service: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API}`,
  timeout: 30000,
})

/* 请求拦截器 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers!.Authorization = `Bearer ${token}`
  return config
}, (error: AxiosError) => {
  Message.error(error.message)
  return Promise.reject(error)
})

/* 响应拦截器 */
service.interceptors.response.use((response: AxiosResponse) => {
  const { code, message, result } = response.data

  // 根据自定义错误码判断请求是否成功
  if (code === '0') {
    // 将组件用的数据返回
    return result
  }
  else {
    // 处理业务错误。
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, (error: AxiosError) => {
  // 处理 HTTP 网络错误
  let message = ''
  // HTTP 状态码
  const status = error.response?.status
  switch (status) {
    case 401:
      message = 'token 失效，请重新登录'
      // 这里可以触发退出的 action
      //   router.replace({
      //     path: '/login',
      //     query: {
      //       redirect: router.currentRoute.fullPath
      //     }
      //   });
      break
    case 403:
      message = '登录过期，请重新登录'
      //   localStorage.removeItem('token');
      //   setTimeout(() => {
      //     router.replace({
      //       path: '/login',
      //       query: {
      //         redirect: router.currentRoute.fullPath
      //       }
      //     });
      //   }, 1000);
      break
    case 404:
      message = '请求地址错误'
      break
    case 500:
      message = '服务器故障'
      break
    default:
      message = '网络连接故障'
  }

  Message.error(message)
  return Promise.reject(error)
})

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}
```


</article>
<article>

## VSCode Setting.json

_2022/12/30_

```json
{
  // Visuals
  "workbench.colorTheme": "One Dark Pro",
  "workbench.preferredDarkColorTheme": "One Dark Pro",
  "workbench.preferredLightColorTheme": "One Dark Pro",
  "workbench.iconTheme": "file-icons",
  "workbench.fontAliasing": "antialiased",
  "editor.fontFamily": "Input Mono, Fira Code, monospace",
  "editor.fontLigatures": "'ss01', 'ss02', 'ss03', 'ss06', 'zero'",

  // Editor
  "editor.accessibilitySupport": "off",
  "editor.cursorSmoothCaretAnimation": true,
  "editor.find.addExtraSpaceOnTop": false,
  "editor.guides.bracketPairs": "active",
  "editor.inlineSuggest.enabled": true,
  "editor.lineNumbers": "interval",
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.renderWhitespace": "boundary",
  "editor.suggestSelection": "first",
  "editor.tabSize": 2,
  "editor.unicodeHighlight.invisibleCharacters": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true, // this allows ESLint to auto fix on save
    "source.organizeImports": false
  },
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "window.autoDetectColorScheme": true,
  "window.dialogStyle": "custom",
  "window.nativeTabs": true, // this is great, macOS only
  "window.titleBarStyle": "custom",
  "workbench.editor.closeOnFileDelete": true,
  "workbench.editor.highlightModifiedTabs": true,
  "workbench.editor.tabCloseButton": "left",
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.perEditorGroup": true,
  "workbench.editor.limit.value": 5,
  "workbench.list.smoothScrolling": true,
  "workbench.sideBar.location": "right",
  "workbench.tree.expandMode": "singleClick",
  "workbench.tree.indent": 10,
  "extensions.autoUpdate": "onlyEnabledExtensions",
  "extensions.ignoreRecommendations": true,
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.simpleDialog.enable": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.untrackedChanges": "separate",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.fontWeight": "300",
  "terminal.integrated.persistentSessionReviveProcess": "never",
  "terminal.integrated.fontFamily": "MesloLGS NF, monospace",
  "terminal.integrated.tabs.enabled": true,
  "scm.diffDecorationsGutterWidth": 2,
  "debug.onTaskErrors": "debugAnyway",
  "diffEditor.ignoreTrimWhitespace": false,
  "search.exclude": {
    "**/.git": true,
    "**/.github": true,
    "**/.nuxt": true,
    "**/.output": true,
    "**/.pnpm": true,
    "**/.vscode": true,
    "**/.yarn": true,
    "**/bower_components": true,
    "**/dist/**": true,
    "**/logs": true,
    "**/node_modules": true,
    "**/out/**": true,
    "**/package-lock.json": true,
    "**/pnpm-lock.yaml": true,
    "**/tmp": true,
    "**/yarn.lock": true
  },

  // Extension configs
  "emmet.showSuggestionsAsSnippets": true,
  "emmet.triggerExpansionOnTab": false,
  "errorLens.enabledDiagnosticLevels": [
    "warning",
    "error"
  ],
  "errorLens.excludeBySource": [
    "cSpell",
    "Grammarly",
    "eslint"
  ],
  // ESLint config: https://github.com/antfu/eslint-config
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  "eslint.quiet": true,
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "json5"
  ],
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": false,
    "yaml": false
  },
  "cSpell.allowCompoundWords": true,
  "cSpell.language": "en,en-US",
  "css.lint.hexColorLength": "ignore",
  "gitlens.codeLens.authors.enabled": false,
  "gitlens.codeLens.enabled": false,
  "gitlens.codeLens.recentChange.enabled": false,
  "gitlens.menus": {
    "editor": {
      "blame": false,
      "clipboard": true,
      "compare": true,
      "history": false,
      "remote": false
    },
    "editorGroup": {
      "blame": true,
      "compare": false
    },
    "editorTab": {
      "clipboard": true,
      "compare": true,
      "history": true,
      "remote": true
    },
    "explorer": {
      "clipboard": true,
      "compare": true,
      "history": true,
      "remote": true
    },
    "scm": {
      "authors": true
    },
    "scmGroup": {
      "compare": true,
      "openClose": true,
      "stash": true
    },
    "scmGroupInline": {
      "stash": true
    },
    "scmItem": {
      "clipboard": true,
      "compare": true,
      "history": true,
      "remote": false,
      "stash": true
    }
  },
  "iconify.annotations": true,
  "iconify.inplace": true,
  "svg.preview.mode": "svg",
  "volar.autoCompleteRefs": false,
  "volar.codeLens.pugTools": false,
  "volar.codeLens.scriptSetupTools": true,
  "volar.completion.preferredTagNameCase": "pascal",
  "windicss.enableCodeFolding": false,
  "prettier.enable": false, // I only use Prettier for manually formatting
  "prettier.printWidth": 200,
  "prettier.semi": false,
  "prettier.singleQuote": true,

  // File Nesting
  // this might not be up to date with the repo, please check yourself
  // updated 2022-07-12 03:35
  // https://github.com/antfu/vscode-file-nesting-config
  "explorer.fileNesting.enabled": false,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "//": "Last update at 2022/8/2 10:48:52",
    "*.asax": "$(capture).*.cs, $(capture).*.vb",
    "*.ascx": "$(capture).*.cs, $(capture).*.vb",
    "*.ashx": "$(capture).*.cs, $(capture).*.vb",
    "*.aspx": "$(capture).*.cs, $(capture).*.vb",
    "*.bloc.dart": "$(capture).event.dart, $(capture).state.dart",
    "*.c": "$(capture).h",
    "*.cc": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.component.ts": "$(capture).component.html, $(capture).component.spec.ts, $(capture).component.css, $(capture).component.scss, $(capture).component.sass, $(capture).component.less",
    "*.cpp": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.cshtml": "$(capture).cshtml.cs",
    "*.csproj": "*.config, *proj.user, appsettings.*, bundleconfig.json",
    "*.css": "$(capture).css.map, $(capture).*.css",
    "*.cxx": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.dart": "$(capture).freezed.dart, $(capture).g.dart",
    "*.ex": "$(capture).html.eex, $(capture).html.heex, $(capture).html.leex",
    "*.java": "$(capture).class",
    "*.js": "$(capture).js.map, $(capture).*.js, $(capture)_*.js",
    "*.jsx": "$(capture).js, $(capture).*.jsx, $(capture)_*.js, $(capture)_*.jsx",
    "*.master": "$(capture).*.cs, $(capture).*.vb",
    "*.module.ts": "$(capture).resolver.ts, $(capture).controller.ts, $(capture).service.ts",
    "*.pubxml": "$(capture).pubxml.user",
    "*.resx": "$(capture).*.resx, $(capture).designer.cs, $(capture).designer.vb",
    "*.tex": "$(capture).acn, $(capture).acr, $(capture).alg, $(capture).aux, $(capture).bbl, $(capture).blg, $(capture).fdb_latexmk, $(capture).fls, $(capture).glg, $(capture).glo, $(capture).gls, $(capture).idx, $(capture).ind, $(capture).ist, $(capture).lof, $(capture).log, $(capture).lot, $(capture).out, $(capture).pdf, $(capture).synctex.gz, $(capture).toc, $(capture).xdv",
    "*.ts": "$(capture).js, $(capture).d.ts.map, $(capture).*.ts, $(capture)_*.js, $(capture)_*.ts",
    "*.tsx": "$(capture).ts, $(capture).*.tsx, $(capture)_*.ts, $(capture)_*.tsx",
    "*.vbproj": "*.config, *proj.user, appsettings.*, bundleconfig.json",
    "*.vue": "$(capture).*.ts, $(capture).*.js",
    "*.xaml": "$(capture).xaml.cs",
    ".clang-tidy": ".clang-format, .clangd, compile_commands.json",
    ".env": "*.env, .env.*, .envrc, env.d.ts",
    ".gitignore": ".gitattributes, .gitmodules, .gitmessage, .mailmap, .git-blame*",
    ".project": ".classpath",
    "BUILD.bazel": "*.bzl, *.bazel, *.bazelrc, bazel.rc, .bazelignore, .bazelproject, WORKSPACE",
    "CMakeLists.txt": "*.cmake, *.cmake.in, .cmake-format.yaml, CMakePresets.json",
    "artisan": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, server.php, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, webpack.mix.js, windi.config.*",
    "astro.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "cargo.toml": ".clippy.toml, .rustfmt.toml, cargo.lock, clippy.toml, cross.toml, rust-toolchain.toml, rustfmt.toml",
    "composer.json": ".php*.cache, composer.lock, phpunit.xml*, psalm*.xml",
    "default.nix": "shell.nix",
    "deno.json*": "*.env, .env.*, .envrc, api-extractor.json, env.d.ts, import-map.json, import_map.json, jsconfig.*, tsconfig.*, tsdoc.*",
    "dockerfile": ".dockerignore, docker-compose.*, dockerfile*",
    "flake.nix": "flake.lock",
    "gatsby-config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, gatsby-browser.*, gatsby-node.*, gatsby-ssr.*, gatsby-transformer.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "gemfile": ".ruby-version, gemfile.lock",
    "go.mod": ".air*, go.sum",
    "mix.exs": ".credo.exs, .dialyzer_ignore.exs, .formatter.exs, .iex.exs, .tool-versions, mix.lock",
    "next.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, next-env.d.ts, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "nuxt.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "package.json": ".browserslist*, .circleci*, .codecov, .commitlint*, .cz-config.js, .czrc, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitpod*, .huskyrc*, .jslint*, .lighthouserc.*, .lintstagedrc*, .markdownlint*, .mocha*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .releaserc*, .sentry*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .versionrc*, .vscode*, .watchman*, .xo-config*, .yamllint*, .yarnrc*, Procfile, api-extractor.json, apollo.config.*, appveyor*, ava.config.*, azure-pipelines*, bower.json, build.config.*, commitlint*, crowdin*, cypress.*, dangerfile*, dprint.json, firebase.json, grunt*, gulp*, jasmine.*, jenkins*, jest.config.*, jsconfig.*, karma*, lerna*, lighthouserc.*, lint-staged*, nest-cli.*, netlify*, nodemon*, nx.*, package-lock.json, package.nls*.json, phpcs.xml, playwright.config.*, pm2.*, pnpm*, prettier*, pullapprove*, puppeteer.config.*, pyrightconfig.json, release-tasks.sh, renovate*, rollup.config.*, stylelint*, tsconfig.*, tsdoc.*, tslint*, tsup.config.*, turbo*, typedoc*, unlighthouse*, vercel*, vetur.config.*, vitest.config.*, webpack*, workspace.json, xo.config.*, yarn*",
    "pubspec.yaml": ".metadata, .packages, all_lint_rules.yaml, analysis_options.yaml, build.yaml, pubspec.lock",
    "pyproject.toml": ".pdm.toml, pdm.lock, pyproject.toml",
    "quasar.conf.js": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, quasar.extensions.json, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "readme*": "authors, backers*, changelog*, citation*, code_of_conduct*, codeowners, contributing*, contributors, copying, credits, governance.md, history.md, license*, maintainers, readme*, security.md, sponsors*",
    "remix.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, remix.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "rush.json": ".browserslist*, .circleci*, .codecov, .commitlint*, .cz-config.js, .czrc, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitpod*, .huskyrc*, .jslint*, .lighthouserc.*, .lintstagedrc*, .markdownlint*, .mocha*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .releaserc*, .sentry*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .versionrc*, .vscode*, .watchman*, .xo-config*, .yamllint*, .yarnrc*, Procfile, api-extractor.json, apollo.config.*, appveyor*, ava.config.*, azure-pipelines*, bower.json, build.config.*, commitlint*, crowdin*, cypress.*, dangerfile*, dprint.json, firebase.json, grunt*, gulp*, jasmine.*, jenkins*, jest.config.*, jsconfig.*, karma*, lerna*, lighthouserc.*, lint-staged*, nest-cli.*, netlify*, nodemon*, nx.*, package-lock.json, package.nls*.json, phpcs.xml, playwright.config.*, pm2.*, pnpm*, prettier*, pullapprove*, puppeteer.config.*, pyrightconfig.json, release-tasks.sh, renovate*, rollup.config.*, stylelint*, tsconfig.*, tsdoc.*, tslint*, tsup.config.*, turbo*, typedoc*, unlighthouse*, vercel*, vetur.config.*, vitest.config.*, webpack*, workspace.json, xo.config.*, yarn*",
    "shims.d.ts": "*.d.ts",
    "svelte.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, mdsvex.config.js, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "vite.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "vue.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*"
  },
  "[markdown]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "editor.fontSize": 14,
  "editor.lineHeight": 26,
  "[scss]": {
    "editor.defaultFormatter": "sibiraj-s.vscode-scss-formatter"
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "[css]": {
    "editor.defaultFormatter": "sibiraj-s.vscode-scss-formatter"
  },
  "redhat.telemetry.enabled": true,
  "cSpell.userWords": [
    "gsap",
    "Kitiho",
    "lerp"
  ],
  "glsl-linter.validatorPath": "/usr/local/bin/glslangValidator",

  // vim
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-f>": false
  }
}
```


</article>
