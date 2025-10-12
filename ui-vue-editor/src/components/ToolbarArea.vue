<template>
  <div class="toolbar-area">
    <div class="toolbar-section">
      <div class="toolbar-group">
        <t-button-group variant="outline" size="small">
          <t-button 
            :theme="mode === 'edit' ? 'primary' : 'default'"
            @click="setMode('edit')"
            title="编辑模式"
          >
            <template #icon><t-icon name="edit" /></template>
            编辑
          </t-button>
          <t-button 
            :theme="mode === 'preview' ? 'primary' : 'default'"
            @click="setMode('preview')"
            title="预览模式"
          >
            <template #icon><t-icon name="view-module" /></template>
            预览
          </t-button>
        </t-button-group>
      </div>
      
      <t-divider layout="vertical" />
      
      <div class="toolbar-group">
        <t-button 
          variant="outline"
          size="small"
          :disabled="!canUndo"
          @click="undo"
          title="撤销 (Ctrl+Z)"
        >
          <template #icon><t-icon name="rollback" /></template>
          撤销
        </t-button>
        <t-button 
          variant="outline"
          size="small"
          :disabled="!canRedo"
          @click="redo"
          title="重做 (Ctrl+Y)"
        >
          <template #icon><t-icon name="rollfront" /></template>
          重做
        </t-button>
      </div>
      
      <t-divider layout="vertical" />
      
      <div class="toolbar-group">
        <t-button 
          variant="outline"
          size="small"
          @click="clearAll"
          title="清空画布"
        >
          <RemoveIcon />
          清空
        </t-button>
        <t-button 
          variant="outline"
          size="small"
          @click="copyConfig"
          title="复制配置"
        >
          <CopyIcon />
          复制
        </t-button>
        <t-button 
          variant="outline"
          size="small"
          @click="pasteConfig"
          title="粘贴配置"
        >
          <PasteIcon />
          粘贴
        </t-button>
      </div>
    </div>
    
    <div class="toolbar-section">
      <div class="toolbar-group">
        <t-select 
          v-model="selectedDevice" 
          size="small"
          style="width: 120px;"
          @change="changeDevice"
        >
          <t-option value="desktop" label="🖥️ 桌面端" />
          <t-option value="tablet" label="📱 平板" />
          <t-option value="mobile" label="📱 手机" />
        </t-select>
      </div>
      
      <t-divider layout="vertical" />
      
      <div class="toolbar-group">
        <t-button 
          theme="primary"
          size="small"
          @click="exportConfig"
          title="导出 JSON 配置"
        >
          <DownloadIcon />
          导出
        </t-button>
        <t-button 
          variant="outline"
          size="small"
          @click="importConfig"
          title="导入 JSON 配置"
        >
          <UploadIcon />
          导入
        </t-button>
      </div>
    </div>
    
    <!-- 隐藏的文件输入框 -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".json"
      style="display: none;"
      @change="handleFileImport"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RemoveIcon, CopyIcon, PasteIcon, UploadIcon, DownloadIcon } from 'tdesign-icons-vue-next';

interface Props {
  mode?: 'edit' | 'preview';
  canUndo?: boolean;
  canRedo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'edit',
  canUndo: false,
  canRedo: false
});

const emit = defineEmits([
  'modeChange',
  'undo',
  'redo', 
  'clearAll',
  'copyConfig',
  'pasteConfig',
  'exportConfig',
  'importConfig',
  'deviceChange'
]);

const selectedDevice = ref('desktop');
const fileInput = ref<HTMLInputElement>();

function setMode(newMode: 'edit' | 'preview') {
  emit('modeChange', newMode);
}

function undo() {
  emit('undo');
}

function redo() {
  emit('redo');
}

function clearAll() {
  emit('clearAll');
}

function copyConfig() {
  emit('copyConfig');
}

function pasteConfig() {
  emit('pasteConfig');
}

function exportConfig() {
  emit('exportConfig');
}

function importConfig() {
  fileInput.value?.click();
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        emit('importConfig', config);
      } catch (error) {
        console.error('导入配置失败:', error);
      }
    };
    reader.readAsText(file);
  }
}

function changeDevice() {
  emit('deviceChange', selectedDevice.value);
}
</script>

<style scoped>
.toolbar-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  min-height: 48px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.t-divider--vertical) {
  height: 20px;
  margin: 0 8px;
}

:deep(.t-button-group .t-button) {
  border-radius: 0;
}

:deep(.t-button-group .t-button:first-child) {
  border-top-left-radius: var(--td-radius-default);
  border-bottom-left-radius: var(--td-radius-default);
}

:deep(.t-button-group .t-button:last-child) {
  border-top-right-radius: var(--td-radius-default);
  border-bottom-right-radius: var(--td-radius-default);
}

@media (max-width: 768px) {
  .toolbar-area {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }
  
  .toolbar-section {
    width: 100%;
    justify-content: center;
  }
}
</style>