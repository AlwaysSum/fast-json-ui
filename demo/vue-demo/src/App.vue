<script setup lang="ts">
import { ref } from 'vue';
import BasicExample from './examples/BasicExample.vue';
import AdvancedExample from './examples/AdvancedExample.vue';
import EditorExample from './examples/EditorExample.vue';

const activeTab = ref<string>('basic');
</script>

<template>
  <div class="app">
    <header>
      <h1>Fast-JSON-UI-Vue Demo</h1>
      <p>A Vue 3 library for converting JSON to UI components</p>
    </header>
    
    <nav>
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
    </nav>
    
    <main>
      <BasicExample v-if="activeTab === 'basic'" />
      <AdvancedExample v-else-if="activeTab === 'advanced'" />
      <EditorExample v-else-if="activeTab === 'editor'" />
    </main>
    
    <footer>
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

.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

nav button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

nav button:hover {
  background-color: #eee;
}

nav button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

main {
  margin-bottom: 2rem;
}

footer {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
</style>
