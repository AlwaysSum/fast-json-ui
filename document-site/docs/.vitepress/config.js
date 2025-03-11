export default {
  title: 'Fast-JSON-UI',
  description: '将 JSON 配置转换为 UI 组件的 Vue 3 库',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/fast-json-ui/',
  ignoreDeadLinks: true,
  
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Fast-JSON-UI',
      description: '将 JSON 配置转换为 UI 组件的 Vue 3 库',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Fast-JSON-UI',
      description: 'A Vue 3 library for converting JSON configurations to UI components',
      link: '/en/'
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '示例', link: '/examples/' },
      {
        text: '1.0.0',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com/AlwaysSum/fast-json-ui' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '基本用法', link: '/guide/basic-usage' },
            { text: '数据绑定', link: '/guide/data-binding' },
            { text: '方法绑定', link: '/guide/method-binding' },
            { text: '自定义组件', link: '/guide/custom-components' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: '概述', link: '/components/' },
            { text: 'Text 文本', link: '/components/text' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Test 测试', link: '/components/test' }
          ]
        },
        {
          text: '布局组件',
          items: [
            { text: 'Container 容器', link: '/components/container' },
            { text: 'Row 行布局', link: '/components/row' },
            { text: 'Column 列布局', link: '/components/column' },
            { text: 'Stack 堆叠布局', link: '/components/stack' }
          ]
        },
        {
          text: '计划中的组件',
          items: [
            { text: '表单组件', link: '/components/form-components' },
            { text: '高级布局', link: '/components/advanced-layout' },
            { text: '高级组件', link: '/components/advanced-components' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础示例', link: '/examples/' },
            { text: '表单示例', link: '/examples/form' },
            { text: '布局示例', link: '/examples/layout' },
            { text: '自定义组件示例', link: '/examples/custom' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AlwaysSum/fast-json-ui' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Fast-JSON-UI Contributors'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    }
  }
} 