<template>
  <div class="example-container two-column">
    <div class="left-panel">
      <h2>Basic Example</h2>

      <div class="json-editor section">
        <h3>JSON Configuration</h3>
        <textarea v-model="jsonConfig" rows="14"></textarea>
        <button @click="updateConfig">Update UI</button>
      </div>

      <div class="data-editor section">
        <h3>Data</h3>
        <textarea v-model="jsonData" rows="10"></textarea>
        <button @click="updateData">Update Data</button>
      </div>
    </div>

    <div class="right-panel">
      <h3>UI Preview</h3>
      <div class="ui-preview">
        <FastJsonWidget
          :config="config"
          :data="configData"
          :methods="configMethods"
        >
          <template #default="{ child }">
            <CustomComponent
              :config="child"
              :data="configData"
              :methods="configMethods"
            >
            </CustomComponent>
          </template>
        </FastJsonWidget>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';
// 使用 TS 包装文件以避免 IDE 对 .vue 默认导出诊断报错
import CustomComponent from '../components/custom/CustomComponent';

// Data for binding
const configData = ref({
  "name": "Dynamic Data",
  ":name": "Test Dynamic Data"
});

// Methods for binding
const configMethods = ref({
  "onRefresh": (name: string) => {
    console.log("onRefresh called with:", name);
    return () => {
      configData.value[':name'] = "Updated Value";
      alert(`Value updated to: ${configData.value[':name']}`);
    };
  }
});

// Default configuration
const defaultConfig = {
  type: "column",
  children: [
    {
      type: "text",
      text: "Hello, ${:name}"
    },
    {
      type: "button",
      text: "Update Variable",
      onTap: "@{onRefresh(${:name})}"
    },
    {
      type: "row",
      children: [
        {
          type: "text",
          text: "Row Item 1"
        },
        {
          type: "text",
          text: "Row Item 2"
        }
      ]
    },
    {
      type: "container",
      color: "#f5f5f5",
      padding: "16px",
      margin: "8px",
      child: {
        type: "text",
        text: "Container content with variable: ${:name}"
      }
    },
    {
      type: "CustomType",
      text: "This is a custom component with variable: ${:name}"
    }
  ]
};

// Reactive references
const config = ref(defaultConfig);
const jsonConfig = ref(JSON.stringify(defaultConfig, null, 2));
const jsonData = ref(JSON.stringify(configData.value, null, 2));

// Update the UI configuration
const updateConfig = () => {
  try {
    config.value = JSON.parse(jsonConfig.value);
  } catch (error) {
    alert('Invalid JSON configuration');
    console.error(error);
  }
};

// Update the data
const updateData = () => {
  try {
    configData.value = JSON.parse(jsonData.value);
  } catch (error) {
    alert('Invalid JSON data');
    console.error(error);
  }
};

// Initialize
onMounted(() => {
  jsonConfig.value = JSON.stringify(defaultConfig, null, 2);
  jsonData.value = JSON.stringify(configData.value, null, 2);
});
</script>

<style scoped>
.example-container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 20px;
}

.two-column {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.left-panel {
  width: 42%;
  min-width: 420px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

h3 {
  color: #555;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

textarea {
  width: 100%;
  font-family: monospace;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.ui-preview {
  flex: 1;
  min-height: 300px;
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>