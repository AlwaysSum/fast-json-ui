import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'image',
  name: '图片',
  icon: '🖼️',
  category: 'basic',
  defaultConfig: {
    type: 'image',
    src: '',
    alt: '',
    width: '',
    height: ''
  },
  properties: [
    { name: 'src', label: '图片地址', type: 'string', defaultValue: '', required: true },
    { name: 'alt', label: '替代文本', type: 'string', defaultValue: '' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '' }
  ]
};

export default metadata; 