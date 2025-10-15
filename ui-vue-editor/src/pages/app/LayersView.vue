<template>
  <div class="layers-view">
    <JsonUiEditor
      :initial-config="initialConfig"
      :activeObjectKind="selected.kind"
      :activeObjectId="selected.id"
      :activeObjectName="currentName"
      :activeObjectVars="currentVars"
      @update:config="onUpdate"
      @update:objectProps="onObjectPropsUpdate"
      @switchKind="onSwitchKind"
      @export="onExport"
    />

    <div v-if="exportDialog" class="dialog-backdrop" @click.self="exportDialog=false">
      <div class="dialog large">
        <div class="dialog-header"><span>导出 JSON</span><button class="close" @click="exportDialog=false">×</button></div>
        <div class="dialog-body"><JsonPreview :text="output" /></div>
        <div class="dialog-footer"><button class="btn" @click="copy">复制</button><button class="btn primary" @click="exportDialog=false">关闭</button></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
// @ts-ignore Vue SFC 默认导出由 shims 提供
import JsonUiEditor from '../../components/JsonUiEditor.vue';
import JsonPreview from '../../components/JsonPreview.vue';
import type { ComponentConfig } from 'fast-json-ui-vue';
import { useRoute } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';

// 选择项与配置键前缀
const STORAGE_SELECTED_PREFIX = 'fju-app-selected-';
const STORAGE_PAGES_PREFIX = 'fju-app-pages-';
const STORAGE_PAGE_CONFIG_PREFIX = 'fju-app-page-config-';
// 旧的 localStorage 键用于兼容读取当前选择项；配置读写统一走 AppConfigStore

const route = useRoute();
const output = ref('');
const exportDialog = ref(false);
const initialConfig = ref<ComponentConfig>({ type: 'column', children: [{ type: 'text', text: '欢迎使用编辑器' }] });
const selected = ref<{ kind: 'page' | 'dialog' | 'custom'; id: string }>({ kind: 'page', id: 'home' });

onMounted(() => {
  const appId = String(route.params.appId || 'default');
  // 读取当前选择项
  const selRaw = localStorage.getItem(STORAGE_SELECTED_PREFIX + appId);
  if (selRaw) {
    try { const v = JSON.parse(selRaw); if (v && v.kind && v.id) selected.value = v; } catch {}
  }

  // 如果没有选择，默认选择第一个页面
  if (!selected.value?.id) {
    const pagesRaw2 = localStorage.getItem(STORAGE_PAGES_PREFIX + appId);
    if (pagesRaw2) {
      try {
        const p = JSON.parse(pagesRaw2) as Array<{ id: string }>; 
        if (Array.isArray(p) && p.length) selected.value = { kind: 'page', id: p[0].id };
      } catch {}
    }
    // 回退到首页
    if (!selected.value?.id) selected.value = { kind: 'page', id: 'home' };
    localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify(selected.value));
  }

  loadSelectedConfig();
});

function loadSelectedConfig() {
  const appId = String(route.params.appId || 'default');
  const { kind, id } = selected.value;
  if (kind === 'page') {
    const cfg = AppConfigStore.getPageSchema(appId, id);
    if (cfg) { initialConfig.value = cfg; return; }
    initialConfig.value = { type: 'column', children: [{ type: 'text', text: `页面：${id}` }] } as ComponentConfig;
    return;
  }
  if (kind === 'dialog') {
    const cfg = AppConfigStore.getDialogSchema(appId, String(id));
    if (cfg) { initialConfig.value = cfg; return; }
    initialConfig.value = { type: 'column', children: [{ type: 'text', text: `弹窗：${id}` }] } as ComponentConfig;
    return;
  }
  const cfg = AppConfigStore.getCustomWidgetSchema(appId, String(id));
  if (cfg) { initialConfig.value = cfg; return; }
  initialConfig.value = { type: 'column', children: [{ type: 'text', text: `组件：${id}` }] } as ComponentConfig;
}

// 该页面不再管理列表，仅根据当前选择项加载配置

