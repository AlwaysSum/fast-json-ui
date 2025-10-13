import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'form',
  name: '表单',
  icon: '📝',
  category: 'form',
  defaultConfig: {
    type: 'form',
    children: [],
    direction: 'vertical',
    gap: '12px',
    showSubmit: true,
    submitText: '提交',
    onSubmit: '',
    width: '',
    height: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'children', label: '表单内容', type: 'children', group: 'structure', groupLabel: '结构' },
    { name: 'direction', label: '排列方向', type: 'select', defaultValue: 'vertical', group: 'layout', groupLabel: '布局', options: [
      { label: '纵向', value: 'vertical' },
      { label: '横向', value: 'horizontal' },
    ] },
    { name: 'gap', label: '间距', type: 'string', defaultValue: '12px', group: 'layout', groupLabel: '布局' },
    { name: 'showSubmit', label: '显示提交按钮', type: 'boolean', defaultValue: true, group: 'state', groupLabel: '状态' },
    { name: 'submitText', label: '提交文案', type: 'string', defaultValue: '提交', group: 'content', groupLabel: '内容' },
    { name: 'onSubmit', label: '提交事件', type: 'method', defaultValue: '', group: 'event', groupLabel: '事件' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'borderRadius', label: '圆角', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
  ]
};

export default metadata;