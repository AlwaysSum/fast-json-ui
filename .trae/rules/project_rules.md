---
description: 
globs: 
alwaysApply: false
---
# Fast JSON UI 项目结构规则

本项目为 Fast JSON UI，包含以下主要目录和作用：

- [ui-vue/](mdc:ui-vue)：核心 UI 组件库，包含各类 JSON UI 组件实现（如 Button、Row、Column 等），以及类型定义和工具方法。
- [ui-vue-editor/](mdc:ui-vue-editor)：可视化编辑器，基于核心组件库，提供拖拽、属性编辑等功能。
- [demo/vue-demo/](mdc:demo/vue-demo)：Vue 示例项目，演示如何集成和使用 UI 组件库。
- [document-site/](mdc:document-site)：文档站点，包含组件、用法、示例等文档，便于开发者查阅。
- [doc/](mdc:doc)：多语言 README 及说明文档。
- [scripts/](mdc:scripts)：脚本目录，存放自动化或构建相关脚本。

根目录下 [README.md](mdc:README.md) 提供了项目的整体介绍和快速上手说明。




---
description: 
globs: 
alwaysApply: false
---
# [ui-vue/](mdc:ui-vue) 目录结构规则

- [src/](mdc:ui-vue/src)：核心源码目录。
  - [components/](mdc:ui-vue/src/components)：UI 组件实现，widgets 子目录包含各类基础组件（如 Button、Row、Column、Text 等），FastJsonWidget.vue 为主入口组件。
  - [types/](mdc:ui-vue/src/types)：类型定义文件。
  - [utils/](mdc:ui-vue/src/utils)：工具函数。
  - [index.ts](mdc:ui-vue/src/index.ts)：对外导出入口。
- [package.json](mdc:ui-vue/package.json)：包管理与依赖声明。
- [README.md](mdc:ui-vue/README.md)：该包的说明文档。

本目录为 Fast JSON UI 的核心组件库，供外部项目和编辑器复用。


---
description: 
globs: 
alwaysApply: false
---
# Fast JSON UI 项目结构规则

本项目为 Fast JSON UI，包含以下主要目录和作用：

- [ui-vue/](mdc:ui-vue)：核心 UI 组件库，包含各类 JSON UI 组件实现（如 Button、Row、Column 等），以及类型定义和工具方法。
- [ui-vue-editor/](mdc:ui-vue-editor)：可视化编辑器，基于核心组件库，提供拖拽、属性编辑等功能。
- [demo/vue-demo/](mdc:demo/vue-demo)：Vue 示例项目，演示如何集成和使用 UI 组件库。
- [document-site/](mdc:document-site)：文档站点，包含组件、用法、示例等文档，便于开发者查阅。
- [doc/](mdc:doc)：多语言 README 及说明文档。
- [scripts/](mdc:scripts)：脚本目录，存放自动化或构建相关脚本。

根目录下 [README.md](mdc:README.md) 提供了项目的整体介绍和快速上手说明。


---
description: 
globs: 
alwaysApply: false
---
# [document-site/](mdc:document-site) 目录结构规则

- [docs/](mdc:document-site/docs)：文档内容主目录。
  - [guide/](mdc:document-site/docs/guide)：使用指南、安装、基础用法等文档。
  - [components/](mdc:document-site/docs/components)：各 UI 组件的详细文档。
  - [examples/](mdc:document-site/docs/examples)：示例和案例文档。
  - [index.md](mdc:document-site/docs/index.md)：文档首页。
- [deploy.sh](mdc:document-site/deploy.sh)：文档站点部署脚本。
- [package.json](mdc:document-site/package.json)：依赖声明。
- [README.md](mdc:document-site/README.md)：说明文档。

本目录为 Fast JSON UI 的文档站点，包含组件、用法、示例等内容，便于开发者查阅。


---
description: 
globs: 
alwaysApply: false
---
# [doc/](mdc:doc) 目录结构规则

- [README.en-US.md](mdc:doc/README.en-US.md)：英文版项目说明。
- [README.zh-CN.md](mdc:doc/README.zh-CN.md)：中文版项目说明。

本目录用于存放多语言的项目说明文档。


---
description: 
globs: 
alwaysApply: false
---
# [demo/vue-demo/](mdc:demo/vue-demo) 目录结构规则

- [src/](mdc:demo/vue-demo/src)：示例源码。
  - [examples/](mdc:demo/vue-demo/src/examples)：不同用法的示例组件（如 BasicExample、AdvancedExample、EditorExample）。
  - [components/](mdc:demo/vue-demo/src/components)：演示用的自定义组件。
  - [App.vue](mdc:demo/vue-demo/src/App.vue)：主应用入口。
  - [main.ts](mdc:demo/vue-demo/src/main.ts)：入口文件。
- [package.json](mdc:demo/vue-demo/package.json)：依赖声明。
- [README.md](mdc:demo/vue-demo/README.md)：说明文档。

本目录为 UI 组件库的 Vue 示例项目，便于开发者参考集成和用法。
