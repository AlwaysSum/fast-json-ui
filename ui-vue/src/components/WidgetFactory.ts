import { type Component } from 'vue';

// 导入组件
import TextComponent from './widgets/TextComponent.vue';
import TestComponent from './widgets/TestComponent.vue';
import ImageComponent from './widgets/ImageComponent.vue';
import ButtonComponent from './widgets/ButtonComponent.vue';
import ContainerComponent from './widgets/ContainerComponent.vue';
import RowComponent from './widgets/RowComponent.vue';
import ColumnComponent from './widgets/ColumnComponent.vue';
import StackComponent from './widgets/StackComponent.vue';
import DefaultComponent from './widgets/DefaultComponent.vue';

// 组件映射
export const componentMap: Record<string, Component> = {
  // 基础组件
  'text': TextComponent,
  'test': TestComponent,
  'image': ImageComponent,
  'button': ButtonComponent,
  'container': ContainerComponent,
  
  // 布局组件
  'row': RowComponent,
  'column': ColumnComponent,
  'stack': StackComponent,
  
  // 默认组件（用于处理未知类型）
  'default': DefaultComponent
};

/**
 * 获取组件类型
 * @param type 组件类型
 * @returns 对应的组件
 */
export function getComponentByType(type: string): Component {
  return componentMap[type] || componentMap['default'];
}

/**
 * 注册自定义组件
 * @param type 组件类型名称
 * @param component 组件实例
 */
export function registerCustomComponent(type: string, component: Component): void {
  if (componentMap[type]) {
    console.warn(`组件类型 "${type}" 已存在，将被覆盖`);
  }
  componentMap[type] = component;
}

/**
 * 批量注册自定义组件
 * @param components 组件映射对象
 */
export function registerCustomComponents(components: Record<string, Component>): void {
  Object.entries(components).forEach(([type, component]) => {
    registerCustomComponent(type, component);
  });
}

// 导出所有组件，方便单独使用
export {
  TextComponent,
  TestComponent,
  ImageComponent,
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  ColumnComponent,
  StackComponent,
  DefaultComponent
}; 