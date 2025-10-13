import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'text',
  name: '文本',
  icon: '📝',
  category: 'basic',
  defaultConfig: {
    type: 'text',
    text: '文本内容',
    color: '#222',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    margin: 0,
    padding: 0,
    backgroundColor: '',
    ellipsis: false
  },
  properties: [
    { name: 'text', label: '文本内容', type: 'string', defaultValue: '文本内容', required: true, group: 'content', groupLabel: '内容' },
    { name: 'color', label: '文字颜色', type: 'color', defaultValue: '#222', group: 'style', groupLabel: '样式' },
    { name: 'fontSize', label: '字号', type: 'number', defaultValue: 16, group: 'style', groupLabel: '样式' },
    { name: 'fontWeight', label: '加粗', type: 'select', defaultValue: 'normal', group: 'style', groupLabel: '样式', options: [
      { label: '正常', value: 'normal' },
      { label: '加粗', value: 'bold' },
      { label: '更粗', value: 'bolder' },
      { label: '更细', value: 'lighter' }
    ] },
    { name: 'fontStyle', label: '字体样式', type: 'select', defaultValue: 'normal', group: 'style', groupLabel: '样式', options: [
      { label: '正常', value: 'normal' },
      { label: '斜体', value: 'italic' },
      { label: '倾斜', value: 'oblique' }
    ] },
    { name: 'textAlign', label: '对齐方式', type: 'select', defaultValue: 'left', group: 'layout', groupLabel: '布局', options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
      { label: '两端对齐', value: 'justify' }
    ] },
    { name: 'lineHeight', label: '行高', type: 'number', defaultValue: 1.5, group: 'style', groupLabel: '样式' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '0', group: 'spacing', groupLabel: '间距' },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '0', group: 'spacing', groupLabel: '间距' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'ellipsis', label: '超出省略', type: 'boolean', defaultValue: false, group: 'state', groupLabel: '状态' }
  ]
};

export default metadata;