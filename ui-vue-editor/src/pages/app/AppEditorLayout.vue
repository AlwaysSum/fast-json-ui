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
    <!-- 应用级源码预览对话框：放入根容器内，避免产生多个根元素；同时使用 :visible + @update:visible -->
    <t-dialog :visible="showAppSourceDialog" @update:visible="val => showAppSourceDialog = !!val" header="应用级源码预览" width="800px">
      <JsonPreview :data="appSourceData" />
      <template #footer>
        <button class="top-btn" @click="copyAppJson">复制 JSON</button>
        <button class="top-btn" @click="showAppSourceDialog=false">关闭</button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';
// 懒加载 JSON 预览组件
const JsonPreview = defineAsyncComponent(() => import('../../components/JsonPreview.vue'));

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

// ===== 顶部按钮：应用级 AppConfig 操作 =====
const showAppSourceDialog = ref(false);
const appSourceData = ref<any>({});
function openSource(){
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.load(appId);
  appSourceData.value = cfg;
  showAppSourceDialog.value = true;
}
async function copyAppJson(){
  try {
    const text = JSON.stringify(appSourceData.value, null, 2);
    await navigator.clipboard.writeText(text);
    alert('应用配置 JSON 已复制到剪贴板');
  } catch {}
}
function triggerExport(){
  const appId = String(route.params.appId || 'default');
  const cfg = AppConfigStore.load(appId);
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `app-config-${appId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function triggerImport(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = String(e.target?.result || '');
        const data = JSON.parse(content);
        const appId = String(route.params.appId || 'default');
        AppConfigStore.save(appId, data);
        // 通知子视图刷新
        try { window.dispatchEvent(new CustomEvent('fju-app-config-changed', { detail: { appId } })); } catch {}
        readSelectedLabel();
        alert('应用配置已导入');
      } catch (err) {
        console.error(err);
        alert('导入失败：JSON 格式无效');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
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