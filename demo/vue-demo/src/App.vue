<script setup lang="ts">
import { ref, computed } from "vue";
import BasicExample from "./examples/BasicExample.vue";
import AdvancedExample from "./examples/AdvancedExample.vue";
import EditorExample from "./examples/EditorExample.vue";

const activeTab = ref<string>("basic");
const isEditorMode = computed(() => activeTab.value === "editor");

function openGit() {
  window.open("https://github.com/AlwaysSum/fast-json-ui", "_blank");
}

function openApiDocs() {
  window.open("https://alwayssum.github.io/fast-json-ui/", "_blank");
}
</script>

<template>
  <div class="admin-app" :class="{ 'editor-mode': isEditorMode }">
    <header class="top-nav">
      <div class="nav-left">
        <div class="logo">Fast-JSON-UI-Vue</div>
        <nav class="menu">
          <button class="menu-item" :class="{ active: activeTab === 'editor' }" @click="activeTab = 'editor'">编辑器</button>
          <!-- <button class="menu-item" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">项目介绍</button> -->
          <div class="menu-item dropdown" :class="{ active: activeTab === 'basic' || activeTab === 'advanced' }" tabindex="0">
            <span>Example ▾</span>
            <div class="dropdown-panel">
              <button class="dropdown-item" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">Basic Example</button>
              <button class="dropdown-item" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">Advanced Example</button>
            </div>
          </div>
          <button class="menu-item" @click="openApiDocs">API 文档</button>
        </nav>
      </div>
      <div class="nav-right">
        <button class="menu-item link" @click="openGit">GIT 地址</button>
      </div>
    </header>

    <main class="admin-content" :class="{ 'editor-mode': isEditorMode }">
      <section v-if="activeTab === 'intro'" class="intro">
        <h2>项目介绍</h2>
        <p>Fast-JSON-UI 通过 JSON 配置快速渲染 Vue 组件，支持编辑器模式与预览模式，方便在低代码/配置化场景下快速构建页面。</p>
        <ul>
          <li>组件库：fast-json-ui-vue</li>
          <li>可视化编辑器：fast-json-ui-editor</li>
          <li>示例与文档：demo 与 document-site</li>
        </ul>
      </section>

      <BasicExample v-else-if="activeTab === 'basic'" />
      <AdvancedExample v-else-if="activeTab === 'advanced'" />
      <EditorExample v-else-if="activeTab === 'editor'" />
    </main>

    <footer v-if="!isEditorMode" class="admin-footer">
      <p>Fast-JSON-UI-Vue - MIT License</p>
    </footer>
  </div>
</template>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #213547;
  background-color: #ffffff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.admin-app {
  min-height: 100vh;
  width: 100vw;
  background: #f5f6fa;
}

/* 顶部导航 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 56px;
  background: #222e3c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
}
.nav-left { display: flex; align-items: center; gap: 20px; }
.logo { font-size: 18px; font-weight: 700; }
.menu { display: flex; align-items: center; gap: 8px; }
.menu-item {
  color: #cfd8e3;
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.menu-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.menu-item.active { background: rgba(255,255,255,0.12); color: #fff; }
.menu-item.link { color: #8ac7ff; }

.dropdown { position: relative; }
.dropdown:focus .dropdown-panel,
.dropdown:hover .dropdown-panel { display: block; }
.dropdown-panel {
  display: none;
  position: absolute;
  top: 36px;
  left: 0;
  min-width: 180px;
  background: #ffffff;
  color: #222e3c;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 8px;
}
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #222e3c;
  font-size: 14px;
}
.dropdown-item:hover { background: #f5f6fa; }
.dropdown-item.active { background: #e6f7ff; color: #1890ff; }

.nav-right { display: flex; align-items: center; }

.admin-body { display: flex; min-height: 100vh; }

.admin-content {
  flex: 1;
  padding: 72px 32px 32px 32px; /* 顶部预留导航高度 */
  min-width: 0;
  min-height: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: calc(100vh - 56px);
  overflow: auto;
}
.admin-content.editor-mode {
  padding: 0;
  background: #fff;
  height: calc(100vh - 56px);
}

.admin-footer {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-top: 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
}

/* 兼容编辑模式全屏 */
.admin-app.editor-mode .admin-content.editor-mode {
  height: calc(100vh - 64px);
  min-height: 0;
  padding: 0;
}
.intro { max-width: 860px; }
</style>
