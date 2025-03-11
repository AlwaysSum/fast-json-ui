import { ComponentConfig } from 'fast-json-ui-vue';

/**
 * 组件分类
 */
export enum ComponentCategory {
  BASIC = 'basic',
  LAYOUT = 'layout',
  FORM = 'form',
  CUSTOM = 'custom'
}

/**
 * 组件元数据
 */
export interface ComponentMeta {
  type: string;
  name: string;
  icon?: string;
  category: ComponentCategory;
  defaultConfig: ComponentConfig;
  properties: PropertyMeta[];
}

/**
 * 属性元数据
 */
export interface PropertyMeta {
  name: string;
  label: string;
  type: PropertyType;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  required?: boolean;
}

/**
 * 属性类型
 */
export enum PropertyType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  COLOR = 'color',
  ICON = 'icon',
  EXPRESSION = 'expression',
  METHOD = 'method'
}

/**
 * 编辑器状态
 */
export interface EditorState {
  selectedComponent: ComponentConfig | null;
  rootComponent: ComponentConfig;
  componentPath: string[];
  undoStack: ComponentConfig[];
  redoStack: ComponentConfig[];
  previewMode: boolean;
}

/**
 * 编辑器配置
 */
export interface EditorConfig {
  customComponents?: ComponentMeta[];
  initialConfig?: ComponentConfig;
  theme?: 'light' | 'dark';
}

// Re-export types from fast-json-ui-vue
export type { ComponentConfig } from 'fast-json-ui-vue';

// Editor specific types
export interface EditorOptions {
  initialConfig?: any;
  readOnly?: boolean;
  theme?: string;
} 