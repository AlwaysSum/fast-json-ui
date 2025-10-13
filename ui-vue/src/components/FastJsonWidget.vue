<template>
  <component 
    :class="`fast-json-widget fast-json-widget__${config.type}`"
    :is="getComponentByType(config.type)" 
    :config="config" 
    :data="data" 
    :methods="methods"
    @click="handleEvent($event, 'onTap')"
    @dblclick="handleEvent($event, 'onDoubleTap')"
    @mouseenter="handleEvent($event, 'onMouseEnter')"
    @mouseleave="onMouseLeave($event)"
    @contextmenu="handleEvent($event, 'onContextMenu')"
    @mousedown="startLongPress($event)"
    @mouseup="cancelLongPress()"
    @touchstart="startLongPress($event)"
    @touchend="cancelLongPress()"
    @touchcancel="cancelLongPress()"
  >
    <template #default="slotProps">
      <FastJsonWidget 
        v-if="slotProps.child && !isCustomComponent(slotProps.child.type)" 
        :config="slotProps.child" 
        :data="data" 
        :methods="methods"
      >
        <template #default="childSlotProps">
          <slot :child="childSlotProps.child"></slot>
        </template>
      </FastJsonWidget>
      <slot v-else :child="slotProps.child"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { type PropType, ref, onMounted } from 'vue';
import { ComponentConfig, ConfigData, ConfigMethods } from '../types';
import * as FastJsonUI from '../utils/fast-json-ui';
import { getComponentByType, componentMap } from './WidgetFactory';

// Define props
const props = defineProps({
  config: {
    type: Object as PropType<ComponentConfig>,
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

// 长按定时器
const longPressTimer = ref<number | null>(null);
const longPressThreshold = 500; // 长按阈值，单位毫秒

/**
 * 处理组件事件
 * @param event 事件对象
 * @param eventType 事件类型
 */
function handleEvent(event: Event | null, eventType: string) {
  // console.log(eventType);
  // 阻止右键菜单默认行为
  if (eventType === 'onContextMenu') {
    event?.preventDefault();
  }

  // 编辑模式下不触发交互事件（仅展示样式）
  if (FastJsonUI.isEditorMode()) {
    return;
  }
  
  // 检查配置中是否有对应的事件处理函数
  const eventHandler = props.config[eventType];

  if (eventHandler) {
    // 解析方法名和参数
    const result = FastJsonUI.getMethodFromConfig(eventHandler,props.data,props.methods);

     // 如果返回的是函数，则以组件为上下文调用
     if (result && typeof result === 'function') {
        result(props.config,props.data);
      }
  }
}

/**
 * 处理鼠标离开事件
 * 同时处理onMouseLeave事件和取消长按
 */
function onMouseLeave(event: Event) {
  // 处理onMouseLeave事件
  handleEvent(event, 'onMouseLeave');
  
  // 取消长按
  cancelLongPress();
}

/**
 * 开始长按计时
 */
function startLongPress(event: Event) {
  // 清除可能存在的定时器
  cancelLongPress();
  
  // 设置新的定时器
  longPressTimer.value = window.setTimeout(() => {
    handleEvent(event, 'onLongPress');
    longPressTimer.value = null;
  }, longPressThreshold);
}

/**
 * 取消长按计时
 */
function cancelLongPress() {
  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
}

/**
 * 判断是否为自定义组件
 */
function isCustomComponent(type: string): boolean {
  // 检查组件类型是否在组件映射中
  return !componentMap[type];
}

// 设置全局数据
FastJsonUI.setGlobalData('theme', 'dark');

// 修复模板中的类型错误
defineSlots<{
  default(props: { child: ComponentConfig }): any;
}>();


onMounted(() => {
  handleEvent(null, 'onMounted');
})
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.stack {
  position: relative;
}

.container {
  display: flex;
}
</style>