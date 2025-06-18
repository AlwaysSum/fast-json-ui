import { WidgetMeta } from '../../WidgetFactory';

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
    height: '',
    fit: '',
    radius: '',
    border: '',
    boxShadow: '',
    margin: '',
    padding: '',
    backgroundColor: '',
    preview: false,
    lazy: false,
    objectPosition: ''
  },
  properties: [
    { name: 'src', label: '图片地址', type: 'string', defaultValue: '', required: true },
    { name: 'alt', label: '替代文本', type: 'string', defaultValue: '' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '' },
    { name: 'fit', label: '适应模式', type: 'select', defaultValue: '', options: [
      { label: '填充', value: 'fill' },
      { label: '包含', value: 'contain' },
      { label: '覆盖', value: 'cover' },
      { label: '缩放', value: 'scale-down' },
      { label: '无', value: '' }
    ] },
    { name: 'radius', label: '圆角', type: 'string', defaultValue: '' },
    { name: 'border', label: '边框', type: 'string', defaultValue: '' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '' },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '' },
    { name: 'preview', label: '可预览', type: 'boolean', defaultValue: false },
    { name: 'lazy', label: '懒加载', type: 'boolean', defaultValue: false },
    { name: 'objectPosition', label: '定位', type: 'string', defaultValue: '' }
  ]
};

export default metadata; 