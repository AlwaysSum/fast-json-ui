import { ComponentCategory, ComponentMeta, PropertyType } from '../types';

// 可用组件列表
export const availableComponents: ComponentMeta[] =  [
  // 基础组件
  {
    type: 'text',
    name: '文本',
    icon: '📝',
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
      },
      {
        name: 'fontSize',
        label: '字体大小',
        type: PropertyType.STRING,
        defaultValue: '16px'
      },
      {
        name: 'color',
        label: '文本颜色',
        type: PropertyType.COLOR,
        defaultValue: '#333333'
      },
      {
        name: 'textAlign',
        label: '对齐方式',
        type: PropertyType.SELECT,
        defaultValue: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' }
        ]
      }
    ]
  },
  {
    type: 'image',
    name: '图片',
    icon: '🖼️',
    category: ComponentCategory.BASIC,
    defaultConfig: {
      type: 'image',
      src: 'https://via.placeholder.com/200x100',
      width: '200px',
      height: 'auto'
    },
    properties: [
      {
        name: 'src',
        label: '图片地址',
        type: PropertyType.STRING,
        defaultValue: 'https://via.placeholder.com/200x100',
        required: true
      },
      {
        name: 'width',
        label: '宽度',
        type: PropertyType.STRING,
        defaultValue: '200px'
      },
      {
        name: 'height',
        label: '高度',
        type: PropertyType.STRING,
        defaultValue: 'auto'
      },
      {
        name: 'alt',
        label: '替代文本',
        type: PropertyType.STRING,
        defaultValue: '图片'
      }
    ]
  },
  {
    type: 'button',
    name: '按钮',
    icon: '🔘',
    category: ComponentCategory.BASIC,
    defaultConfig: {
      type: 'button',
      text: '按钮',
      onClick: ''
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
        name: 'type',
        label: '按钮类型',
        type: PropertyType.SELECT,
        defaultValue: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' }
        ]
      },
      {
        name: 'size',
        label: '按钮大小',
        type: PropertyType.SELECT,
        defaultValue: 'medium',
        options: [
          { label: '小', value: 'small' },
          { label: '中', value: 'medium' },
          { label: '大', value: 'large' }
        ]
      },
      {
        name: 'onClick',
        label: '点击事件',
        type: PropertyType.METHOD,
        defaultValue: ''
      }
    ]
  },
  
  // 布局组件
  {
    type: 'container',
    name: '容器',
    icon: '📦',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'container',
      children: [],
      padding: '16px',
      margin: '0',
      backgroundColor: 'transparent'
    },
    properties: [
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
      },
      {
        name: 'backgroundColor',
        label: '背景颜色',
        type: PropertyType.COLOR,
        defaultValue: 'transparent'
      }
    ]
  },
  {
    type: 'row',
    name: '行布局',
    icon: '⬅️➡️',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'row',
      children: [],
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '8px'
    },
    properties: [
      {
        name: 'justifyContent',
        label: '水平对齐',
        type: PropertyType.SELECT,
        defaultValue: 'flex-start',
        options: [
          { label: '左对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'flex-end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '均匀分布', value: 'space-around' }
        ]
      },
      {
        name: 'alignItems',
        label: '垂直对齐',
        type: PropertyType.SELECT,
        defaultValue: 'center',
        options: [
          { label: '顶部对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '底部对齐', value: 'flex-end' },
          { label: '拉伸', value: 'stretch' }
        ]
      },
      {
        name: 'gap',
        label: '间距',
        type: PropertyType.STRING,
        defaultValue: '8px'
      }
    ]
  },
  {
    type: 'column',
    name: '列布局',
    icon: '⬆️⬇️',
    category: ComponentCategory.LAYOUT,
    defaultConfig: {
      type: 'column',
      children: [],
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '8px'
    },
    properties: [
      {
        name: 'justifyContent',
        label: '垂直对齐',
        type: PropertyType.SELECT,
        defaultValue: 'flex-start',
        options: [
          { label: '顶部对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '底部对齐', value: 'flex-end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '均匀分布', value: 'space-around' }
        ]
      },
      {
        name: 'alignItems',
        label: '水平对齐',
        type: PropertyType.SELECT,
        defaultValue: 'center',
        options: [
          { label: '左对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'flex-end' },
          { label: '拉伸', value: 'stretch' }
        ]
      },
      {
        name: 'gap',
        label: '间距',
        type: PropertyType.STRING,
        defaultValue: '8px'
      }
    ]
  },
  
  // 表单组件
  {
    type: 'input',
    name: '输入框',
    icon: '✏️',
    category: ComponentCategory.FORM,
    defaultConfig: {
      type: 'input',
      label: '输入框',
      placeholder: '请输入',
      value: '',
      required: false
    },
    properties: [
      {
        name: 'label',
        label: '标签',
        type: PropertyType.STRING,
        defaultValue: '输入框'
      },
      {
        name: 'placeholder',
        label: '占位文本',
        type: PropertyType.STRING,
        defaultValue: '请输入'
      },
      {
        name: 'value',
        label: '默认值',
        type: PropertyType.STRING,
        defaultValue: ''
      },
      {
        name: 'required',
        label: '是否必填',
        type: PropertyType.BOOLEAN,
        defaultValue: false
      }
    ]
  },
  {
    type: 'select',
    name: '下拉选择',
    icon: '🔽',
    category: ComponentCategory.FORM,
    defaultConfig: {
      type: 'select',
      label: '下拉选择',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ],
      value: '',
      required: false
    },
    properties: [
      {
        name: 'label',
        label: '标签',
        type: PropertyType.STRING,
        defaultValue: '下拉选择'
      },
      {
        name: 'options',
        label: '选项',
        type: PropertyType.EXPRESSION,
        defaultValue: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      },
      {
        name: 'value',
        label: '默认值',
        type: PropertyType.STRING,
        defaultValue: ''
      },
      {
        name: 'required',
        label: '是否必填',
        type: PropertyType.BOOLEAN,
        defaultValue: false
      }
    ]
  }
]; 