<template>
  <div class="custom-components-view">
    <JsonUiEditor
      :initial-config="initialConfig"
      :showHierarchyPanel="false"
      :activeObjectKind="'custom'"
      :activeObjectId="activeId"
      :activeObjectName="currentComponentName"
      :activeObjectVars="componentVars"
      @update:config="onUpdate"
      @update:objectProps="onUpdateObjectProps"
    >
      <template #left-panel>
        <aside class="list-panel">
          <div class="header">
            <div class="current">当前：{{ currentComponentName }}</div>
          </div>
          <button class="add" @click="openAdd">＋ 添加</button>
          <ul class="list">
            <li v-for="p in items" :key="p.id" :class="{active: p.id===activeId}" @click="setActive(p.id)">{{ p.name }}</li>
          </ul>
        </aside>
      </template>
    </JsonUiEditor>

    <div v-if="dialog" class="dialog-backdrop" @click.self="dialog=false">
      <div class="dialog">
        <div class="dialog-header"><span>添加组件</span><button class="close" @click="dialog=false">×</button></div>
        <div class="dialog-body">
          <label>名称</label>
          <input v-model.trim="form.name" placeholder="请输入组件名称" />
        </div>
        <div class="dialog-footer"><button class="btn" @click="dialog=false">取消</button><button class="btn primary" @click="submit">确定</button></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
// @ts-ignore 处理 Vue SFC 默认导出诊断（由 shims 提供）
import JsonUiEditor from '../../components/JsonUiEditor.vue';
import type { ComponentConfig } from 'fast-json-ui-vue';
import { useRoute } from 'vue-router';
import { AppConfigStore, type CustomWidgetEntry } from '../../services/AppConfigStore';

interface Item { id:string; name:string }
const STORAGE_SELECTED_PREFIX = 'fju-app-selected-';
const route = useRoute();

const items = ref<Item[]>([]);
const activeId = ref('');
const dialog = ref(false);
const form = ref<Item>({ id:'', name:'' });
const initialConfig = ref<ComponentConfig>({ type:'column', children:[{ type:'text', text:'欢迎使用编辑器（自定义组件）' }] });
const componentVars = ref<Record<string, any>>({});
const currentComponentName = computed(() => {
  const item = items.value.find(p=>p.id===activeId.value);
  return item?.name || activeId.value;
});

onMounted(() => {
  const appId = String(route.params.appId || 'default');
  const list = AppConfigStore.getCustomWidgets(appId);
  items.value = list.map((c: CustomWidgetEntry) => ({ id: c.id, name: c.name }));
  if (!items.value.length) {
    const entry = AppConfigStore.addCustomWidget(appId, '示例组件');
    items.value = [{ id: entry.id, name: entry.name }];
  }
  // 默认选中最近一次选择的组件（如存在）
  const selRaw = localStorage.getItem(STORAGE_SELECTED_PREFIX + appId);
  if (selRaw) {
    try {
      const v = JSON.parse(selRaw);
      if (v && v.kind === 'custom' && v.id && items.value.find(p=>p.id===v.id)) {
        activeId.value = v.id;
      } else if (!items.value.find(p=>p.id===activeId.value)) {
        activeId.value = items.value[0].id;
      }
    } catch { if (!items.value.find(p=>p.id===activeId.value)) activeId.value = items.value[0].id; }
  } else if (!items.value.find(p=>p.id===activeId.value)) {
    activeId.value = items.value[0].id;
  }
  loadConfigForActive();
  componentVars.value = AppConfigStore.getCustomWidgetVars(appId, activeId.value);
  // 监听应用级配置变化
  window.addEventListener('fju-app-config-changed', onAppConfigChanged as EventListener);
});
onBeforeUnmount(() => {
  window.removeEventListener('fju-app-config-changed', onAppConfigChanged as EventListener);
});
watch(activeId, () => { 
  loadConfigForActive();
  const appId = String(route.params.appId || 'default');
  componentVars.value = AppConfigStore.getCustomWidgetVars(appId, activeId.value);
});

