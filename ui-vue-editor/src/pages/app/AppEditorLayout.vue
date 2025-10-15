<template>
  <div class="app-editor">
    <header class="app-topbar">
      <div class="left">
        <button class="back" @click="goBack">← 返回</button>
        <span class="app-name">
          <template v-if="!editing">
            {{ appName }}
            <button class="mini-edit" @click="startEdit">编辑</button>
          </template>
          <template v-else>
            <input class="name-input" v-model.trim="nameInput" @keydown.enter="saveName" />
            <button class="mini-save" @click="saveName">保存</button>
            <button class="mini-cancel" @click="cancelEdit">取消</button>
          </template>
          <span> / {{ selectedLabel }}</span>
        </span>
      </div>
      <div class="right">
        <button class="top-btn" @click="openSource">源码</button>
        <button class="top-btn" @click="triggerExport">导出</button>
        <button class="top-btn" @click="triggerImport">导入</button>
      </div>
    </header>

    <div class="editor-body">
      <aside class="sidebar">
        <router-link :to="childLink('layers')" class="menu-item" active-class="active">
          <div class="icon">层</div>
          <div class="text">层级</div>
        </router-link>
        <router-link :to="childLink('pages')" class="menu-item" active-class="active">
          <div class="icon">页</div>
          <div class="text">页面</div>
        </router-link>
        <router-link :to="childLink('dialogs')" class="menu-item" active-class="active">
          <div class="icon">弹</div>
          <div class="text">弹窗</div>
        </router-link>
        <router-link :to="childLink('custom')" class="menu-item" active-class="active">
          <div class="icon">自</div>
          <div class="text">自定义组件</div>
        </router-link>
        <router-link :to="childLink('data')" class="menu-item" active-class="active">
          <div class="icon">数</div>
          <div class="text">数据</div>
        </router-link>
        <router-link :to="childLink('api')" class="menu-item" active-class="active">
          <div class="icon">接</div>
          <div class="text">接口</div>
        </router-link>
        <router-link :to="childLink('settings')" class="menu-item" active-class="active">
          <div class="icon">设</div>
          <div class="text">应用设置</div>
        </router-link>
      </aside>

      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';

const route = useRoute();
const router = useRouter();
const STORAGE_SELECTED_PREFIX = 'fju-app-selected-';
// 不再使用本地列表存储，统一从 AppConfigStore 读取

const appName = computed(() => {
  const appId = String(route.params.appId || 'default');
  try { return AppConfigStore.getName(appId); } catch { return `应用名称/${appId}`; }
});
const editing = ref(false);
const nameInput = ref('');
function startEdit(){ nameInput.value = String(appName.value || ''); editing.value = true; }
function saveName(){
  const appId = String(route.params.appId || 'default');
  if (!nameInput.value.trim()) { editing.value=false; return; }
  AppConfigStore.setName(appId, nameInput.value.trim());
  editing.value = false;
}
function cancelEdit(){ editing.value=false; }
function goBack() { router.push('/'); }
function childLink(name: string) { return { name, params: { appId: route.params.appId } }; }

const selectedLabel = ref('页面 首页');
function readSelectedLabel(){
  const appId = String(route.params.appId || 'default');
  const raw = localStorage.getItem(STORAGE_SELECTED_PREFIX + appId);
  let kind: 'page'|'dialog'|'custom' = 'page';
  let id: string|number = 'home';
  if (raw) { try { const v = JSON.parse(raw); if (v && v.kind && v.id) { kind = v.kind; id = v.id; } } catch {} }
  if (kind === 'page') {
    try {
      const cfg = AppConfigStore.load(appId);
      const p = cfg.pages.find((x:any)=>String(x.id)===String(id));
      selectedLabel.value = `页面 ${p?.name ?? id}`;
    } catch { selectedLabel.value = `页面 ${id}`; }
    return;
  }
  if (kind === 'dialog') {
    try {
      const arr = AppConfigStore.getDialogs(appId);
      const hit = Array.isArray(arr) ? arr.find((x:any)=>String(x.id)===String(id)) : undefined;
      selectedLabel.value = `弹窗 ${hit?.name ?? id}`;
      return;
    } catch { selectedLabel.value = `弹窗 ${id}`; return; }
  }
  try {
    const arr = AppConfigStore.getCustomWidgets(appId);
    const hit = Array.isArray(arr) ? arr.find((x:any)=>String(x.id)===String(id)) : undefined;
    selectedLabel.value = `自定义组件 ${hit?.name ?? id}`;
  } catch { selectedLabel.value = `自定义组件 ${id}`; }
}

function onSelectedChange(){ readSelectedLabel(); }
onMounted(() => { readSelectedLabel(); window.addEventListener('fju-selected-change', onSelectedChange as EventListener); });
onBeforeUnmount(() => { window.removeEventListener('fju-selected-change', onSelectedChange as EventListener); });
watch(() => route.fullPath, () => { readSelectedLabel(); });

// 顶部三个按钮动作：通过全局事件通知当前编辑器视图（Pages/Dialogs/Custom）的 JsonUiEditor
function openSource(){ try { window.dispatchEvent(new CustomEvent('fju-action-source')); } catch {} }
function triggerExport(){ try { window.dispatchEvent(new CustomEvent('fju-action-export')); } catch {} }
function triggerImport(){ try { window.dispatchEvent(new CustomEvent('fju-action-import')); } catch {} }
</script>

<style scoped>
.app-editor { display:flex; flex-direction:column; height: calc(100vh - 70px); }
.app-topbar { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#d0d0d0; }
.left { display:flex; align-items:center; gap:10px; }
.back { padding: 4px 8px; border-radius:6px; border:1px solid #aaa; background:#fff; cursor:pointer; }
.app-name { font-weight:600; }
.mini-edit, .mini-save, .mini-cancel { margin-left:8px; padding: 2px 6px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; font-size:12px; }
.name-input { padding:4px 8px; border:1px solid #aaa; border-radius:6px; font-size:12px; }
.right { display:flex; gap:8px; }
.top-btn { padding: 4px 10px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; }

.editor-body { display:flex; flex:1; }
.sidebar { width: 96px; background:#efefef; padding:8px 6px; display:flex; flex-direction:column; gap:6px; }
.menu-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:8px; border-radius:10px; text-decoration:none; color:#222; background:#fff; border:1px solid #ddd; }
.menu-item.active { border-color:#4a90e2; box-shadow:0 0 0 2px rgba(74,144,226,.2); }
.icon { width:22px; height:22px; border-radius:50%; background:#fff; border:1px solid #ccc; display:flex; align-items:center; justify-content:center; font-size:12px; }
.text { font-size:11px; }
.content { flex:1; background:#fff; padding:10px; }
</style>