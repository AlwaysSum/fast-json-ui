<template>
  <div class="pages-view">
    <JsonUiEditor
      :initial-config="initialConfig"
      :showHierarchyPanel="false"
      :activeObjectKind="'page'"
      :activeObjectId="activeId"
      :activeObjectName="currentPageName"
      :activeObjectVars="pageVars"
      @update:config="onUpdate"
      @update:objectProps="onUpdateObjectProps"
      @export="onExport"
    >
      <template #left-panel>
        <aside class="list-panel">
          <div class="header">
            <div class="current">当前：{{ currentPageName }}</div>
          </div>
          <button class="add" @click="openAdd">＋ 添加</button>
          <ul class="list">
            <li v-for="p in pages" :key="p.id" :class="{active: p.id===activeId}" @click="setActive(p.id)">
              <span class="dot" />
              <span class="name">{{ p.name }}</span>
              <button class="edit" @click.stop="openRename(p.id, p.name)">编辑</button>
            </li>
          </ul>
        </aside>
      </template>
    </JsonUiEditor>

    <div v-if="dialog" class="dialog-backdrop" @click.self="dialog=false">
      <div class="dialog">
        <div class="dialog-header"><span>添加页面</span><button class="close" @click="dialog=false">×</button></div>
        <div class="dialog-body">
          <label>名称</label>
          <input v-model.trim="form.name" placeholder="请输入页面名称" />
          <label style="margin-top:8px;">路径</label>
          <input v-model.trim="form.path" placeholder="请输入路径，如 /home" />
        </div>
        <div class="dialog-footer"><button class="btn" @click="dialog=false">取消</button><button class="btn primary" @click="submit">确定</button></div>
      </div>
    </div>

    <!-- 重命名页面 -->
    <div v-if="renameDialog" class="dialog-backdrop" @click.self="renameDialog=false">
      <div class="dialog">
        <div class="dialog-header"><span>重命名页面</span><button class="close" @click="renameDialog=false">×</button></div>
        <div class="dialog-body">
          <label>新名称</label>
          <input v-model.trim="renameForm.name" placeholder="请输入新页面名称" />
        </div>
        <div class="dialog-footer"><button class="btn" @click="renameDialog=false">取消</button><button class="btn primary" @click="submitRename">确定</button></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
// @ts-ignore 处理有时出现的“Module has no default export”诊断（Vue SFC 默认导出）
import JsonUiEditor from '../../components/JsonUiEditor.vue';
import type { ComponentConfig } from 'fast-json-ui-vue';
import { useRoute } from 'vue-router';
import { AppConfigStore, type AppPageEntry } from '../../services/AppConfigStore';

interface PageItem { id:string|number; name:string; path:string }
const STORAGE_SELECTED_PREFIX = 'fju-app-selected-';
const route = useRoute();

const pages = ref<PageItem[]>([{ id:'home', name:'首页', path:'/home'}]);
const activeId = ref<string|number>('home');
const dialog = ref(false);
const form = ref<PageItem>({ id:'', name:'', path:'' });
const pageVars = ref<Record<string, any>>({});
const currentPageName = computed(() => {
  const item = pages.value.find(p=>String(p.id)===String(activeId.value));
  return item?.name || String(activeId.value);
});
const renameDialog = ref(false);
const renameForm = ref<{ id: string|number; name: string }>({ id: '', name: '' });
const initialConfig = ref<ComponentConfig>({ type:'column', children:[{ type:'text', text:'欢迎使用编辑器（页面）' }] });

onMounted(() => {
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.load(appId);
  pages.value = cfg.pages.map((p: AppPageEntry) => ({ id: p.id, name: p.name, path: p.path }));
  // 默认选中为最近一次选择的页面（如存在）
  const selRaw = localStorage.getItem(STORAGE_SELECTED_PREFIX + appId);
  if (selRaw) {
    try {
      const v = JSON.parse(selRaw);
      if (v && v.kind === 'page' && v.id && pages.value.find(p=>String(p.id)===String(v.id))) {
        activeId.value = v.id;
      } else {
        activeId.value = pages.value[0]?.id ?? 'home';
      }
    } catch { activeId.value = pages.value[0]?.id ?? 'home'; }
  } else {
    activeId.value = pages.value[0]?.id ?? 'home';
  }
  loadConfigForActive();
  // 载入当前页面入参变量
  pageVars.value = AppConfigStore.getPageVars(appId, activeId.value);
  // 监听应用级配置变化
  window.addEventListener('fju-app-config-changed', onAppConfigChanged as EventListener);
});
onBeforeUnmount(() => {
  window.removeEventListener('fju-app-config-changed', onAppConfigChanged as EventListener);
});

watch(activeId, () => {
  loadConfigForActive();
  const appId = String(route.params.appId || 'default');
  pageVars.value = AppConfigStore.getPageVars(appId, activeId.value);
});

