import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'text',
  name: '文本',
  icon: '📝',
  category: 'basic',
  defaultConfig: {
    type: 'text',
    text: '文本内容'
  },
  properties: [
    { name: 'text', label: '文本内容', type: 'string', defaultValue: '文本内容', required: true }
  ]
};

export default metadata; 