import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'menubar',
  name: '菜单栏',
  icon: '📑',
  category: 'advanced',
  defaultConfig: {
    type: 'menubar',
    items: [
      { label: '菜单一', key: '1' },
      { label: '菜单二', key: '2' }
    ],
    selectedKey: '1',
    mode: 'vertical',
    onSelect: '',
    width: '',
    height: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'items', label: '菜单项', type: 'array', group: 'structure', groupLabel: '结构' },
    { name: 'selectedKey', label: '选中项Key', type: 'string', defaultValue: '1', group: 'state', groupLabel: '状态' },
    { name: 'mode', label: '布局方向', type: 'select', defaultValue: 'vertical', group: 'layout', groupLabel: '布局', options: [
      { label: '纵向', value: 'vertical' },
      { label: '横向', value: 'horizontal' },
    ] },
    { name: 'onSelect', label: '选择事件', type: 'method', defaultValue: '', group: 'event', groupLabel: '事件' },
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