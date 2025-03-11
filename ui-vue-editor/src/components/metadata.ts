import { ComponentCategory, ComponentMeta, PropertyType } from '../types';

/**
 * 基础组件元数据
 */
export const basicComponents: ComponentMeta[] = [
  {
    type: 'text',
    name: '文本',
    icon: 'text-icon',
    category: ComponentCategory.BASIC,
    defaultConfig: {
      type: 'text',
      text: '文本内容'
    },
    properties: [
      {
        name: 'text',
        label: '文本内容',
        type: PropertyType.STRING,
        defaultValue: '文本内容',
        required: true
      }
    ]
  },
  {
    type: 'image',
    name: '图片',
    icon: 'image-icon',
    category: ComponentCategory.BASIC,
    defaultConfig: {
      type: 'image',
      src: 'https://via.placeholder.com/150',
      width: '100%',
      height: 'auto'
    },
    properties: [
      {
        name: 'src',
        label: '图片地址',
        type: PropertyType.STRING,
        defaultValue: 'https://via.placeholder.com/150',
        required: true
      },
      {
        name: 'width',
        label: '宽度',
        type: PropertyType.STRING,
        defaultValue: '100%'
      },
      {
        name: 'height',
        label: '高度',
        type: PropertyType.STRING,
        defaultValue: 'auto'
      }
    ]
  },
  {
    type: 'button',
    name: '按钮',
    icon: 'button-icon',
    category: ComponentCategory.BASIC,
    defaultConfig: {
      type: 'button',
      text: '按钮',
      onTap: ''
    },
    properties: [
      {
        name: 'text',
        label: '按钮文本',
        type: PropertyType.STRING,
        defaultValue: '按钮',
        required: true
      },
      {
        name: 'onTap',
        label: '点击事件',
        type: PropertyType.METHOD,
        defaultValue: ''
      }
    ]
  }
];

/**
 * 布局组件元数据
 */
export const layoutComponents: ComponentMeta[] = [
  {
    type: 'container',
    name: '容器',
    icon: 'container-icon',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'container',
      child: {
        type: 'text',
        text: '容器内容'
      },
      color: '#ffffff',
      padding: '16px',
      margin: '0'
    },
    properties: [
      {
        name: 'color',
        label: '背景颜色',
        type: PropertyType.COLOR,
        defaultValue: '#ffffff'
      },
      {
        name: 'padding',
        label: '内边距',
        type: PropertyType.STRING,
        defaultValue: '16px'
      },
      {
        name: 'margin',
        label: '外边距',
        type: PropertyType.STRING,
        defaultValue: '0'
      }
    ]
  },
  {
    type: 'row',
    name: '行布局',
    icon: 'row-icon',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'row',
      children: [
        {
          type: 'text',
          text: '列 1'
        },
        {
          type: 'text',
          text: '列 2'
        }
      ]
    },
    properties: []
  },
  {
    type: 'column',
    name: '列布局',
    icon: 'column-icon',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'column',
      children: [
        {
          type: 'text',
          text: '行 1'
        },
        {
          type: 'text',
          text: '行 2'
        }
      ]
    },
    properties: []
  },
  {
    type: 'stack',
    name: '堆叠布局',
    icon: 'stack-icon',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'stack',
      children: [
        {
          type: 'text',
          text: '层 1'
        },
        {
          type: 'text',
          text: '层 2'
        }
      ]
    },
    properties: []
  }
];

/**
 * 所有组件元数据
 */
export const allComponents: ComponentMeta[] = [
  ...basicComponents,
  ...layoutComponents
];

/**
 * 根据类型获取组件元数据
 */
export function getComponentMetaByType(type: string): ComponentMeta | undefined {
  return allComponents.find(component => component.type === type);
}

/**
 * 根据类别获取组件元数据
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return allComponents.filter(component => component.category === category);
} 