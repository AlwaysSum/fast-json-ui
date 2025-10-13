<template>
  <div class="app">
    <JsonUiEditor :initial-config="initialConfig" @update:config="onConfigUpdate" @export="onExport" />
    <!-- 导出结果弹窗 -->
    <div v-if="showExportDialog" class="modal-backdrop" @click.self="closeExportDialog">
      <div class="modal">
        <div class="modal-header">
          <h3>导出 JSON</h3>
          <button class="close-btn" @click="closeExportDialog">×</button>
        </div>
        <div class="modal-body">
          <pre>{{ outputConfig }}</pre>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="copyToClipboard">复制到剪贴板</button>
          <button class="btn primary" @click="closeExportDialog">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// 由于 IDE 类型检查对 .vue SFC 默认导出识别不一致，这里添加说明性抑制注释
// @ts-expect-error SFC default export is provided via shims-vue.d.ts
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
const showExportDialog = ref<boolean>(false);

// 配置更新事件
function onConfigUpdate(config: ComponentConfig) {
  console.log('配置已更新:', config);
}

// 导出事件
function onExport(config: ComponentConfig) {
  outputConfig.value = JSON.stringify(config, null, 2);
  showExportDialog.value = true;
}

function closeExportDialog() {
  showExportDialog.value = false;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputConfig.value);
    alert('已复制到剪贴板');
  } catch (e) {
    console.error('复制失败', e);
    alert('复制失败，请手动复制');
  }
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

/* 弹窗样式 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  overflow: auto;
}

.modal-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
}

.btn.primary {
  background: #4a90e2;
  color: #fff;
  border-color: #4a90e2;
}
</style>