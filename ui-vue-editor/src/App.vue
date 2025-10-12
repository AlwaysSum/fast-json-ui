<template>
  <div class="app">
    <JsonUiEditor :initial-config="initialConfig" @update:config="onConfigUpdate" @export="onExport" />
    <div class="output-container" v-if="outputConfig">
      <h2>输出 JSON</h2>
      <pre>{{ outputConfig }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import JsonUiEditor from './components/JsonUiEditor.vue';
import { ComponentConfig } from 'fast-json-ui-vue';

// 初始配置
const initialConfig: ComponentConfig = {
  type: 'column',
  children: [
    {
      type: 'text',
      text: '欢迎使用 Fast-JSON-UI 编辑器'
    },
    {
      type: 'container',
      child: {
        type: 'text',
        text: '拖拽左侧组件到此处'
      },
      color: '#f0f0f0',
      padding: '16px',
      margin: '8px 0'
    }
  ]
};

// 输出配置
const outputConfig = ref<string>('');

// 配置更新事件
function onConfigUpdate(config: ComponentConfig) {
  console.log('配置已更新:', config);
}

// 导出事件
function onExport(config: ComponentConfig) {
  outputConfig.value = JSON.stringify(config, null, 2);
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.app {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.editor-container {
  height: 600px;
  margin-bottom: 20px;
}

.output-container {
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
}
</style>