import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'table',
  name: '表格',
  icon: '📋',
  category: 'advanced',
  defaultConfig: {
    type: 'table',
    columns: [
      { key: 'name', title: '名称' },
      { key: 'value', title: '值' }
    ],
    data: [
      { name: '示例A', value: '123' },
      { name: '示例B', value: '456' }
    ],
    striped: true,
    bordered: true,
    size: 'medium',
    width: '',
    height: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'columns', label: '列定义', type: 'array', group: 'structure', groupLabel: '结构' },
    { name: 'data', label: '数据源', type: 'array', group: 'structure', groupLabel: '结构' },
    { name: 'striped', label: '斑马纹', type: 'boolean', defaultValue: true, group: 'style', groupLabel: '样式' },
    { name: 'bordered', label: '显示边框', type: 'boolean', defaultValue: true, group: 'style', groupLabel: '样式' },
    { name: 'size', label: '尺寸', type: 'select', defaultValue: 'medium', group: 'size', groupLabel: '尺寸', options: [
      { label: '小', value: 'small' },
      { label: '中', value: 'medium' },
      { label: '大', value: 'large' },
    ] },
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