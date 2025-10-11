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
