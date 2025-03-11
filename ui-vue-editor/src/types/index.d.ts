import { App, Component } from 'vue';
import { ComponentConfig } from 'fast-json-ui-vue';

export const JsonUiEditor: Component;

export enum ComponentCategory {
  BASIC = 'basic',
  LAYOUT = 'layout',
  FORM = 'form',
  CUSTOM = 'custom'
}

export interface ComponentMeta {
  type: string;
  name: string;
  icon?: string;
  category: ComponentCategory;
  defaultConfig: ComponentConfig;
  properties: PropertyMeta[];
}

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

export interface PropertyMeta {
  name: string;
  label: string;
  type: PropertyType;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  required?: boolean;
}

export interface EditorState {
  selectedComponent: ComponentConfig | null;
  rootComponent: ComponentConfig;
  componentPath: string[];
  undoStack: ComponentConfig[];
  redoStack: ComponentConfig[];
  previewMode: boolean;
}

export interface EditorConfig {
  customComponents?: ComponentMeta[];
  initialConfig?: ComponentConfig;
  theme?: 'light' | 'dark';
}

export function install(app: App): void;

export const FastJsonUiEditor: {
  install: typeof install;
  JsonUiEditor: Component;
}; 