<template>
  <div class="editor-example">
    <h2>JSON UI 编辑器示例</h2>
    <p>使用拖拽方式创建 UI 组件，并生成对应的 JSON 配置</p>
    
    <div class="editor-container">
      <json-ui-editor 
        :initial-config="initialConfig"
        @update:config="onConfigUpdate"
        @export="onExport"
      />
    </div>
    
    <div class="output-section">
      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-container">
          <fast-json-widget :config="currentConfig" :data="previewData" :methods="previewMethods" />
        </div>
      </div>
      
      <div class="json-section">
        <h3>生成的 JSON</h3>
        <div class="json-container">
          <pre>{{ formattedJson }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { JsonUiEditor } from 'fast-json-ui-editor';
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
      color: '#f5f5f5',
      padding: '16px',
      margin: '8px 0'
    }
  ]
};

// 当前配置
const currentConfig = ref<ComponentConfig>(JSON.parse(JSON.stringify(initialConfig)));

// 预览数据
const previewData = ref({
  username: 'User123',
  items: ['Item 1', 'Item 2', 'Item 3'],
  isLoggedIn: true
});

// 预览方法
const previewMethods = ref({
  handleClick: () => {
    alert('按钮被点击了！');
  }
});

// 格式化的 JSON
const formattedJson = computed(() => {
  return JSON.stringify(currentConfig.value, null, 2);
});

// 配置更新事件
function onConfigUpdate(config: ComponentConfig) {
  currentConfig.value = config;
}

// 导出事件
function onExport(config: ComponentConfig) {
  console.log('导出配置:', config);
  // 可以在这里添加导出到文件的逻辑
}
</script>

<style scoped>
.editor-example {
  padding: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 8px;
}

p {
  margin-top: 0;
  margin-bottom: 24px;
  color: #666;
}

.editor-container {
  height: 500px;
  margin-bottom: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.output-section {
  display: flex;
  gap: 24px;
}

.preview-section,
.json-section {
  flex: 1;
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
}

.preview-container,
.json-container {
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 14px;
}
</style> 