function loadConfigForActive(){
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.getPageSchema(appId, activeId.value);
  if (cfg) { initialConfig.value = cfg; return; }
  initialConfig.value = { type:'column', children:[{ type:'text', text:`页面：${activeId.value}` }] } as ComponentConfig;
}

function onAppConfigChanged(e: CustomEvent){
  const appId = String(route.params.appId || 'default');
  // 重新加载页面列表
  const cfg = AppConfigStore.load(appId);
  const newPages = cfg.pages.map((p: AppPageEntry) => ({ id: p.id, name: p.name, path: p.path }));
  pages.value = newPages;
  // 保持现有 activeId，如不存在则重置为第一个
  if (!newPages.find(p => String(p.id) === String(activeId.value))) {
    activeId.value = newPages[0]?.id ?? 'home';
  }
  loadConfigForActive();
  pageVars.value = AppConfigStore.getPageVars(appId, activeId.value);
}

function setActive(id:string|number){
  activeId.value = id;
  const appId = String(route.params.appId || 'default');
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'page', id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'page', id } })); } catch {}
}
function openAdd(){ dialog.value=true; form.value={ id:'', name:'', path:'' } }
function submit(){
  if(!form.value.name.trim()){ alert('请填写名称'); return; }
  const appId = String(route.params.appId || 'default');
  const entry = AppConfigStore.addPage(appId, form.value.name.trim(), form.value.path.trim()||'/');
  pages.value.push({ id: entry.id, name: entry.name, path: entry.path });
  activeId.value = entry.id;
  localStorage.setItem(STORAGE_SELECTED_PREFIX + appId, JSON.stringify({ kind: 'page', id: entry.id }));
  // 通知上层更新标题
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'page', id: entry.id } })); } catch {}
  dialog.value=false;
}

function onUpdate(config: ComponentConfig){
  const appId = String(route.params.appId || 'default');
  AppConfigStore.setPageSchema(appId, activeId.value, config);
}
function onExport(_config: ComponentConfig){}

function onUpdateObjectProps(payload: { id: string|number; kind: 'page'|'dialog'|'custom'; name: string; vars: Record<string, any> }){
  const appId = String(route.params.appId || 'default');
  if (payload.kind !== 'page') return;
  if (payload.name && payload.name.trim()) {
    AppConfigStore.renamePage(appId, payload.id, payload.name.trim());
    pages.value = pages.value.map(p => String(p.id)===String(payload.id) ? { ...p, name: payload.name.trim() } : p);
    try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: 'page', id: payload.id } })); } catch {}
  }
  AppConfigStore.setPageVars(appId, payload.id, payload.vars || {});
  pageVars.value = payload.vars || {};
}

function goto(kind: 'pages'|'dialogs'|'custom'){
  const appId = String(route.params.appId || 'default');
  const name = kind === 'pages' ? 'pages' : kind === 'dialogs' ? 'dialogs' : 'custom';
  try { window.dispatchEvent(new CustomEvent('fju-selected-change', { detail: { kind: kind==='pages'?'page': (kind==='dialogs'?'dialog':'custom'), id: activeId.value } })); } catch {}
  // 跳转到对应视图
  const params = { appId } as any;
  const pathName = name;
  // 使用路由名称
  try {
    // @ts-ignore router 在父布局，通过 <router-link> 名称一致
    // 这里直接构造路径更稳妥
    const base = `/app/${appId}`;
    const to = kind === 'pages' ? `${base}/pages` : (kind === 'dialogs' ? `${base}/dialogs` : `${base}/custom`);
    window.location.hash = `#${to}`; // 兼容开发环境路由
  } catch {}
}

function openRename(id: string|number, currentName: string){
  renameForm.value = { id, name: currentName };
  renameDialog.value = true;
}
function submitRename(){
  const appId = String(route.params.appId || 'default');
  if (!renameForm.value.name.trim()) { alert('请填写新名称'); return; }
  AppConfigStore.renamePage(appId, renameForm.value.id, renameForm.value.name.trim());
  pages.value = pages.value.map((p) => p.id===renameForm.value.id ? { ...p, name: renameForm.value.name.trim() } : p);
  renameDialog.value = false;
}
</script>

<style scoped>
.pages-view { height: 100%; }
.list-panel { width: 160px; background:#efefef; padding:8px; border-right:1px solid #ddd; display:flex; flex-direction:column; gap:8px; }
.header { font-weight:600; }
.add { padding:4px 8px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; }
.list { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:6px; }
.list li { display:flex; align-items:center; gap:8px; padding:6px 8px; border:1px solid #ddd; border-radius:6px; background:#fff; cursor:pointer; }
.list li.active { border-color:#4a90e2; }
.dot { width:8px; height:8px; border-radius:50%; background:#4a90e2; }
.name { font-size:12px; }
.edit { margin-left:auto; font-size:12px; padding:2px 6px; border:1px solid #aaa; border-radius:4px; background:#fff; cursor:pointer; }
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