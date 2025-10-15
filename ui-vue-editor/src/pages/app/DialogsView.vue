<template>
  <div class="dialogs-view">
    <JsonUiEditor
      :initial-config="initialConfig"
      :showHierarchyPanel="false"
      :activeObjectKind="'dialog'"
      :activeObjectId="activeId"
      :activeObjectName="currentDialogName"
      :activeObjectVars="dialogVars"
      @update:config="onUpdate"
      @update:objectProps="onUpdateObjectProps"
    >
      <template #left-panel>
        <aside class="list-panel">
          <div class="header">
            <div class="current">当前：{{ currentDialogName }}</div>
          </div>
          <button class="add" @click="openAdd">＋ 添加</button>
          <ul class="list">
            <li v-for="p in dialogs" :key="p.id" :class="{active: p.id===activeId}" @click="setActive(p.id)">{{ p.name }}</li>
          </ul>
        </aside>
      </template>
    </JsonUiEditor>

    <div v-if="dialog" class="dialog-backdrop" @click.self="dialog=false">
      <div class="dialog">
        <div class="dialog-header"><span>添加弹窗</span><button class="close" @click="dialog=false">×</button></div>
        <div class="dialog-body">
          <label>名称</label>
          <input v-model.trim="form.name" placeholder="请输入弹窗名称" />
        </div>
        <div class="dialog-footer"><button class="btn" @click="dialog=false">取消</button><button class="btn primary" @click="submit">确定</button></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
// @ts-ignore 处理 Vue SFC 默认导出诊断（由 shims 提供）
import JsonUiEditor from '../../components/JsonUiEditor.vue';
import type { ComponentConfig } from 'fast-json-ui-vue';
import { useRoute } from 'vue-router';
import { AppConfigStore, type AppDialogEntry } from '../../services/AppConfigStore';

interface Item { id:string; name:string }
const STORAGE_SELECTED_PREFIX = 'fju-app-selected-';
const route = useRoute();
const dialogs = ref<Item[]>([]);
const activeId = ref('');
const dialog = ref(false);
const form = ref<Item>({ id:'', name:'' });
const initialConfig = ref<ComponentConfig>({ type:'column', children:[{ type:'text', text:'欢迎使用编辑器（弹窗）' }] });
const dialogVars = ref<Record<string, any>>({});
const currentDialogName = computed(() => {
  const item = dialogs.value.find(p=>p.id===activeId.value);
  return item?.name || activeId.value;
});

onMounted(() => {
  const appId = String(route.params.appId || 'default');
  const list = AppConfigStore.getDialogs(appId);
  dialogs.value = list.map((d: AppDialogEntry) => ({ id: d.id, name: d.name }));
  if (!dialogs.value.length) {
    const entry = AppConfigStore.addDialog(appId, '示例弹窗');
    dialogs.value = [{ id: entry.id, name: entry.name }];
  }
  // 默认选中最近一次选择的弹窗（如存在）
  const selRaw = localStorage.getItem(STORAGE_SELECTED_PREFIX + appId);
  if (selRaw) {
    try {
      const v = JSON.parse(selRaw);
      if (v && v.kind === 'dialog' && v.id && dialogs.value.find(p=>p.id===v.id)) {
        activeId.value = v.id;
      } else if (!dialogs.value.find(p=>p.id===activeId.value)) {
        activeId.value = dialogs.value[0].id;
      }
    } catch { if (!dialogs.value.find(p=>p.id===activeId.value)) activeId.value = dialogs.value[0].id; }
  } else if (!dialogs.value.find(p=>p.id===activeId.value)) {
    activeId.value = dialogs.value[0].id;
  }
  loadConfigForActive();
  dialogVars.value = AppConfigStore.getDialogVars(appId, activeId.value);
});
watch(activeId, () => { 
  loadConfigForActive();
  const appId = String(route.params.appId || 'default');
  dialogVars.value = AppConfigStore.getDialogVars(appId, activeId.value);
});

function loadConfigForActive(){
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.getDialogSchema(appId, activeId.value);
  if (cfg) { initialConfig.value = cfg; return; }
  initialConfig.value = { type:'column', children:[{ type:'text', text:`弹窗：${activeId.value}` }] } as ComponentConfig;
}
function setActive(id:string){
  activeId.value = id;
  const appId = String(route.params.appId || 'default');
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'dialog', id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'dialog', id } })); } catch {}
}
function openAdd(){ dialog.value=true; form.value={id:'', name:''}; }
function submit(){
  if(!form.value.name.trim()){ alert('请填写名称'); return; }
  const appId = String(route.params.appId || 'default');
  const entry = AppConfigStore.addDialog(appId, form.value.name.trim());
  dialogs.value.push({ id: entry.id, name: entry.name });
  activeId.value = entry.id;
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'dialog', id: entry.id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'dialog', id: entry.id } })); } catch {}
  dialog.value=false;
}

function onUpdate(config: ComponentConfig){
  const appId = String(route.params.appId || 'default');
  AppConfigStore.setDialogSchema(appId, activeId.value, config);
}

function onUpdateObjectProps(payload: { id: string; kind: 'page'|'dialog'|'custom'; name: string; vars: Record<string, any> }){
  const appId = String(route.params.appId || 'default');
  if (payload.kind !== 'dialog') return;
  if (payload.name && payload.name.trim()) {
    AppConfigStore.renameDialog(appId, payload.id, payload.name.trim());
    dialogs.value = dialogs.value.map(p => p.id===payload.id ? { ...p, name: payload.name.trim() } : p);
    try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'dialog', id: payload.id } })); } catch {}
  }
  AppConfigStore.setDialogVars(appId, payload.id, payload.vars || {});
  dialogVars.value = payload.vars || {};
}

function goto(kind: 'pages'|'dialogs'|'custom'){
  const appId = String(route.params.appId || 'default');
  const base = `/app/${appId}`;
  const to = kind === 'pages' ? `${base}/pages` : (kind === 'dialogs' ? `${base}/dialogs` : `${base}/custom`);
  try { window.location.hash = `#${to}`; } catch {}
}
</script>

<style scoped>
.dialogs-view { height:100%; }
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