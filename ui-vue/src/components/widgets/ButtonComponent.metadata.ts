import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'button',
  name: '按钮',
  icon: '🔘',
  category: 'basic',
  defaultConfig: {
    type: 'button',
    text: '按钮',
    size: 'medium',
    onTap: ''
  },
  properties: [
    { name: 'text', label: '文本', type: 'string', defaultValue: '按钮', required: true },
    { name: 'size', label: '尺寸', type: 'select', defaultValue: 'medium', options: [
      { label: '小', value: 'small' },
      { label: '中', value: 'medium' },
      { label: '大', value: 'large' }
    ] },
    { name: 'onTap', label: '点击事件', type: 'method' }
  ]
};

export default metadata; 