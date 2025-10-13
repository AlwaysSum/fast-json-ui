import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'stack',
  name: '堆叠布局',
  icon: '🗂️',
  category: 'layout',
  defaultConfig: {
    type: 'stack',
    children: [],
    gap: '',
    align: '',
    justify: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
    width: '',
    height: '',
    zIndexMap: {}
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children', group: 'structure', groupLabel: '结构' },
    { name: 'gap', label: '间距', type: 'string', defaultValue: '', group: 'layout', groupLabel: '布局' },
    { name: 'align', label: '垂直对齐', type: 'select', defaultValue: '', group: 'layout', groupLabel: '布局', options: [
      { label: '顶部', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '底部', value: 'flex-end' },
      { label: '拉伸', value: 'stretch' }
    ] },
    { name: 'justify', label: '主轴对齐', type: 'select', defaultValue: '', group: 'layout', groupLabel: '布局', options: [
      { label: '起始', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '结尾', value: 'flex-end' },
      { label: '平均分布', value: 'space-between' },
      { label: '均匀分布', value: 'space-around' },
      { label: '等间距', value: 'space-evenly' }
    ] },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'borderRadius', label: '圆角', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'zIndexMap', label: '子项zIndex映射', type: 'array', defaultValue: {}, group: 'layer', groupLabel: '层级' }
  ]
};

export default metadata;