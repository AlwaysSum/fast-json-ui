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
 * 组件配置
 */
export interface ComponentConfig {
  type: string;
  [key: string]: any;
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

/**
 * 编辑器选项
 */
export interface EditorOptions {
  initialConfig?: ComponentConfig;
  readOnly?: boolean;
  theme?: string;
} 