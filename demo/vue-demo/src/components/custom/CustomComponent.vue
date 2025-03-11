<template>
  <div v-if="config.type === 'CustomType'" class="custom-component">
    {{ getValueFromConfig(config.text) }}
  </div>
  <div v-else-if="config.type === 'CustomCard'" class="custom-card">
    <div class="card-header">{{ getValueFromConfig(config.title) }}</div>
    <div class="card-body">{{ getValueFromConfig(config.content) }}</div>
    <div v-if="config.actions" class="card-actions">
      <button 
        v-for="(action, index) in config.actions" 
        :key="index"
        @click="handleFunctionCall(action.onTap)"
      >
        {{ getValueFromConfig(action.text) }}
      </button>
    </div>
  </div>
  <div v-else class="not-found">
    Component type not found: {{ config.type }}
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { 
  type BaseConfig, 
  type ConfigData, 
  type ConfigMethods, 
  getValueFromConfig as getValueFromConfigLib,
  callFunction as callFunctionLib
} from 'fast-json-ui-vue';

// Define props
const props = defineProps({
  config: {
    type: Object as PropType<BaseConfig>,
    required: true
  },
  data: {
    type: Object as PropType<ConfigData>,
    default: () => ({})
  },
  methods: {
    type: Object as PropType<ConfigMethods>,
    default: () => ({})
  }
});

/**
 * 从配置中获取值
 */
const getValueFromConfig = (value: any): any => {
  return getValueFromConfigLib(value, props.data, props.methods);
};

/**
 * 处理函数调用
 */
const handleFunctionCall = (value: any): void => {
  callFunctionLib(value, props.data, props.methods);
};
</script>

<style scoped>
.custom-component {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 16px;
}

.custom-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.card-header {
  background-color: #f5f5f5;
  padding: 12px 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.card-body {
  padding: 16px;
}

.card-actions {
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  justify-content: flex-end;
  gap: 8px;
}

.card-actions button {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card-actions button:hover {
  background-color: #45a049;
}

.not-found {
  padding: 16px;
  color: #ff0000;
  border: 1px dashed #ff0000;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style> 