function loadConfigForActive(){
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.getCustomWidgetSchema(appId, activeId.value);
  if (cfg) { initialConfig.value = cfg; return; }
  initialConfig.value = { type:'column', children:[{ type:'text', text:`组件：${activeId.value}` }] } as ComponentConfig;
}
function setActive(id:string){
  activeId.value = id;
  const appId = String(route.params.appId || 'default');
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'custom', id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'custom', id } })); } catch {}
}
function openAdd(){ dialog.value=true; form.value={id:'', name:''}; }
function submit(){
  if(!form.value.name.trim()){ alert('请填写名称'); return; }
  const appId = String(route.params.appId || 'default');
  const entry = AppConfigStore.addCustomWidget(appId, form.value.name.trim());
  items.value.push({ id: entry.id, name: entry.name });
  activeId.value = entry.id;
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'custom', id: entry.id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'custom', id: entry.id } })); } catch {}
  dialog.value=false;
}

function onUpdate(config: ComponentConfig){
  const appId = String(route.params.appId || 'default');
  AppConfigStore.setCustomWidgetSchema(appId, activeId.value, config);
}

function onUpdateObjectProps(payload: { id: string; kind: 'page'|'dialog'|'custom'; name: string; vars: Record<string, any> }){
  const appId = String(route.params.appId || 'default');
  if (payload.kind !== 'custom') return;
  if (payload.name && payload.name.trim()) {
    AppConfigStore.renameCustomWidget(appId, payload.id, payload.name.trim());
    items.value = items.value.map(p => p.id===payload.id ? { ...p, name: payload.name.trim() } : p);
    try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'custom', id: payload.id } })); } catch {}
  }
  AppConfigStore.setCustomWidgetVars(appId, payload.id, payload.vars || {});
  componentVars.value = payload.vars || {};
}

function goto(kind: 'pages'|'dialogs'|'custom'){
  const appId = String(route.params.appId || 'default');
  const base = `/app/${appId}`;
  const to = kind === 'pages' ? `${base}/pages` : (kind === 'dialogs' ? `${base}/dialogs` : `${base}/custom`);
  try { window.location.hash = `#${to}`; } catch {}
}

function onAppConfigChanged(e: CustomEvent){
  const appId = String(route.params.appId || 'default');
  const list = AppConfigStore.getCustomWidgets(appId);
  const newItems = list.map((c: CustomWidgetEntry) => ({ id: c.id, name: c.name }));
  items.value = newItems;
  if (!newItems.find(p => p.id === activeId.value)) {
    activeId.value = newItems[0]?.id ?? '';
  }
  loadConfigForActive();
  componentVars.value = AppConfigStore.getCustomWidgetVars(appId, activeId.value);
}
</script>

<style scoped>
.custom-components-view { height:100%; }
.list-panel { width: 160px; background:#efefef; padding:8px; border-right:1px solid #ddd; display:flex; flex-direction:column; gap:8px; }
.header { font-weight:600; }
.add { padding:4px 8px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; }
.list { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:6px; }
.list li { padding:6px 8px; border:1px solid #ddd; border-radius:6px; background:#fff; cursor:pointer; }
.list li.active { border-color:#4a90e2; }
.switch { display:flex; gap:6px; align-items:center; }
.seg { padding:2px 8px; border:1px solid #aaa; border-radius:12px; background:#fff; cursor:pointer; font-size:12px; }
.seg.active { background:#4a90e2; color:#fff; border-color:#4a90e2; }
.current { margin-top:6px; font-size:12px; color:#333; }
.dialog-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
.dialog { width: 420px; max-width: 90vw; background:#fff; border-radius:8px; border:1px solid #ddd; display:flex; flex-direction:column; }
.dialog-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid #eee; font-weight:600; }
.dialog-body { padding: 12px 14px; }
.dialog-body input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.dialog-footer { display:flex; justify-content:flex-end; gap:8px; padding:10px 14px; border-top:1px solid #eee; }
.btn { padding: 4px 10px; border: 1px solid #aaa; background: #fff; border-radius: 4px; cursor: pointer; }
.btn.primary { background:#4a90e2; color:#fff; border-color:#4a90e2; }
.close { border:none; background:transparent; font-size:20px; cursor:pointer; }
</style>