function onUpdate(config: ComponentConfig) {
  const appId = String(route.params.appId || 'default');
  const { kind, id } = selected.value;
  if (kind === 'page') {
    AppConfigStore.setPageSchema(appId, id, config);
    return;
  }
  if (kind === 'dialog') { AppConfigStore.setDialogSchema(appId, String(id), config); return; }
  AppConfigStore.setCustomWidgetSchema(appId, String(id), config);
}
// 顶部显示的当前对象名称与变量
const currentName = computed(() => {
  const appId = String(route.params.appId || 'default');
  const { kind, id } = selected.value;
  if (kind === 'page') {
    try { const p = AppConfigStore.getPages(appId).find(x=>String(x.id)===String(id)); return p?.name || String(id); } catch { return String(id); }
  }
  if (kind === 'dialog') {
    try { const d = AppConfigStore.getDialogs(appId).find(x=>String(x.id)===String(id)); return d?.name || String(id); } catch { return String(id); }
  }
  try { const w = AppConfigStore.getCustomWidgets(appId).find(x=>String(x.id)===String(id)); return w?.name || String(id); } catch { return String(id); }
});
const currentVars = computed<Record<string, any>>(() => {
  const appId = String(route.params.appId || 'default');
  const { kind, id } = selected.value;
  if (kind === 'page') return AppConfigStore.getPageVars(appId, id);
  if (kind === 'dialog') return AppConfigStore.getDialogVars(appId, String(id));
  return AppConfigStore.getCustomWidgetVars(appId, String(id));
});

function onObjectPropsUpdate(payload: { id: string|number; kind: 'page'|'dialog'|'custom'; name?: string; vars?: Record<string, any> }) {
  const appId = String(route.params.appId || 'default');
  const { id, kind, name, vars } = payload;
  if (kind === 'page') {
    if (name && name.trim()) AppConfigStore.renamePage(appId, id, name.trim());
    if (vars) AppConfigStore.setPageVars(appId, id, vars);
  } else if (kind === 'dialog') {
    if (name && name.trim()) AppConfigStore.renameDialog(appId, String(id), name.trim());
    if (vars) AppConfigStore.setDialogVars(appId, String(id), vars);
  } else {
    if (name && name.trim()) AppConfigStore.renameCustomWidget(appId, String(id), name.trim());
    if (vars) AppConfigStore.setCustomWidgetVars(appId, String(id), vars);
  }
}

function onSwitchKind(newKind: 'page'|'dialog'|'custom') {
  if (selected.value.kind === newKind) return;
  const appId = String(route.params.appId || 'default');
  // 切换到该类型的首个对象（如没有则保持原来）
  let nextId: string|number = selected.value.id;
  try {
    if (newKind === 'page') {
      const list = AppConfigStore.getPages(appId); if (list.length) nextId = list[0].id;
    } else if (newKind === 'dialog') {
      const list = AppConfigStore.getDialogs(appId); if (list.length) nextId = list[0].id;
    } else {
      const list = AppConfigStore.getCustomWidgets(appId); if (list.length) nextId = list[0].id;
    }
  } catch {}
  selected.value = { kind: newKind, id: nextId };
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify(selected.value));
  loadSelectedConfig();
  window.dispatchEvent(new CustomEvent('fju-selected-change'));
}
function onExport(config: ComponentConfig) { output.value = JSON.stringify(config, null, 2); exportDialog.value = true; }
async function copy() { try { await navigator.clipboard.writeText(output.value); alert('已复制'); } catch {} }
</script>

<style scoped>
.layers-view { height: 100%; }
.dialog-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }
.dialog.large { width: 800px; background:#fff; border-radius:8px; border:1px solid #ddd; display:flex; flex-direction:column; }
.dialog.large { max-height: 80vh; }
.dialog { width: 420px; max-width: 90vw; background:#fff; border-radius:8px; border:1px solid #ddd; display:flex; flex-direction:column; }
.dialog-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid #eee; font-weight:600; }
.dialog-body { padding: 12px 14px; overflow:auto; }
.dialog-body input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.dialog-footer { display:flex; justify-content:flex-end; gap:8px; padding:10px 14px; border-top:1px solid #eee; }
.btn { padding: 4px 10px; border: 1px solid #aaa; background: #fff; border-radius: 4px; cursor: pointer; }
.btn.primary { background:#4a90e2; color:#fff; border-color:#4a90e2; }
pre { margin:0; white-space:pre-wrap; word-break:break-word; font-family:monospace; }
.close { border:none; background:transparent; font-size:20px; cursor:pointer; }
</style>