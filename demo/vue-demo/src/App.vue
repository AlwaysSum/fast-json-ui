<script setup lang="ts">
import { ref, computed } from "vue";
import BasicExample from "./examples/BasicExample.vue";
import AdvancedExample from "./examples/AdvancedExample.vue";
import EditorExample from "./examples/EditorExample.vue";

const activeTab = ref<string>("basic");
const isEditorMode = computed(() => activeTab.value === "editor");
</script>

<template>
  <div class="admin-app" :class="{ 'editor-mode': isEditorMode }">
    <header class="admin-header">
      <div class="logo">Fast-JSON-UI-Vue</div>
      <div class="desc">
        A Vue 3 library for converting JSON to UI components
      </div>
    </header>
    <div class="admin-body">
      <aside class="admin-sidebar">
        <button
          :class="{ active: activeTab === 'basic' }"
          @click="activeTab = 'basic'"
        >
          Basic Example
        </button>
        <button
          :class="{ active: activeTab === 'advanced' }"
          @click="activeTab = 'advanced'"
        >
          Advanced Example
        </button>
        <button
          :class="{ active: activeTab === 'editor' }"
          @click="activeTab = 'editor'"
        >
          UI Editor
        </button>
      </aside>
      <main class="admin-content" :class="{ 'editor-mode': isEditorMode }">
        <BasicExample v-if="activeTab === 'basic'" />
        <AdvancedExample v-else-if="activeTab === 'advanced'" />
        <EditorExample v-else-if="activeTab === 'editor'" />
      </main>
    </div>
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

.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background: #222e3c;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 32px;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  z-index: 10;
}
.admin-header .logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.admin-header .desc {
  font-size: 1rem;
  color: #b0b8c9;
}

.admin-body {
  display: flex;
  min-height: 100vh;
  padding-top: 64px;
}

.admin-sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  width: 200px;
  height: calc(100vh - 64px);
  background: #fff;
  border-right: 1px solid #e5e6eb;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  gap: 12px;
  box-shadow: 1px 0 0 #f0f0f0;
  z-index: 9;
}
.admin-sidebar button {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  background: none;
  border: none;
  border-left: 4px solid transparent;
  text-align: left;
  color: #222e3c;
  cursor: pointer;
  transition: all 0.2s;
}
.admin-sidebar button.active {
  background: #e6f7ff;
  border-left: 4px solid #1890ff;
  color: #1890ff;
}
.admin-sidebar button:hover {
  background: #f5faff;
}

.admin-content {
  margin-left: 200px;
  margin-top: 64px;
  flex: 1;
  padding: 32px;
  min-width: 0;
  min-height: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: calc(100vh - 64px);
  overflow: auto;
}
.admin-content.editor-mode {
  padding: 0;
  background: #fff;
  height: calc(100vh - 64px);
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
  left: 200px;
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
.admin-app.editor-mode .admin-sidebar {
  z-index: 9;
}
</style>
