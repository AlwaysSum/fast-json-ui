<template>
  <div class="editor-example">
    <div style="margin-bottom: 16px">
      <button class="dialog-btn" @click="showPreviewDialog">
        预览渲染效果
      </button>
    </div>
    <div class="editor-container">
      <json-ui-editor
        :initial-config="initialConfig"
        @update:config="onConfigUpdate"
        @export="onExport"
      />
    </div>
    <dialog v-if="dialogVisible" class="custom-dialog" open>
      <div class="dialog-header">
        <span v-if="dialogType === 'json'">导出 JSON</span>
        <span v-else-if="dialogType === 'preview'">组件预览</span>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>
      <div class="dialog-body">
        <vue-json-pretty
          v-if="dialogType === 'json'"
          :data="dialogJson"
          :deep="3"
          :showLine="true"
          :showIcon="true"
          style="max-height: 60vh; overflow:auto;"
        />
        <div v-else-if="dialogType === 'preview'" class="preview-container">
          <fast-json-widget
            :config="currentConfig"
            :data="previewData"
            :methods="previewMethods"
          />
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { JsonUiEditor } from "fast-json-ui-editor";
import { ComponentConfig } from "fast-json-ui-vue";

// 初始配置
const initialConfig: ComponentConfig = {
  type: "column",
  children: [
    {
      type: "text",
      text: "欢迎使用 Fast-JSON-UI 编辑器",
    },
    {
      type: "container",
      child: {
        type: "text",
        text: "拖拽左侧组件到此处",
      },
      color: "#f5f5f5",
      padding: "16px",
      margin: "8px 0",
    },
  ],
};

// 当前配置
const currentConfig = ref<ComponentConfig>(
  JSON.parse(JSON.stringify(initialConfig))
);

// 预览数据
const previewData = ref({
  username: "User123",
  items: ["Item 1", "Item 2", "Item 3"],
  isLoggedIn: true,
});

// 预览方法
const previewMethods = ref({
  handleClick: () => {
    alert("按钮被点击了！");
  },
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogType = ref<"json" | "preview">("json");
const dialogJson = ref<any>(null);

const formattedDialogJson = computed(() => {
  return JSON.stringify(dialogJson.value, null, 2);
});

function closeDialog() {
  dialogVisible.value = false;
}

function showPreviewDialog() {
  dialogType.value = "preview";
  dialogVisible.value = true;
}

// 配置更新事件
function onConfigUpdate(config: ComponentConfig) {
  currentConfig.value = config;
}

// 导出事件
function onExport(config: ComponentConfig) {
  dialogType.value = "json";
  dialogJson.value = config;
  dialogVisible.value = true;
}
</script>

<style scoped>
.editor-example {
  padding: 20px;
}

.editor-container {
  height: 500px;
  margin-bottom: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
}

.dialog-btn {
  padding: 6px 18px;
  font-size: 15px;
  border: 1px solid #1890ff;
  background: #fff;
  color: #1890ff;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.dialog-btn:hover {
  background: #e6f7ff;
}

.custom-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 400px;
  min-height: 200px;
  max-width: 90vw;
  max-height: 80vh;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 8px 18px;
  border-bottom: 1px solid #eee;
  font-size: 17px;
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  margin-left: 12px;
}
.dialog-body {
  flex: 1;
  padding: 18px;
  overflow: auto;
}
.preview-container {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 200px;
  max-height: 400px;
  padding: 16px;
  overflow: auto;
}
pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 14px;
  overflow: auto;
}
</style>
